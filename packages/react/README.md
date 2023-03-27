# badland-react

Let's assume that there is a `badland` store like the following:

```js
// store/auth.ts

import { createStore } from 'badland'

export const authStore = createStore({
    isLogin: false,
    username: '',
})
```

To share the state object, we use the `useStore` hook.

```js
import { useStore } from 'badland-react'
import { authStore } from '~/store/auth'

function Component() {
    const [ state, setState ] = useStore(authStore)

    return (
        <div>
            {state.username}
        </div>
    )
}
```

To share a single value, you can use the `useValue` hook.

```js
import { useValue } from 'badland-react'
import { authStore } from '~/store/auth'

function Component() {
    const [ username, setUsername ] = useValue(authStore, 'username')

    return (
        <div>
            {username}
        </div>
    )
}
```
