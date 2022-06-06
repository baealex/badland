import Store from './'

let tested = 0
let passed = 0

function describe(text: string) {
    return {
        expect(value1: any) {
            tested++
        
            return {
                async toBe(value2: any) {
                    const v1 = JSON.stringify(value1)
                    const v2 = JSON.stringify(value2)
        
                    if (v1 === v2) {
                        passed++
                        console.log('[통과] ' + text)
                    } else {
                        console.log('[실패] ' + text)
                    }
                    console.log(`:: expect: ${v1}, to-be: ${v2}\n`)
                },
                async notToBe(value2: any) {
                    const v1 = JSON.stringify(value1)
                    const v2 = JSON.stringify(value2)
        
                    if (v1 !== v2) {
                        passed++
                        console.log('[통과] ' + text)
                    } else {
                        console.log('[실패] ' + text)
                    }
                    console.log(`:: expect: ${v1}, not-to-be: ${v2}\n`)
                }
            }
        }
    }
}

async function test() {
    class MyStore extends Store<{ name: string, age: number }> {
        constructor() {
            super()
            this.state = { name: 'A', age: 1 }
        }
    }



    console.log('=== set 메서드 테스트 ===')
    const store = new MyStore()
    describe('상태가 정상적으로 초기화 됩니다.')
        .expect(store.state).toBe({ name: 'A', age: 1 })

    await store.set({ name: 'B' })
    describe('상태중 일부가 변경됩니다.')
        .expect(store.state).toBe({ name: 'B', age: 1 })

    await store.set((prevState) => ({
        name: prevState.name + 'ae',
        age: prevState.age + 1
    }))
    describe('상태중 다수가 변경됩니다.')
        .expect(store.state).toBe({ name: 'Bae', age: 2 })


    
    console.log('=== subscribe 메서드 테스트 ===')
    let testValue = 1
    const key = store.subscribe(() => testValue = 5)
    describe('상태 구독시 UUID 키 값이 생성됩니다.')
        .expect(key).notToBe(undefined)
    describe('상태 구독 이벤트는 아직 실행되지 않습니다.')
        .expect(testValue).notToBe(5)
    
    await store.set({})
    describe('상태 변경시 구독한 이벤트가 발생합니다')
        .expect(testValue).toBe(5)


    
    console.log('=== unsubscribe 메서드 테스트 ===')
    testValue = 0
    store.unsubscribe(key)
    await store.set({})
    describe('상태 구독 해제시 구독 이벤트는 실행되지 않습니다.')
        .expect(testValue).notToBe(5)



    console.log('=== syncState 메서드 테스트 ===')
    let state = {}
    const useEffect1 = store.syncState((_state) => { state = {..._state} })
    const useEffectDie1 = useEffect1()

    await store.set({})
    describe('useEffect가 실행되면 상태가 동기화 됩니다.')
        .expect(state).toBe(store.state)
    useEffectDie1()

    await store.set({ name: 'Jino Bae' })
    describe('useEffect의 생명 주기 종료시 상태 동기화가 해제됩니다.')
        .expect(state).notToBe(store.state)

    

    console.log('=== syncValue 메서드 테스트 ===')
    let value = ''
    const useEffect2 = store.syncValue('name', (_value) => { value = _value })
    const useEffectDie2 = useEffect2()

    await store.set({})
    describe('useEffect가 실행되면 값이 동기화 됩니다.')
        .expect(value).toBe(store.state.name)
    useEffectDie2()

    await store.set({ name: 'Jino' })
    describe('useEffect의 생명 주기 종료시 값 동기화가 해제됩니다.')
        .expect(value).notToBe(store.state.name)
}

async function main() {
    await test()
    console.log(`${passed} / ${tested} (${(passed / tested * 100).toFixed(2)}%)`)
}

main()
