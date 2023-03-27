# badland

- Easy to use.
- No dependencies.

<br>

## Usage

### Creating a store

To create a store, you can either inherit the `Store` class provided by `badland` and implement the store yourself, or you can use the createStore function provided by `badland`:

```js
// store/auth.ts

import Store from 'badland'

interface AuthStoreState {
    isLogin: boolean;
    username: string;
}

const INIT_STATE = {
    isLogin: false,
    username: '',
}

class AuthStore extends Store<AuthStoreState> {
    constructor() {
        super()
        this.state = INIT_STATE
    }
}

export const authStore = new AuthStore()
```

Alternatively, you can create a store using the `createStore` function:

```js
import { createStore } from 'badland'

export const authStore = createStore({
    isLogin: false,
    username: '',
})
```

<br>

### Subscribing to a store

You can subscribe to a store's state changes using the `subscribe` method. This method returns a `key` value that you can use to unsubscribe later:

```js
import { authStore } from '~/store/auth'

const key = authStore.subscribe((state) => {
    document.getElementById('root').innerHTML = !state.isLogin
        ? `<div>You need to log in.</div>`
        : `<div>Welcome, ${state.username}!</div>`
})

// authStore.unsubscribe(key)
```

<br>

### Changing a store's state

To change a store's state, you can pass an object with the new values to the `set` method:

```js
authStore.set({
    isLogin: true,
    username: 'baealex1',
})
```

Alternatively, you can pass a function that takes the previous state and returns a new state:

```js
authStore.set((prevState) => ({
    ...prevState,
    username: 'baealex2',
}))
```

You can also pass an object with only the properties that need to be changed:

```js
authStore.set((prevState) => ({
    username: 'baealex3',
}))
```

<br>

### Detecting state changes

You can override the `beforeStateChange` and `afterStateChange` methods to execute custom logic before and after the state changes:

```js
import Store from 'badland'

export interface AuthStoreState {
    isLogin: boolean
    username: string
}

class AuthStore extends Store<AuthStoreState> {
    constructor() {
        super()
        this.state = {
            isLogin: false,
            username: '',
        }
    }

    beforeStateChange() {
        alert('start set, before state change')
    }

    afterStateChange() {
        alert('end set, after state change')
    }
}

export const authStore = new AuthStore()
```

<br>

### Debugging a store

To enable debugging for a store, set the `debug` property to `true`:

```js
import Store from 'badland'

export interface AuthStoreState {
    isLogin: boolean
    username: string
}

class AuthStore extends Store<AuthStoreState> {
    constructor() {
        super()
        this.debug = true,
        this.state = {
            isLogin: false,
            username: '',
        }
    }
}

export const authStore = new AuthStore()
```

When debugging is enabled, every time the state changes, a log message will be outputted. The log message looks like this:

```
authStore > Array(1) [ {…} ]
authStore > Array(2) [ {…}, {…} ]
authStore > Array(3) [ {…}, {…}, {…} ]
```

You can modify the `debugger` variable by overriding it. The `name` refers to the name of the store and `states` contains the accumulated change history.

```js
import Store from 'badland'

export interface AuthStoreState {
    isLogin: boolean
    username: string
}

class AuthStore extends Store<AuthStoreState> {
    constructor() {
        super()
        this.debug = true,
        this.debugger = (name, states) => {
            // console.log(name, states.slice(-5))
        }
        this.state = {
            isLogin: false,
            username: '',
        }
    }
}

export const authStore = new AuthStore()
```
