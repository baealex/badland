import Store from 'badland';
import { useEffect, useState } from 'react';

export function useStore<T>(store: Store<T>): [T, <K extends keyof T>(nextState: ((prevState: T) => Pick<T, K>) | Pick<T, K>) => Promise<T>] {
    const [ state, setState ] = useState<T>(store.state);

    useEffect(() => {
        const key = store.subscribe(setState);
        return () => store.unsubscribe(key);
    }, []);

    return [ state, store.set ];
}

export function useValue<T>(store: Store<T>, name: keyof T): [T[keyof T], (v: T[keyof T]) => Promise<T>]{
    const [ value, setValue ] = useState(store.state[name]);

    useEffect(() => {
        const key = store.subscribe((prevState) => setValue(prevState[name]));
        return () => store.unsubscribe(key);
    }, []);

    return [ value, (v: typeof value) => store.set((prevState) => ({ ...prevState, [name]: v })) ];
}
