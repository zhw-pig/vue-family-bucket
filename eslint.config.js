import css from '@eslint/css'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// 导入json文件需要添加类型断言：with { type: 'json' }
import authImport from './.eslintrc-auto-import.json' with { type: 'json' }

// 定义eslint白名单
// 扁平配置中的模式  仅忽略与配置文件位于同一目录中名 的文件
const whiteList = [
    '**/dist',
    './src/main.ts',
    '.vscode',
    '.idea',
    '*.sh',
    '**/node_modules',
    '*.md',
    '*.woff',
    '*.woff',
    '*.ttf',
    'yarn.lock',
    'package-lock.json',
    '/public',
    '/docs',
    '**/output',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
]

// 自定义eslint规则
const rules = {
    'vue/multi-word-component-names': 'off', // 组件名可以不用多单词,可以使用index.vue
    'no-multi-spaces': 'error',
    'no-self-compare': 'error',
    'no-useless-concat': 'error',
    'key-spacing': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'operator-assignment': 'error',
    quotes: ['error', 'single'],
    'semi-spacing': 'error',
    'semi-style': 'error',
    'space-before-blocks': 'error',
    'space-infix-ops': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'rest-spread-spacing': 'error',
    camelcase: ['error', { properties: 'never' }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-indent': ['error', 4],
    'vue/html-quotes': ['error', 'single'],
}

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node, ...authImport.globals } },
    },
    tseslint.configs.recommended,
    pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
    },
    // 该对象不能写其他属性，否则eslint会报错
    {
        ignores: whiteList, // eslint忽略 文件, 不能写在含有files的对象里，否则ignores不生效
    },
    {
        rules,
    },
])
