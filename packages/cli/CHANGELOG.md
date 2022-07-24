# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1](https://github.com/myNameIsDu/aktiv/compare/@aktiv/cli@0.1.0...@aktiv/cli@0.1.1) (2022-07-24)


### Bug Fixes

* **cli:** set truly typescript file path for ForkTsCheckerWebpackPlugin ([e46f81b](https://github.com/myNameIsDu/aktiv/commit/e46f81b31e33631704c8496604cc45e4d3748d45))





# 0.1.0 (2022-07-23)


### Bug Fixes

* babel/transform-runtime 增加absoluteRuntime ([06fd3a1](https://github.com/myNameIsDu/aktiv/commit/06fd3a1e8ce7e9bcc063d9d73b1e33913301d200))
* **babel:** 修复babel相关 ([8db5a68](https://github.com/myNameIsDu/aktiv/commit/8db5a68c62970c754408aed4d6f779cfae4cca4c))
* cli 增加eslintignore 忽略template ([5e4e6d6](https://github.com/myNameIsDu/aktiv/commit/5e4e6d699adfbf1dcd9fee208aa4a53c60541365))
* **cli:** fix stylelint and prettier conflict ([950e99c](https://github.com/myNameIsDu/aktiv/commit/950e99c6ee436a9fe72cb9b3a542255ce2b10d28))
* **cli:** fix template project can't pass stylelint ([a7354f7](https://github.com/myNameIsDu/aktiv/commit/a7354f71bb376918afc49d61703a74f38ca3c7f7))
* **cli:** require(autoprefixer) => require(require.resolve(autoprefixer)) ([cdf2511](https://github.com/myNameIsDu/aktiv/commit/cdf2511d5119ecd1eecd4ed875e6b3e465f95ad7))
* **cli:** template add @types/react and @types/react-dom ([dbb0ca6](https://github.com/myNameIsDu/aktiv/commit/dbb0ca6aeb06f125aa1a3ef0cc8ae82b7a738899))
* **cli:** 修复ak-dev ts问题 ([99c843c](https://github.com/myNameIsDu/aktiv/commit/99c843c29e09fe7bb98b4c0b1ec21d1d8bf45af7))
* **cli:** 修复CopyPlugin to 为相对路径 ([4b37d09](https://github.com/myNameIsDu/aktiv/commit/4b37d09ab2faefd35a922222ecdb1411c9f0572d))
* **cli:** 修复createCaCert 使用readFileSync 传入编码格式 ([085ccab](https://github.com/myNameIsDu/aktiv/commit/085ccabb6e1d6705e1d8c89384a53ba24b6b4477))
* **cli:** 修复终止安装仍会输出正确的错误 ([ce8f650](https://github.com/myNameIsDu/aktiv/commit/ce8f650bae165d19bb307e5f53d36d91411df775))
* **cli:** 删除cli的change log 恢复版本号为0.0.0 lerna并没有发上去 ([096eaa0](https://github.com/myNameIsDu/aktiv/commit/096eaa06f6b80995765c21f53ba4e049b223a9cb))
* **cli:** 增加terser-webpack-plugin依赖 ([47bb375](https://github.com/myNameIsDu/aktiv/commit/47bb3756800d795bda685bb77cfa695a8004b5b3))
* config domain write list ([bb4be32](https://github.com/myNameIsDu/aktiv/commit/bb4be32763d90430e084cbcf777924fd75d8b2fe))
* fix lint ([dcc5e24](https://github.com/myNameIsDu/aktiv/commit/dcc5e24faf6e3127ef5725b4e6c0ed17919fc10e))
* fix port behind : ([b6e29fb](https://github.com/myNameIsDu/aktiv/commit/b6e29fb2842ddd6be74beff07fdd18b1b4a49216))
* reslove 增加默认指向当前node_modules,删除resloveloader默认指向当前node_modules ([8144528](https://github.com/myNameIsDu/aktiv/commit/814452812a2a7e703f4fd963193c81752328d934))
* template 增加依赖 ([cb9ce3c](https://github.com/myNameIsDu/aktiv/commit/cb9ce3c85cf878524be40bfec3ca79cf4d37f2f8))
* 修复dev sigs 类型问题 ([a34d39c](https://github.com/myNameIsDu/aktiv/commit/a34d39cc37da4b3e973b283f7abacb3cf03ad263))
* 修复lint ([fd8b8ff](https://github.com/myNameIsDu/aktiv/commit/fd8b8ff0f248a4cddbf5a81ecd39fa59be0beafe))
* 修复template注释 ([57c231f](https://github.com/myNameIsDu/aktiv/commit/57c231fa3b048ff5e3739d1aac5ebd0f4f703ae7))
* 修复错别字,变量名C:未浏览器 => 为浏览器,useEntry => useSentry ([1a82552](https://github.com/myNameIsDu/aktiv/commit/1a82552de209e76cef50508db465942934470b13))
* 修改所有throw error统一处理 ([c58b3a0](https://github.com/myNameIsDu/aktiv/commit/c58b3a0526d8f0747d91d0910b8a41c1a9222aa4))
* 修改注释: 删除注释，默认会提取 => Remove the comment as it is extracted by default ([fc65caf](https://github.com/myNameIsDu/aktiv/commit/fc65caf58c6653c38d2e61e17893b4576ac6acfa))
* 删除styleloaders快照,改为matchObject ([6b0c479](https://github.com/myNameIsDu/aktiv/commit/6b0c4794fb4e073e35dfe9cdd750cbf6ca1810a5))
* 增加less-loader less 依赖 ([d11af4b](https://github.com/myNameIsDu/aktiv/commit/d11af4b8a1603bfa69a313c5b61d2ac44e70f057))
* 增加版本号 跳过 launcher 1.1.0 cli 0.2.0 ([8aecf2b](https://github.com/myNameIsDu/aktiv/commit/8aecf2b934546505c9a07b727ae791f2083531ea))
* 忽略template 检查 ([36335f0](https://github.com/myNameIsDu/aktiv/commit/36335f0a4e006747689a32b9a18550d10de64f77))


### Features

* ak dev command add example ([11007c4](https://github.com/myNameIsDu/aktiv/commit/11007c4c21a126236be555e09c488f567e4b8788))
* ak init command 增加自动install + git init ([2dfbcb9](https://github.com/myNameIsDu/aktiv/commit/2dfbcb96c1bbc64d86d6b60c0088c7fc5f92c68a))
* cli 增加dev command ([9103758](https://github.com/myNameIsDu/aktiv/commit/9103758f0ca8f2428db24dc558cbe31b57b71ec6))
* **cli:** add ak template scripts ([2cc94bf](https://github.com/myNameIsDu/aktiv/commit/2cc94bf3aab868269c5165f25066e5f8bed21344))
* **cli:** add externalsType receive ([88bf89e](https://github.com/myNameIsDu/aktiv/commit/88bf89e222c3dc40d1872d006ab3e413bdf05f44))
* **cli:** add ReactRefreshPluginOptions receive ([6e49fb4](https://github.com/myNameIsDu/aktiv/commit/6e49fb435ec2a1432ed2b3225da6bcf0a5f057e2))
* **cli:** add smp to analyze ([0f63d9e](https://github.com/myNameIsDu/aktiv/commit/0f63d9e1af161f47d64640cff61bf4c4c388c781))
* **cli:** support https for devServer ([67f9a6f](https://github.com/myNameIsDu/aktiv/commit/67f9a6f991753d4e11fc3ebfdd91dbc3f109c9fa))
* **cli:** 升级babel,删除decorators plugin ([75f7a3c](https://github.com/myNameIsDu/aktiv/commit/75f7a3c621a556b6c289022c1fffb591f8cb3294))
* 修改performance 为pro是 warning ([58cd0f5](https://github.com/myNameIsDu/aktiv/commit/58cd0f508060eef3ffbfd592bd9d4a2ad3973ef4))
* 加入init ([087ac33](https://github.com/myNameIsDu/aktiv/commit/087ac33c92025141bdbbfd1b28e699a880a289ff))
* 增加cli ([b28632d](https://github.com/myNameIsDu/aktiv/commit/b28632de294d0bb6082ce2ebd873c750df350ed7))
* 抽离target,env,preset 全部由config导出,删除由env的判断,改为由preset判断 ([797d9f9](https://github.com/myNameIsDu/aktiv/commit/797d9f99286bed988347feaf5c95e99dbf596c91))
* 更改context 为workDir,修改所以loader为绝对路径 ([2327592](https://github.com/myNameIsDu/aktiv/commit/23275929031ddd110e0d4c5cf73669742ad7d413))


### Performance Improvements

* **cli:** perf spawn from pkg for across-spawn ([61ef907](https://github.com/myNameIsDu/aktiv/commit/61ef907cd2f3c7685251ce4b64b6d07b741e4886))
* code review request ([95f8d32](https://github.com/myNameIsDu/aktiv/commit/95f8d32d5f2533b12034117e316d8548e89008d3))
* perf cli openBrowser in wsl env with xdg-open ([0a35d40](https://github.com/myNameIsDu/aktiv/commit/0a35d400323b2c8231515ede4fcbecbfb78519b8))
* perf default cert domain list ([726efea](https://github.com/myNameIsDu/aktiv/commit/726efea284482cf253426caffd3cad49640880b6))





# 0.1.0 (2022-03-29)


### Bug Fixes

* 忽略template 检查 ([36335f0](https://github.com/myNameIsDu/aktiv/commit/36335f0a4e006747689a32b9a18550d10de64f77))
* 删除styleloaders快照,改为matchObject ([6b0c479](https://github.com/myNameIsDu/aktiv/commit/6b0c4794fb4e073e35dfe9cdd750cbf6ca1810a5))
* 修复错别字,变量名C:未浏览器 => 为浏览器,useEntry => useSentry ([1a82552](https://github.com/myNameIsDu/aktiv/commit/1a82552de209e76cef50508db465942934470b13))
* 修复dev sigs 类型问题 ([a34d39c](https://github.com/myNameIsDu/aktiv/commit/a34d39cc37da4b3e973b283f7abacb3cf03ad263))
* 修复lint ([fd8b8ff](https://github.com/myNameIsDu/aktiv/commit/fd8b8ff0f248a4cddbf5a81ecd39fa59be0beafe))
* 修复template注释 ([57c231f](https://github.com/myNameIsDu/aktiv/commit/57c231fa3b048ff5e3739d1aac5ebd0f4f703ae7))
* 修改所有throw error统一处理 ([c58b3a0](https://github.com/myNameIsDu/aktiv/commit/c58b3a0526d8f0747d91d0910b8a41c1a9222aa4))
* 修改注释: 删除注释，默认会提取 => Remove the comment as it is extracted by default ([fc65caf](https://github.com/myNameIsDu/aktiv/commit/fc65caf58c6653c38d2e61e17893b4576ac6acfa))
* 增加版本号 跳过 launcher 1.1.0 cli 0.2.0 ([8aecf2b](https://github.com/myNameIsDu/aktiv/commit/8aecf2b934546505c9a07b727ae791f2083531ea))
* 增加less-loader less 依赖 ([d11af4b](https://github.com/myNameIsDu/aktiv/commit/d11af4b8a1603bfa69a313c5b61d2ac44e70f057))
* babel/transform-runtime 增加absoluteRuntime ([06fd3a1](https://github.com/myNameIsDu/aktiv/commit/06fd3a1e8ce7e9bcc063d9d73b1e33913301d200))
* **babel:** 修复babel相关 ([8db5a68](https://github.com/myNameIsDu/aktiv/commit/8db5a68c62970c754408aed4d6f779cfae4cca4c))
* cli 增加eslintignore 忽略template ([5e4e6d6](https://github.com/myNameIsDu/aktiv/commit/5e4e6d699adfbf1dcd9fee208aa4a53c60541365))
* **cli:** 删除cli的change log 恢复版本号为0.0.0 lerna并没有发上去 ([096eaa0](https://github.com/myNameIsDu/aktiv/commit/096eaa06f6b80995765c21f53ba4e049b223a9cb))
* **cli:** 修复终止安装仍会输出正确的错误 ([ce8f650](https://github.com/myNameIsDu/aktiv/commit/ce8f650bae165d19bb307e5f53d36d91411df775))
* **cli:** 修复ak-dev ts问题 ([99c843c](https://github.com/myNameIsDu/aktiv/commit/99c843c29e09fe7bb98b4c0b1ec21d1d8bf45af7))
* **cli:** 修复CopyPlugin to 为相对路径 ([4b37d09](https://github.com/myNameIsDu/aktiv/commit/4b37d09ab2faefd35a922222ecdb1411c9f0572d))
* **cli:** 修复createCaCert 使用readFileSync 传入编码格式 ([085ccab](https://github.com/myNameIsDu/aktiv/commit/085ccabb6e1d6705e1d8c89384a53ba24b6b4477))
* **cli:** 增加terser-webpack-plugin依赖 ([47bb375](https://github.com/myNameIsDu/aktiv/commit/47bb3756800d795bda685bb77cfa695a8004b5b3))
* **cli:** fix stylelint and prettier conflict ([950e99c](https://github.com/myNameIsDu/aktiv/commit/950e99c6ee436a9fe72cb9b3a542255ce2b10d28))
* **cli:** require(autoprefixer) => require(require.resolve(autoprefixer)) ([cdf2511](https://github.com/myNameIsDu/aktiv/commit/cdf2511d5119ecd1eecd4ed875e6b3e465f95ad7))
* config domain write list ([bb4be32](https://github.com/myNameIsDu/aktiv/commit/bb4be32763d90430e084cbcf777924fd75d8b2fe))
* fix lint ([dcc5e24](https://github.com/myNameIsDu/aktiv/commit/dcc5e24faf6e3127ef5725b4e6c0ed17919fc10e))
* fix port behind : ([b6e29fb](https://github.com/myNameIsDu/aktiv/commit/b6e29fb2842ddd6be74beff07fdd18b1b4a49216))
* reslove 增加默认指向当前node_modules,删除resloveloader默认指向当前node_modules ([8144528](https://github.com/myNameIsDu/aktiv/commit/814452812a2a7e703f4fd963193c81752328d934))
* template 增加依赖 ([cb9ce3c](https://github.com/myNameIsDu/aktiv/commit/cb9ce3c85cf878524be40bfec3ca79cf4d37f2f8))


### Features

* 抽离target,env,preset 全部由config导出,删除由env的判断,改为由preset判断 ([797d9f9](https://github.com/myNameIsDu/aktiv/commit/797d9f99286bed988347feaf5c95e99dbf596c91))
* 更改context 为workDir,修改所以loader为绝对路径 ([2327592](https://github.com/myNameIsDu/aktiv/commit/23275929031ddd110e0d4c5cf73669742ad7d413))
* 加入init ([087ac33](https://github.com/myNameIsDu/aktiv/commit/087ac33c92025141bdbbfd1b28e699a880a289ff))
* 修改performance 为pro是 warning ([58cd0f5](https://github.com/myNameIsDu/aktiv/commit/58cd0f508060eef3ffbfd592bd9d4a2ad3973ef4))
* 增加cli ([b28632d](https://github.com/myNameIsDu/aktiv/commit/b28632de294d0bb6082ce2ebd873c750df350ed7))
* ak dev command add example ([11007c4](https://github.com/myNameIsDu/aktiv/commit/11007c4c21a126236be555e09c488f567e4b8788))
* ak init command 增加自动install + git init ([2dfbcb9](https://github.com/myNameIsDu/aktiv/commit/2dfbcb96c1bbc64d86d6b60c0088c7fc5f92c68a))
* cli 增加dev command ([9103758](https://github.com/myNameIsDu/aktiv/commit/9103758f0ca8f2428db24dc558cbe31b57b71ec6))
* **cli:** 升级babel,删除decorators plugin ([75f7a3c](https://github.com/myNameIsDu/aktiv/commit/75f7a3c621a556b6c289022c1fffb591f8cb3294))
* **cli:** add ak template scripts ([2cc94bf](https://github.com/myNameIsDu/aktiv/commit/2cc94bf3aab868269c5165f25066e5f8bed21344))
* **cli:** add externalsType receive ([88bf89e](https://github.com/myNameIsDu/aktiv/commit/88bf89e222c3dc40d1872d006ab3e413bdf05f44))
* **cli:** add ReactRefreshPluginOptions receive ([6e49fb4](https://github.com/myNameIsDu/aktiv/commit/6e49fb435ec2a1432ed2b3225da6bcf0a5f057e2))
* **cli:** support https for devServer ([67f9a6f](https://github.com/myNameIsDu/aktiv/commit/67f9a6f991753d4e11fc3ebfdd91dbc3f109c9fa))


### Performance Improvements

* code review request ([95f8d32](https://github.com/myNameIsDu/aktiv/commit/95f8d32d5f2533b12034117e316d8548e89008d3))
* perf cli openBrowser in wsl env with xdg-open ([0a35d40](https://github.com/myNameIsDu/aktiv/commit/0a35d400323b2c8231515ede4fcbecbfb78519b8))
* perf default cert domain list ([726efea](https://github.com/myNameIsDu/aktiv/commit/726efea284482cf253426caffd3cad49640880b6))
