# badland

- 쉽습니다.
- 의존이 없습니다.

<br>

## 사용방법

### 스토어 생성

`badland`에서 제공하는 스토어를 상속받아서 스토어를 구현합니다.

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

또는 아래 함수를 사용하여 생성할 수 있습니다.

```js
import { createStore } from 'badland'

export const authStore = createStore({
    isLogin: false,
    username: '',
})
```

<br>

### 스토어 구독

`subscribe` 메서드로 상태의 변경을 감시할 수 있습니다. 이 메서드는 `key` 값을 리턴하며 이 값은 구독 해제시 사용합니다. 

```js
import { authStore } from '~/store/auth'

const key = authStore.subscribe((state) => {
    document.getElementById('root').innerHTML = !state.isLogin
        ? `<div>로그인이 필요합니다.</div>`
        : `<div>${state.username}님 환영합니다!</div>`
})

// authStore.unsubscribe(key)
```

<br>

### 스토어 상태 변경

객체를 전달하여 값을 변경합니다.

```js
authStore.set({
    isLogin: true,
    username: 'baealex1',
})
```

함수로 전달하면 이전 상태를 받을 수 있습니다.

```js
authStore.set((prevState) => ({
    ...prevState,
    username: 'baealex2',
}))
```

변경이 필요한 객체만 전달해도 됩니다.

```js
authStore.set((prevState) => ({
    username: 'baealex3',
}))
```

<br>

### 스토어 상태 변경 감지

`beforeStateChange`, `afterStateChange` 메서드를 오버라이딩하여 상태 변경시 동작할 로직을 작성할 수 있습니다.

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

### 스토어 디버깅

스토어의 `debug` 변수를 `true`로 변경합니다.

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

이후 상태 변경시 로그가 아래와 같이 출력됩니다.

```
authStore > Array(1) [ {…} ]
authStore > Array(2) [ {…}, {…} ]
authStore > Array(3) [ {…}, {…}, {…} ]
```

`debugger` 변수를 오버라이딩하여 수정할 수 있습니다. `name`은 스토어의 이름 `states`는 변경 기록이 누적된 값입니다.

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
