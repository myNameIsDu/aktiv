# Launcher &middot; ![NPM](https://img.shields.io/npm/l/@aktiv/launcher) [![Build Status](https://www.travis-ci.com/myNameIsDu/aktiv.svg?branch=master)](https://www.travis-ci.com/myNameIsDu/aktiv) [![codecov](https://codecov.io/gh/myNameIsDu/aktiv/branch/master/graph/badge.svg?token=B1XL6LCY9T)](https://codecov.io/gh/myNameIsDu/aktiv)
一个轻量级的，配置化的启动器

## Install

```bash
npm install @aktiv/launcher
```
## Introduction

在此之前，你的react项目可能需要安装 `react-router` `react-router-dom` `redux` `react-redux` `redux-thunk`...，现在，这些都不需要了，你只需要Launcher, 它内置了这些东西，并提供了一套简单的可配置化的开发方案, [查看内置库的版本](#内置库)

此外，它还提供了一套插件化的流程，使应用的变得更加可复用，可拓展

## Get Started
```javascript
import Launcher from '@aktiv/launcher';

const Home = () => {
    return <div>home</div>;
};
const About = () => {
    return <div>home</div>;
};

const RouterConfig = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/about',
        component: About,
    },
];

const app = new Launcher({
    routes: RouterConfig,
});

app.start();
```
它仅有一个必传的参数，就是你的router配置

整体而言，参数分为两类：[router](#router) 和 [store](#store)

```typescript
interface ConstructorOptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
    reducerConfig?: ReducerConfig;
    reducers?: ReducersMapObject;
    immerEnableES5?: boolean;
    routerBasePath?: string;
    rootNode?: string;
    reduxMiddleware?: Middleware[];
}
```

## rootNode
ReactDOM.render 挂载的节点

## router

### hash

默认为browserRouter, 通过hash参数开启hashRouter

### routerBasePath
公有的路由前缀，详情查看react-router:
https://github.com/ReactTraining/react-router/blob/dev/docs/advanced-guides/migrating-5-to-6.md#move-basename-from-router-to-routes
### routes

静态路由配置

```typescript
interface RouteItemBase {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
}
export interface RouteItem extends RouteItemBase {
    redirect?: string;
    component?: ComponentType | (() => DynamicImportType);
    // plugin route options
    [x: string]: unknown;
}
```
在react-router的基础上我们扩展了 lazy、title和redirect选项

#### lazy

开启懒加载模式

#### title
在加载到当前路由时，launcher会自动帮你赋值 `document.title`

### redirect

由于react-router v6 不再支持 redirect 组件，所以这里我们内置了redirect功能, 分为三种情况:

```typescript
interface RouteItemBase {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
}

export interface RedirectRouteItem extends RouteItemBase {
    redirect: string;
}

export interface NormalRouteItem extends RouteItemBase {
    component: ComponentType | (() => DynamicImportType);
}

export interface ParentRedirectRoteItem extends RouteItemBase {
    redirect: string;
    component: ComponentType | (() => DynamicImportType);
}
````
需要注意的是，如果你的项目传入了,routerBasePath，正常情况下当你使用redirect，并传入绝对路径时应该加上前缀名，但是在这里我们已经帮您内置了，所以你可以忽略它


## store
store的配置可能稍显复杂，首先这是我们的scr目录
```
actions
    |-list
    |-index.js
index.tsx
```

actions/list

```typescript
import { createActions } from '@aktiv/launcher';
const state = {  // state的默认值
    a:"1" 
} 
const config  = {
    editorA:{
        key:'a',  // 发起dispatch的时候修改的对象state key
        payload:(data) => data
    }
}
export { 
    state,
    config,
    actions: createActions(config)
}
```

actions/index
```typescript
import list from './list'
export { list }
```

index.tsx
```typescript
import Launcher from '@aktiv/launcher';
import reducerConfig from './actions'

const app = new Launcher({
    routes: RouterConfig,
    reducerConfig
});

app.start();
```
这样的配置会产生如下的state
```
{
    list: {
        a: "1"
    }
}
```

使用dispatch:

```typescript
import { actions as listActions } from './actions/list'

listActions.editorA('hello')

```
此时的state为

```
{
    list: {
        a: "hello"
    }
}
```

当然你也可以在payload里边做一些其它事情，比如发起请求

```typescript
import { createActions } from '../src';
const state = {  // state的默认值
    a:"1" 
} 
const config  = {
    editorA:{
        key:'a',  // 发起dispatch的时候修改的对象state key

        payload:(data) => {
            return api(data)
        }

    }
}
export { 
    state,
    config,
    actions: createActions(config)
}
```
此时调用dispatch你的state如下：

```typescript
{
    list: {
        a: "apiResponse"
    }
}
```
默认情况下，payload的返回值只会替换对应的state key，当然你也可以自定义处理

```typescript
import { createActions } from '../src';
const state = {  // state的默认值
    a:"1" 
} 
const config  = {
    editorA:{
        key:'a',  // 发起dispatch的时候修改的对象state key

        payload:(data) => {
            return api(data)
        },
        // 自定义处理state只需要加上handle， 它接收当前的state 和你的payload
        handle:(state, payload) => {
            // 例如根据api的返回，改变state.a
            if(payload.data === true) {
                // 当然，你也可以改变 state.b  state.c 或者其它你想处理的state
                state.a="hello"
            } else {
                state.a='hi'
            }
        }
    }
}
export { 
    state,
    config,
    actions: createActions(config)
}
```
需要注意的是，我们内置了immer，并使用produce包裹了handle，所以你只需要对state直接赋值可以，并且不需要返回，由于state这时为immer的draft，所以如果你想debug，需要使用immer的功能，例如：

```typescript
import { current } from '@aktiv/launcher';
// 我们提供了内置库的所有导出，你只需从launcher导出即可

const config  = {
    editorA:{
        key:'a',  // 发起dispatch的时候修改的对象state key

        payload:(data) => {
            return api(data)
        },
        // 自定义处理state只需要加上handle， 它接收当前的state 和你的payload
        handle:(state, payload) => {
            // debug state
            console.log(current(state))
            // 例如根据api的返回，改变state
            if(payload.data === true) {
                // 当然，你也可以改变 state.b  state.c 或者其它你想处理的state
                state.a="hello"
            } else {
                state.a='hi'
            }
        }
    }
}

```
详细使用可以查看immer官方文档：https://immerjs.github.io/immer/current

好了，这就是store的大致用法，除此之外，还有一些参数：immerEnableES5、reducers, reduxMiddleware

reduxMiddleware: 扩展的redux 中间件数组

immerEnableES5： 开启immer兼容es5，详情可查看immer官方文档:https://immerjs.github.io/immer/installation

reducers: 自定义的reducers，需要注意的是，这里你要像正常情况下一样使用不可变数据的写法，并返回它，因为这里并没有使用immer对其处理

## plugin

plugin功能是launcher的最强大的功能，它基于router开发，一个plugin看起来是这样的

```typescript
export interface Plugin {
    name: string;
    outer?: PluginOuterRenderType;
    inner?: PluginInnerRenderType;
    reducerConfig?: ReducerConfigItem;
}
```

最简单的场景是登陆接口请求成功之后，你才想展示你的应用, 并且把用户信息传递下去

```jsx
import React, { useEffect, useState } from 'react';
import Launcher from '@aktiv/launcher';
const LoginProviderContext = React.createContext(null);

const LoginProvider = ({ children }) => {
    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        loginApi()
            .then(res => {
                setLogin(true);
                setUserInfo(res.data);
            })
            .catch(error => {
                redirect('/login');
            });
    }, []);

    return isLogin ? (
        <LoginProviderContext.Provider value={userInfo}>{children}</LoginProviderContext.Provider>
    ) : null;
};

const loginPlugin = {
    name: 'login',
    // 第一个参数为内层的组件，第二个参数为 use 时传入的参数
    outer: (children, opt) => {
        <LoginProvider opt={opt}>{children}</LoginProvider>;
    },
};
const app = new Launcher({...});
// 通过第二个参数给插件传参
app.use(loginPlugin, opt)
app.start()
```
当然你可以拥有多个插件，只需注意插件的调用层级，在后边调用的会包裹在外层

### outer

outer的例子如上所示，这里要说明的是outer是包裹在router外层的，所以你可以理解为全局唯一的

### inner

inner常用的例子是对每个路由进行控制，因为它是包裹在每个route外层的，例如需要对每个路由进行鉴权

```tsx
import React, { useEffect, useState, useContext } from 'react';
import Launcher, { useLocation } from '@aktiv/launcher';

const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
    const [ authData, setAuthData ] = useState()
    useEffect(()=>{
        authApi()
            .then(res => {
                setAuthData(res.data)
            })
    },[])
    return authData ? (
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    ) : null;
}

const AuthRouteComponent = ({ children, route }) => {
    const { hasAuth } = route
    const { pathname } = useLocation()
    const authInfo = useContext(AuthContext)

    if(hasAuth && !authInfo.has(pathname)){
        return '没有权限'
    }
    return children
}

const plugin = {
    name:'auth',
    outer:(children, opt) => {
        return <AuthProvider opt={opt}>{children}</AuthProvider>
    },
    inner:(children, route, opt) => {
        return <AuthRouteComponent route={route} opt={opt}>{children}</AuthRouteComponent>
    }
}

const Home = () => <div>home</div>
const About = () => <div>about</div>

const app = new Launcher({
    routes:[
        {
            path:'/',
            component:Home
        },
        {
            path:'/about',
            component:Home,
            // /about需要鉴权
            hasAuth:true
        }
    ]
})
app.use(plugin, opt)
```
### reducerConfig
每个插件也具有参与store的能力
```typescript
const authReducerConfig = {
    state:{
        a:1
    },
    config:{
        editorA:{
            key:'a',
            payload: data => data
        }
    }
}
const plugin = {
    name:"auth",
    inner:...,
    out:....,
    reducerConfig: authReducerConfig
}
app.use(plugin)
```
state如下
```
{
    auth:{
        a:1
    }
}
```

## hooks
内置了一些便捷的hooks
### useRouter

```typescript
type UseRouterReturns = {
    redirect(path: string, state?: UseRouterState): void;
    replace(path: string, state?: UseRouterState): void;
};
```

redirect 仅在navigate包了一层
```typescript
navigate(resultPath, {
    state,
});
```
replace 同样如此
```typescript
navigate(resultPath, {
    replace: true,
    state,
});
```

此外，它们会当你传入绝对路径时，拼接你的 routerBasePath，但是由此带来的影响是，你传入的path只能为一个string

### useQuery

获取当前路由的query参数

example
current location: /home?a=123
```javascript
const query = useQuery()
// query: { a:123 }
```

## 内置库
```
    "history": "^5.0.0",
    "immer": "^9.0.5",
    "react-hot-loader": "^4.13.0",
    "react-loadable": "^5.5.0",
    "react-redux": "^7.2.4",
    "react-router": "^6.0.0-beta.0",
    "react-router-dom": "^6.0.0-beta.0",
    "redux": "^4.1.0",
    "redux-thunk": "^2.3.0"，
```
此外内部实现了一个基于 redux-promise 改造而来的 处理promise的 redux 中间件