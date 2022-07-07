#### 什么是前端路由？
路由的概念来源于服务端，在服务端中路由描述的是 URL 与处理函数之间的映射关系。

在 Web 前端单页应用 SPA(Single Page Application)中，路由描述的是 URL 与 UI 之间的映射关系，这种映射是单向的，即 URL 变化引起 UI 更新（无需刷新页面）。

####  如何实现前端路由？
要实现前端路由，需要解决两个核心问题：

1. 如何改变 URL 却不引起页面刷新？
2. 如何检测 URL 变化了？

下面分别使用 hash 和 history 两种实现方式回答上面的两个核心问题。

###### **hash 实现**
1. hash 是 URL 中 hash (`#`) 及后面的那部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 部分不会引起页面刷新
2. 通过 [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 事件监听 URL 的变化，改变 URL 的方式只有这几种：通过浏览器前进后退改变 URL、通过`<a>`标签改变 URL、通过`window.location`改变URL，这几种情况改变 URL 都会触发 hashchange 事件

###### **history 实现**
1. history 提供了 pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新
2. history 提供类似 hashchange 事件的 [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) 事件，但 popstate 事件有些不同：通过浏览器前进后退改变 URL 时会触发 popstate 事件，通过`pushState/replaceState`或`<a>`标签改变 URL 不会触发 popstate 事件。好在我们可以拦截 `pushState/replaceState`的调用和`<a>`标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。

#### 原生路由实现
###### *** hash***

``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Native Router Hash</title>
</head>

<body>
  <ul>
    <!-- 定义路由 -->
    <li><a href="#/home">home</a></li>
    <li><a href="#/about">about</a></li>

    <!-- 渲染路由对应的 UI -->
    <div id="routeView"></div>
  </ul>
</body>

<script>
  // 页面加载完不会触发 hashchange，这里主动触发一次 hashchange 事件
  window.addEventListener('DOMContentLoaded', onLoad)
  // 监听路由变化
  window.addEventListener('hashchange', onHashChange)

  // 路由视图
  var routerView = null

  function onLoad() {
    routerView = document.querySelector('#routeView')
    onHashChange()
  }

  // 路由变化时，根据路由渲染对应 UI
  function onHashChange() {
    console.log(window.location)
    switch (location.hash) {
      case '#/home':
        routerView.innerHTML = 'Home'
        return
      case '#/about':
        routerView.innerHTML = 'About'
        return
      default:
        return
    }
  }
</script>

</html>
```



###### *** history***
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Native Router History</title>
</head>

<body>
    <ul>
        <li><a href='/home'>home</a></li>
        <li><a href='/about' class='GGHHJJ'>about</a></li>

        <div id="routeView"></div>
    </ul>
</body>


<script>
    // 页面加载完不会触发 hashchange，这里主动触发一次 hashchange 事件
    window.addEventListener('DOMContentLoaded', onLoad)
    // 监听路由变化
    window.addEventListener('popstate', onPopState)

    // 路由视图
    var routerView = null

    function onLoad() {
        routerView = document.querySelector('#routeView')
        onPopState()

        // 拦截 <a> 标签点击事件默认行为， 点击时使用 pushState 修改 URL并更新手动更新 UI，从而实现点击链接更新 URL 和 UI 的效果。
        var linkList = document.querySelectorAll('a[href]')
        linkList.forEach(el => el.addEventListener('click', function (e) {
            e.preventDefault()
            history.pushState(null, '', el.getAttribute('href'))
            onPopState()
        }))
    }

    // 路由变化时，根据路由渲染对应 UI
    function onPopState() {
        switch (location.pathname) {
            case '/home':
                routerView.innerHTML = 'Home'
                return
            case '/about':
                routerView.innerHTML = 'About'
                return
            default:
                return
        }
    }
</script>

</html>
```

#### ui-router

ui-router 为我们封装了一个独立的路由模块 ui-router ,它是一种靠状态 state 来驱动视图.



index.html，ui-sref表示指令链接到一个特定的状态，一般情况下为替换视图，替换视图的部分为使用`<div ui-view/>`所标记的区域。可以简单的理解为`<div ui-view/>` 起到的其实是一个占位符的作用。

``` html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta charset="utf-8" name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta http-equiv="X0-UA-Compatible" content="ie=edge">
    <title>Ui-router</title>
    <style>

    </style>
</head>

<body data-ng-app="myApp">
    <div>
        <!--ui-sref跳转-->
        <span style="width:100px" ui-sref=".Page1"><a href="">Page-1</a></span>
        <span style="width:100px" ui-sref=".Page2"><a href="">Page-2</a></span>
        <span style="width:100px" ui-sref=".Page3"><a href="">Page-3</a></span>
    </div>
    <div>
        <!--PageTap嵌套的视图html展示的地方-->
        <div ui-view="" />
    </div>
    <script src="https://cdn.bootcdn.net/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/angular-ui-router/1.0.30/angular-ui-router.js"></script>
    <script src="App.js"></script>
</body>
<html>
```



在构造angular对象的时候，我们引入了 'ui.router' 模块，在angular对象的配制方法中，我们通过 ui-router提供的$stateProvider对象的 state方法去配置路由对象，name对应ui-sref中配置的值，使用template去替换<div ui-view/>。

```js
var myApp = angular.module("myApp", ["ui.router"]);
//这里叫做App模块，这将告诉HTML页面这是一个AngularJS作用的页面，并把ui-router注入AngularJS主模块，它的内容由AngularJS引擎来解释。
myApp.config(function ($stateProvider, $urlRouterProvider) {
    //这一行声明了把 $stateProvider 和 $urlRouteProvider 路由引擎作为函数参数传入，这样我们就可以为这个应用程序配置路由了.
    $urlRouterProvider.when("", "/PageTab");
    //如果没有路由引擎能匹配当前的导航状态，默认将路径路由至 PageTab.html, 那它就像switch case语句中的default选项.就是一个默认的视图选项
    $stateProvider
        //这一行定义了会在main.html页面第一个显示出来的状态（就是进入页面先加载的html），作为页面被加载好以后第一个被使用的路由.
        .state("PageTab", {
            url: "/PageTab",//#+标识符，这里就是url地址栏上面的标识符，通过标识符，进入不同的html页面
            templateUrl: "PageTab.html"//这里是html的路径，这是跟标识符相对应的html页面
        })
        .state("PageTab.Page1", {//引号里面代表Page1是PageTab的子页面，用.隔开
            url:"/Page1",
            templateUrl: "Page-1.html"
        })
        .state("PageTab.Page2", {//需要跳转页面的时候，就是用这双引号里面的地址
            url:"/Page2",
            templateUrl: "Page-2.html"
        })
        .state("PageTab.Page3", {
            url:"/Page3",
            templateUrl: "Page-3.html"
        });
});
```









