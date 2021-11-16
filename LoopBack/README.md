#### 0.What is LoopBack？

LoopBack 是一个高度可扩展的、基于 Express 的开源 Node.js 和 TypeScript 框架。它能够快速创建由后端系统（如数据库和 SOAP 或 REST 服务）组成的 API 和微服务。

下图展示了 LoopBack 如何充当传入请求和传出集成之间的组合桥梁。它还显示了对 LoopBack 提供的各种功能感兴趣的不同角色。

<img src='./LoopBack.png'>



#### 1.LoopBack3 -> LoopBack4 mount 

```
//loopBack4 目录结构
├── public
│   └── index.html
├── src
│   ├── models
│   ├── repositories
│   ├── controllers
│   ├── datasources
│   ├── application.ts
│   ├── index.ts
│   ├── migrate.ts
│   ├── openapi-spec.ts
│   ├── sequence.ts
│   └── __tests__
└── tsconfig.json
```

`application.ts`是LoopBack4的挂载文件。

升级LoopBack4只需要把LoopBack3的server文件挂载在`application.ts`中的`bootOptions`下面就可

（来自官方的🌰）

```js
this.bootOptions = {
  lb3app: {
    // server file is found under this path
    path: '../coffee-shop/server/server',
  },
};

```

调用LoopBack封装的方法

1.引入打包之后的文件

``` js
const LoopBack = require('../../server/application.js').LoopBack
const = new LoopBack()
//获取里面封装的方法
//lb3App  是在application.ts--》this.bootOptions 下挂在的一个server
let getUser = app.get('lb3App.getUser')
```

2.直接引入服务文件

```js
const app = require（'../coffee-shop/server/server'）
app.model.User.getUser()
```

#### 2.LoopBack Date

LoopBack2 前端传Date为时间戳的时候LoopBack会自动把时间戳转化为Date类型的存储到数据库

升级到LoopBack4之后突然发现后台报错` XXX-date invalid`

issuse（ https://github.com/loopbackio/loopback-next/discussions/7906I#discussioncomment-1481012）

根据此issuse的提示，前端数据发送到后端在node层拿到所有的数据并对Date做转换进行一个改变，例如写一个公共的方法，并在有用到的时间的地方进行调用

``` js
dateFormat(date) {
    if ( date &&  !_.toString(date).includes('-')) {
        date = new Date(_.toNumber(date));
    }
    return date
}

//通过这个方法可以拿到当前数据表的json定义对其循环查找type等于Date的数据拿到key并修改其数据类型
app.models[model].modelBuilder.definitions[model].properties
```

#### 3.引用路径问题

在node的路径引用中要使用__dirname,否则会出现找不到路径问题

`__dirname` 是一个环境变量，它告诉您包含当前正在执行的文件的目录的绝对路径。

```js
const path = require('path');
const dirPath = path.join(__dirname, '/pictures');
```

#### 4.TS环境变量参数

详细可见 tsc CLI     (https://www.typescriptlang.org/docs/handbook/compiler-options.html )

```
lb-tsc -p tsconfig.json --target es2017 --outDir dist

-p         给出其配置文件的路径，或带有“tsconfig.json”的文件夹。
--clean     删除所有项目的输出
--target   为发出的 JavaScript 设置 JavaScript 语言版本并包含兼容的库声明
--outDir   为所有发出的文件指定一个输出文件夹。
```





