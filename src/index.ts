function createUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default class Store<T> {
    public debug: boolean;
    public debugger: (constructorName: string, states: T[]) => void;
    private _states: T[];
    private _observers: {
        [key: string]: (state: T) => void;
    };
    private _hasStateInit: boolean;

    constructor() {
        this.debug = false;
        this.debugger = (name, states) => {
            console.log(name, states.slice(-5));
        }
        this._states = [] as T[];
        this._observers = {};
        this._hasStateInit = false;
    }

    get state() {
        return {...this._states[this._states.length - 1]};
    }

    set state(newState: T) {
        if (!this._hasStateInit) {
            this._states.push(Object.freeze(newState));
            this._hasStateInit = true;
            return;
        }
        this.set(newState);
    }

    private runObserver(key: string) {
        this._observers[key](this._states[this._states.length - 1]);
    }

    async set<K extends keyof T> (nextState: | ((prevState: T) => Pick<T, K>) | Pick<T, K>): Promise<T> {
        if (!this._hasStateInit) {
            this._hasStateInit = true;
        }

        return new Promise(async (resolve, reject) => {
            this.beforeStateChange();

            let newState: any = nextState;
            const prevState = this._states[this._states.length - 1];

            if (typeof newState === 'function') {
                newState = newState(prevState);
            }

            if (typeof newState !== 'object') {
                reject(new TypeError('nextState is not object.'));
            }

            newState = Object.freeze({
                ...prevState,
                ...newState,
            });

            this._states.push(newState);

            if (this.debug && this.debugger) {
                const name = Object.getPrototypeOf(this).constructor.name;
                this.debugger(name || 'anonymous', [...this._states]);
            } else {
                this._states.shift();
            }

            await Promise.all(Object.keys(this._observers).map(key => {
                return new Promise((resolve) => {
                    try {
                        this.runObserver(key);
                    } catch(e) {
                        this.unsubscribe(key);
                    }
                    resolve(true);
                });
            }));
            
            this.afterStateChange();
            resolve(newState);
        });
    }

    beforeStateChange() {
        
    }

    afterStateChange() {

    }

    subscribe(fn: (state: T) => void) {
        fn(this.state);
        const key = createUUID();
        this._observers[key] = fn;
        return key;
    }

    unsubscribe(key: string) {
        delete this._observers[key];
    }

    syncValue(valueName: keyof T, setValue: (value: any) => void) {
        return () => {
            const key = this.subscribe((state) => {
                setValue(state[valueName]);
            });
            return () => {
                this.unsubscribe(key);
            }
        }
    }

    syncState(setState: (state: T) => void) {
        return () => {
            const key = this.subscribe((state) => {
                setState(state);
            });
            return () => {
                this.unsubscribe(key);
            }
        }
    }
}

export function createStore<T>(initialState: T) {
    const store = new Store<T>()
    store.state = initialState;
    return store;
}