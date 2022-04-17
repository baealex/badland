# badland

1. Zero dependency.
1. Promise based.
1. Safety.
1. Easy.

## Tutorials

`/stores/auth.ts`

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
}

export const authStore = new AuthStore()
```

or

```js
export const authStore = createStore({
    isLogin: false,
    username: '',
})
```

#### In the Components

`/components/login.tsx`

```js
import { useEffect, useState } from 'react'
import { authStore } from '../stores/auth'

export default function Login() {
    const [ isLogin, setIsLogin ] = useState(authStore.state.isLogin)
    const [ username, setUsername ] = useState(authStore.state.username)
    const [ password, setPassword ] = useState('')

    useEffect(() => {
        const key = authStore.subscribe((state) => {
            setIsLogin(state.isLogin)
            setUsername(state.username)
        })

        return () => authStore.unsubscribe(key)
    }, [])

    return <></>
}
```

If you need sync only one state key like this.

```js
import { useEffect, useState } from 'react'
import { authStore } from '../stores/auth'

export default function Login() {
    const [ username, setUsername ] = useState(authStore.state.username)
    const [ password, setPassword ] = useState('')

    useEffect(authStore.syncValue('username', setUsername), [])

    return <></>
}
```

Now, call `set` method of `Store` on anywhere.

```js
authStore.set({
    isLogin: true,
    username: 'baealex1',
})
```

or

```js
authStore.set((prevState) => ({
    ...prevState,
    username: 'baealex2',
}))
```

or

```js
authStore.set((prevState) => ({
    username: 'baealex3',
}))
```

If you want to handle the state changes. override this methods.

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

#### How to state debugging

`/stores/auth.ts`

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

after, call `set`. then, check your console.

```
authStore > Array(1) [ {…} ]
authStore > Array(2) [ {…}, {…} ]
authStore > Array(3) [ {…}, {…}, {…} ]
```

Let's create debugger!

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