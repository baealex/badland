import Store from '..';

type Storage = 'localStorage' | 'sessionStorage';

export function rememberOnStorage<T>(key: string, store: Store<T>, targetStorage: Storage = 'localStorage') {
    if (targetStorage in window) {
        const value = window[targetStorage].getItem(key);

        if (value) {
            store.set((prevState) => ({
                ...prevState,
                ...JSON.parse(value)
            }));
        }

        store.subscribe((state) => {
            window[targetStorage].setItem(key, JSON.stringify(state));
        });
    }
}
