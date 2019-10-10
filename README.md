# PageTurn-Pagination
原生 js 编写的一款 分页 插件，简单易用


## Usage
```js

    var PageTurn = new PageTurn("#pageturn-container", {
        /*
            可选参数：
            
            totalCount: 100, // 消息总数量
            pagination: {
                PageIndex: 1, // 当前页索引
                PageSize: 10 // 每页消息数量
            },
            liCounts: 5, // li 列表数量

            navTabId: "#nav-main", // 栏目容器Id
            navData: [{ name: "栏目1", id: 1000 }, { name: "栏目2", id: 1001 }, { name: "栏目3", id: 1003 }], // 栏目标签
            navIndex: 0, // 当前栏目索引
            disableNav: false, // 是否禁用一级栏目
            
            // 切换栏目事件，参数：index 当前点击的li索引，id 当前点击的li所对应的栏目id，mypageturn 插件实例
            onChangeNav: function (index, id, mypageturn) {
                
                // 记得传递 totalCount（新数据的length） 并调用 mypageturn.refresh(totalCount) 刷新一下哦~ 
                mypageturn.refresh(totalCount);
            }, 

            disableTips: false, // 是否禁用 记录-页码提示
            
            prePageIcon: "", // 上一页按钮图标
            nextPageIcon: "", // 下一页按钮图标
            selectArr: [10, 20], // 每页数量option选项
            disableJump: false, // 是否禁用页码跳转
            disableOptions: false, // 是否禁用option选项
            onSelect: function (pageSize, pageIndex) {}, // 每页数量切换事件，参数：pageSize 切换后每页数量, 切换后当前选中的页码 pageIndex
            onPrePage: function (pageIndex) {}, // 上一页按钮时触发，参数：pageIndex 点击上一页后的当前页码
            onNextPage: function (pageIndex) {}, // 下一页按钮时触发，参数：pageIndex 点击下一页后的当前页码
            onJumpTo: function (pageIndex) {}, // （回车键）跳转时对应页码时触发，参数：跳转后的当前页码
            onInit: function (instance) {}, // 插件初始化结束，参数：instance 插件实例
            onClickItem: function (index, pageIndex) {} // 点击页码时触发，参数：index 点击的li在ul中的索引, pageIndex 点击的li对应的页码
        */
    });

```
