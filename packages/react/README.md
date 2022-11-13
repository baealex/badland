# badland-react

다음과 같은 `badland` 스토어가 있다고 가정합니다.

```js
// store/auth.ts

import { createStore } from 'badland'

export const authStore = createStore({
    isLogin: false,
    username: '',
})
```

상태 객체를 공유하기 위해선 `useStore` hook을 사용합니다.

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

단일 값를 공유하기 위해선 `useValue` hook을 사용합니다.

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
