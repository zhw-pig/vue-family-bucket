<template>
    <ConfigProvider>
        <AppProvider>
            <RouterView />
        </AppProvider>
    </ConfigProvider>
</template>

<script lang="ts" setup>
    import { ConfigProvider } from 'ant-design-vue'

    const num: string = 123
    console.log(num)
</script>
