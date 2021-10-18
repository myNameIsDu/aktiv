import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Aktiv',
  favicon: 'https://scholarself.oss-cn-beijing.aliyuncs.com/daily/aktiv.png',
  logo: 'https://scholarself.oss-cn-beijing.aliyuncs.com/daily/aktiv.png',
  outputPath: 'docs-dist',
  mode: 'site',
  publicPath: './',
  resolve: {
    // 代码块弱校验
    passivePreview: true,
  },
  // more config: https://d.umijs.org/config
  // 单语言配置方式如下
  // navs: [
  //   null, // null 值代表保留约定式生成的导航，只做增量配置
  // ],
});
