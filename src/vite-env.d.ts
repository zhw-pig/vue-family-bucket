/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'

    const component: DefineComponent<PropsType, DataType, MethodsAndComputedType>
    export default component
}
