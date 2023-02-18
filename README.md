# VUE后台应用框架

VUE应用框架是一个后台前端解决方案，它基于 vue 和 element-ui实现。它使用了最新的前端技术栈，内置了动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。



## 教程

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)。



### 安装项目

```bash
# 克隆项目
git clone xxx

# 进入项目目录
cd vue-admin

# 安装依赖
npm install


# 创建配置文件 .env.development.local  文件内容如下：
```python
NODE_ENV=development

# 模式
VUE_APP_MODE=dev
# 接口地址
VUE_APP_API_BASE_URL=http://xxx
# 文件服务地址
VUE_APP_ASSETS_BASE_URL=http://xxx
```

# 本地开发 启动项目
npm run serve
```

### 目录结构

```text
application-template
├── mock                       # 项目mock 模拟数据
├── public                     # 静态资源
│   └── app_config.js          # 应用配置（编译部署后可通过这个文件覆盖应用配置）
│   ├── icons                  # 项目用到的阿里 icons
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── assets                 # 资源
│   │   ├── scss               # 样式
│   │   ├── images             # 图片
│   ├── config                 # 应用配置
│   ├── components             # 组件
│   ├── directive              # 指令
│   ├── filters                # 过滤器
│   ├── language               # 国际化 language
│   ├── layouts                # 布局
│   ├── plugins                # 插件
│   ├── router                 # 路由
│   ├── store                  # store管理
│   ├── service                # 所有请求
│   ├── utils                  # 公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 路由权限
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```



### 项目配置

配置放在 `@/config/index` 里面，可以通过 `环境变量` 和 `window.APP_CONFIG` 合并修改。

```js
const CONFIG = {
  // 应用框架标题
  TITLE: '乡产投盟',
  // 请求接口 base url（建议这里写 undefined 通过环境变量或者APP_CONFIG合并）
  API_BASE_URL: undefined,
  // 资源路径（建议这里写 undefined 通过环境变量或者APP_CONFIG合并）
  ASSETS_BASE_URL: undefined,
  // RSA公钥
  RSA_PUBLIC_KEY: 'PUBLIC_KEY',
  // 是否 debug 模式
  DEBUG: process.env.NODE_ENV !== 'production',
  // 阿里图标链接
  ALI_ICON_URL: `${process.env.BASE_URL}icon/iconfont.css`,
  // 主题颜色
  THEME_COLORS: ['#00BA75', '#00ab55', '#7635dc', '#1ccaff', '#fda92d', '#ff3030'],
}
```

**环境变量**

环境变量参考 vue-cil 的官方文档：[https://cli.vuejs.org/zh/guide/mode-and-env.html](https://cli.vuejs.org/zh/guide/mode-and-env.html)

```text
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

一个环境文件只包含环境变量的“键=值”对：

```text
FOO=bar
VUE_APP_NOT_SECRET_CODE=some_value
```

请注意，只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到*客户端侧*的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

以 `VUE_APP_` 开头的变量同时会覆盖 `@/config/index` 里面的配置。

**APP_CONFIG**

项目已经暴露 `public/app_config.js` 配置文件，打包编译后产出 `dist/app_config.js` 文件。编辑此文件的也可以修改项目配置。实现打包部署后也支持修改配置产出不同环境的部署包。



### 服务层

服务层负责处理发起的请求, 并返回对服务端的响应。程序自动加载 `@/service/modules` 下所有的模块。



#### 创建服务

我们来创建一个简单的用户服务模块。

创建 `@/service/modules/user.js` 文件：

```js
import request from '@/utils/request'

// 登录
export const login = async (data, config) => {
  return request.post('/login', data, config)
}

// 注销
export const logout = async (params, config) => {
  return request.delete('/logout', config)
}

export default { login, logout }
```



#### 如何使用

js 引入模块使用：

```js
import service from '@/service'

// 登录
service.user.login()
// 注销
service.user.logout()
```

在 vue 单文件里使用：

```vue
<script>
export default {
  created () {
    // 请求登录服务
    this.$service.user.login()
  }
}
</script>
```



#### request

`@/utils/request` 是一个 [axios](https://axios-http.com/) 的实例，通过拦截器实现了统一抛出错误格式，自动弹出错误信息，FormData传参，注入token等一系列请求工作流

```js
import request from '@/utils/request'

request.post('/backstage/admin/login', {
  account: '账号'，
  password: '密码'
})
```



**忽略错误提示**

因为全局写了自动弹出错误信息，如果这个 api 不需要弹出错误信息的话，可以使用 `errorMessage` 配置

```js
request.post('/api', data, {
  errorMessage: false
})
```

或者自定义弹出错误信息：

```js
request.post('/api', data, {
  errorMessage: '请求错误！'
})
```



**上传文件**

上传文件通过 `formData` 配置可以把 data 数据转换为 FormData 数据

```js
request.post('/document/upload', { file }, {
  formData: true
})
```



### 路由



#### 模式

修改 `@/router/index.js` 文件

```js
const router = new VueRouter({
  mode: 'hash' // 指定使用 hash 模式
})
```

- `hash`
- `history`，需要服务器配置，[文档地址](https://router.vuejs.org/zh/guide/essentials/history-mode.html#后端配置例子)



#### 文件系统路由

应用会自动读取此`@/pages ` 目录中的所有 `.vue`  文件并自动为您创建路由器配置。

假设目录结构如下：

```text
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```

会生成以下路由：

```js
routes: [
  {
    path: '/index',
    component: 'pages/index.vue'
  },
  {
    name: 'user-index',
    path: '/user/index',
    component: 'pages/user/index.vue'
  },
  {
    name: 'user-one',
    path: '/user/one',
    component: 'pages/user/one.vue'
  },
  {
    path: '/',
    component: '/index'
  },
  {
    path: '/user',
    redirect: '/user/index'
  }
]
```

> 如果自动生成的路由满足不了需求，可以修改 `@/router/index.js` 自己写路由
>
> 视图文件建议放在 `@/views` 文件夹下。

**使用布局**

指定布局目录中定义的布局。

```js
export default {
  layout: 'default'
}
```

**设置Head**

为当前页面设置特定 标签。

```js
export default {
  head() {
    return {
      title: "页面标题"
    }
  }
}
```



#### 布局模板

页面整体布局是一个产品最外层的框架结构，往往会包含导航、侧边栏、面包屑以及内容等。想要了解一个后台项目，先要了解它的基础布局。

当您想要更改应用的外观和感觉时，布局非常有用。无论您是要包含侧边栏还是要为移动设备和桌面设备提供不同的布局。如果没有指定布局的话，默认使用`@/layouts/default.vue` 布局。它将用于所有未指定布局的页面。

你可以自定义布局一个新的新的布局，确保`<router-view>` 在创建布局时添加 组件以实际包含页面组件。

```vue
<template>
  <router-view />
</template>
```

您可以在此处添加更多组件，例如导航、页眉、页脚等。

```vue
<template>
  <div>
    <TheHeader />
    <router-view />
    <TheFooter />
  </div>
</template>
```

> 如果是自定义视图路由模板功能将失效







#### 权限控制

通过 `@/permission.js` 配置。获取当前用户的信息去比对路由表，通过 `router.beforeEach` 前置守卫拦截校验。校验规则参考：[async-validator](https://github.com/yiminghe/async-validator)。

```js
export default [
  // 全部页面都需要登录
  { path: '/', auth: true }

  // 后申明规则会覆盖前规则（下面例子是，全部页面都要登录，但是/test除外）
  // { path: '/', auth: true }
  // { path: '/test', auth: false }

  // 支持校验，auto 规则是 async-validator 对用户信息对象校验的规则（下面例子是必须要登录且用户id必须是1, 2, 3其中之一）
  // { path: '/test', auth: { userId: { type: 'enum', enmu: [1, 2, 3] } } }

]

```
