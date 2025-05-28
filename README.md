# 基于Vue3周边框架学习和研究

## eslint相关

1. eslint：eslint核心包
2. eslint-config-prettier： ESLint 配置规则的包，它的主要作用是禁用与 Prettier 冲突的 ESLint 规则
3. eslint-define-config： 将 Prettier 应用到 ESLint 中。它会使用 Prettier 来格式化代码，并将格式化结果作为 ESLint 的一项规则来检查代码，使得在代码检查的同时，能够自动格式化代码，使其符合 Prettier 的规则
4. eslint-plugin-prettier： 辅助定义 ESLint 配置。它可以让 ESLint 配置文件的编写更加类型安全和直观，借助 TypeScript 的类型系统，在编写配置时能获得更好的代码提示和错误检查，避免配置出错。
5. eslint-plugin-vue： 对 Vue 组件进行有效的代码质量检查
6. @typescript-eslint/eslint-plugin： 该插件为 TypeScript 代码提供了 ESLint 规则
7. @typescript-eslint/parser： 这是一个用于解析 TypeScript 代码的解析器。它将 TypeScript 代码解析为 ESLint 可以处理的抽象语法树（AST），使得 ESLint 能够对 TypeScript 代码应用规则进行检查。
8. vue-eslint-parser

## stylelint相关

1. stylelint: CSS检测工具
2. stylelint-config-prettier: 关闭所有不必要的规则或可能与Prettier冲突的规则,当开发者既想利用Stylelint的强大检查能力，又希望享受Prettier自动化代码格式化的便捷时，就可以使用stylelint-config-prettier
3. stylelint-config-recommended：一套基本的、经过验证的规则集，能够帮助用户快速启动并运行Stylelint检查
4. stylelint-config-recommended-vue: 专门用来检验Vue文件中样式的规则包
5. stylelint-config-standard: 是stylelint的推荐配置，包含了一系列常见的、被广泛认可的CSS书写规范
6. stylelint-order： 是一个CSS属性排序插件，它提供了给CSS属性排序的功能。通过该插件，开发者可以自定义CSS属性的书写顺序，使代码更加整齐、易读

## git校验相关

1. husky: Git 钩子管理工具，允许在 Git 事件（如提交、推送）触发时运行自定义脚本，例如`pre-commit`
2. lint-staged: 仅针对 Git 暂存区（Staged）中的文件执行代码检查和格式化，避免全量扫描，提高效率,确保每次提交只处理修改的内容
3. @commitlint/cli: 校验 Git 提交信息是否符合规范（如 Conventional Commits 格式），避免随意提交
4. @commitlint/config-conventional: 提供一套预定义的提交规范配置，基于 Conventional Commits 标准，简化

## css相关

1. less
2. postcss： 将 CSS 解析为抽象语法树（AST），支持插件对 AST 进行操作，例如添加浏览器前缀、转换未来 CSS 语法等
3. postcss-html： 处理 HTML 中内联样式，统一应用 PostCSS 插件（如自动前缀、变量替换）
4. postcss-less: 支持直接处理 Less 预处理器代码，结合 PostCSS 插件增强 Less 的功能
