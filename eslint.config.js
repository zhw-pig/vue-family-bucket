import antfu from '@antfu/eslint-config'

export default antfu({
    // @stylistic/eslint-plugin-plus
    stylistic: true,
    // eslint-plugin-format
    formatters: true,
    // vue的eslint配置
    typescript: true,
    vue: true,
    stylistic: {
        indent: 4, // 4, or 'tab'
        quotes: 'single', // or 'double'
    },
    // 保存删除未引入的代码
    // isInEditor: false,
    // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
    ignores: [
        '*.sh',
        'node_modules',
        '*.md',
        '*.woff',
        '*.ttf',
        '.idea',
        '/public',
        '/docs',
        '.husky',
        '.local',
        '/bin',
        'Dockerfile',
        'vite.config.ts',
        'eslint.config.js',
    ],
    lessOpinionated: true,
    rules: {
        'vue/multi-word-component-names': 'off', // 组件名可以不用多单词,可以使用index.vue
        'no-console': 'off',
        'no-debugger': 'error',
        '@typescript-eslint/no-explicit-any': 'error', // 禁止显式使用 any 类型
        'style/indent': ['error', 4], // 强制 4 空格缩进
        '@/indent': 'off', // 关闭 TypeScript 的独立缩进规则
        'vue/script-indent': ['error', 4], // Vue <script> 缩进
        'vue/html-indent': ['error', 4], // Vue <template> 缩进
    },
})
