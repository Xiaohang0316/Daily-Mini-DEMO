# Angular SSR 应用场景与局限

## 应用场景
<!-- 项目很在乎在搜索引擎的排名，可以考虑使用SSR，因为SSR最大的优势在于SEO与首屏加载速度快，当企业更在乎在搜索引擎的排名，使得用户尽可能看到与多访问自身网站时，可以考虑使用SSR；根绝业务需求来决定首屏加载速度的重要程度。 -->

内容丰富，复杂交互的动态网页，对首屏加载有要求的项目，对 seo 有要求的项目（因为服务端第一次渲染的时候，已经把关键字和标题渲染到响应的 html 中了，爬虫能够抓取到此静态内容，因此更利于 seo）。此方式一些适合的项目：活动模板，新闻通知类，博客系统，混合开发等等。
## 创建一个 Angular SSR 项目
```ssh
1. 创建 Angular Cli Demo 
    ng new my-ssr-app
2. 添加 Angular SSR  插件 
    ng add @nguniversal/express-engine
    此时 在应用根目录下，您会看到一个server.ts文件，这是Express服务器的入口文件。您可以在这个文件中配置服务器行为，例如路由和中间件
3. 启动项目 
    npm run build:ssr
    npm run serve:ssr
一个简单的 Angular SSR 项目创建完成
```

## SSR的优势：

### 有利于SEO:
不同爬虫工作原理类似，只会爬取源码，不会执行网站的任何脚本（Google除外，据说Googlebot可以运行javaScript）。使用了React或者其它MVVM框架之后，页面大多数DOM元素都是在客户端根据js动态生成，可供爬虫抓取分析的内容大大减少。另外，浏览器爬虫不会等待我们的数据完成之后再去抓取我们的页面数据。服务端渲染返回给客户端的是已经获取了异步数据并执行JavaScript脚本的最终HTML，网络爬中就可以抓取到完整页面的信息。
* 相同的一项目，对比 CSR 和 SSR  的爬虫
  
  



### 有利于首屏渲染
首屏的渲染是node发送过来的html字符串，并不依赖于js文件了，这就会使用户更快的看到页面的内容。尤其是针对大型单页应用，打包后文件体积比较大，普通客户端渲染加载所有所需文件时间较长，首页就会有一个很长的白屏等待时间。

#### 如何验证 SSR 会改善渲染慢的问题
1. 创建一个 30W条的数据然后用 SSR 和 CSR 分别渲染对比两个渲染时间,
   ```js
    // 创建 30W 条数据并渲染到  HTML
    list: number[] = Array.from({ length: 800000 }, (_, i) => i);
   ```
   ```html
    <div class="list">
        <div *ngFor="let item of list"> 
            <span class="item1">{{item}}</span>
            <span class="item2">{{++item}}</span>
            <span class="item3">{{--item}}</span>
            <span class="item4">{{item + item}}</span>
            <span class="item5">{{item * item}}</span>
        </div>
    </div>
    ```

    ![CSR](./image.png)

    ![SSR](./img/SSR.png)





## 局限
### 服务端压力较大
本来是通过客户端完成渲染，现在统一到服务端node服务去做。尤其是高并发访问的情况，会大量占用服务端CPU资源；


### 开发条件受限
在服务端渲染中，只会执行 ngOnInit 、 ngOnDestroy、 ngAfterViewInit、 ngAfterContentInit 等生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制；


### 学习成本相对较高
除了对webpack、Angular要熟悉，还需要掌握node、Koa2、Java等相关技术。相对于客户端渲染，项目构建、部署过程更加复杂。

<!-- 

https://juejin.cn/post/6850418118515392520
https://tangjie-93.github.io/blog/articles/vue/25%E3%80%81ssr%E7%9A%84%E7%90%86%E8%A7%A3%E5%92%8C%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF.html
https://blog.csdn.net/muguli2008/article/details/117431539
https://www.rtcdeveloper.cn/cn/community/blog/26015
https://cn.vuejs.org/guide/scaling-up/ssr.html
https://medium.com/dean-lin/ssr-csr%E5%90%8D%E8%A9%9E%E7%90%86%E8%A7%A3-%E6%87%89%E7%94%A8%E5%A0%B4%E6%99%AF-119ca6f5ecc
https://developer.aliyun.com/ask/379734
https://open.alipay.com/portal/forum/post/138001051
https://blog.csdn.net/sinat_40572875/article/details/127782583

 -->
