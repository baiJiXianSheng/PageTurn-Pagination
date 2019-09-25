/**
 * Author：Joey Wu
 * Version 1.0.0
 */

var PageTurn = (function () {

    /**
     * 
     * @param {String} domId 容器Id "#Id"
     * @param {Object} options 
     */
    function PageTurn(domId, options) {
        
        this.options = {
            totalCount: 100, // 消息总数量
            pagination: {
                PageIndex: 1, // 当前页索引
                PageSize: 10 // 每页消息数量
            },
            liCounts: 5, // li 列表数量
            selectArr: [10, 20], // 每页数量option选项
            disableJump: false, // 是否禁用页码跳转
            disableOptions: false, // 是否禁用option选项
            onSelect: function (pageSize, pageIndex) {}, // 每页数量切换事件，参数：pageSize 切换后每页数量, 切换后当前选中的页码 pageIndex
            onPrePage: function (pageIndex) {}, // 上一页按钮时触发，参数：pageIndex 点击上一页后的当前页码
            onNextPage: function (pageIndex) {}, // 下一页按钮时触发，参数：pageIndex 点击下一页后的当前页码
            onJumpTo: function (pageIndex) {}, // （回车键）跳转时对应页码时触发，参数：跳转后的当前页码
            onInit: function (pageturn) {}, // 插件初始化结束
            onClickItem: function (index, pageIndex) {} // 点击 li 时触发，参数：index 点击的li在ul中的索引, pageindex 点击的li对应的页码
        }

        this.dom = document.querySelector(domId); // 容器节点

        if (!this.dom) return console.error("'" + domId + "' is not fonud by querySelect function!\nPlease make sure the first param is like '#domId' or '.domClass'.");
        
        for (var key in options) {
            if (Object.prototype.toString.call(options[key]) === "[object Object]") {
                for (var k in options[key]) {
                    this.options[key][k] = options[key][k];
                }
            } else
                this.options[key] = options[key];
        }

        console.log(this.options);

        this._init();
    }

    PageTurn.prototype._init = function () {
        var str = '<div class="record-text">共<span id="totalCount"></span>条记录 第<span id="curPageIndex">1</span>/<span id="totalPage">1</span>页</div><div class="page-turn"><div class="pre-page fl user-noselect-text">&lt;</div><ul id="ul-tab" class="fl"></ul><div class="next-page fl user-noselect-text">&gt;</div>'+ (this.options.disableOptions ? '' : '<select class="fl" name="" id="everyPageNum"></select>') + (this.options.disableJump ? '' : '<div class="fl jumpto">跳至<input type="text" id="jumto-input" value="1">页</div>') + '</div>';

        this.dom.innerHTML = str;
        this.dom.classList.add("page-info");

        var _tempCount = this.options.liCounts;
        this.liCountsArr = new Array(_tempCount).fill(0).map(function () { return --_tempCount });
        
        this.totalPage = 1; // 总页数

        this.initDom();

        this.refreshList();
        this.options.onInit(this);
    }

    PageTurn.prototype.initEvent = function () {

        var self = this,
            options = self.options,
            pagination = options.pagination;
        
        if (!options.disableOptions) {
            // 切换每页数量
            self.everyPageNumDom.onchange = function (evt) {
                // console.log(this.value, this.selectedIndex, this.options);

                pagination.PageSize = Number(this.value);
                pagination.PageIndex = 1; // 切换数量时默认加载第一页
                options.onSelect(pagination.PageSize, pagination.PageIndex);
                self.refreshList();
            }
        }

        // 上一页
        self.prePageDom.onclick = function () {
            if (pagination.PageIndex <= 1)
                return;

            pagination.PageIndex--;
            
            options.onPrePage(pagination.PageIndex);
            self.refreshList();
        }
        // 下一页
        self.nextPageDom.onclick = function () {
            if (pagination.PageIndex >= self.totalPage)
                return;

            pagination.PageIndex++;

            options.onNextPage(pagination.PageIndex);
            self.refreshList();
        }

        // 点击li列表页数
        self.ulDom.addEventListener("click", self.changeLi.bind(self, pagination)); 

        if (!options.disableJump) {
            // 跳转页码
            document.onkeyup = function (evt) {
                // console.log("evt.keyCode:", evt.keyCode);
                if (evt.keyCode == 13) {
                    var index = Number(self.jumtoInputDom.value);
                    if (index > self.totalPage) {
                        index = self.totalPage;
                        self.jumtoInputDom.value = self.totalPage;
                    }
                    if (index <= 0) {
                        index = 1;
                        self.jumtoInputDom.value = index;
                    }
                    pagination.PageIndex = index;
                    
                    options.onJumpTo(pagination.PageIndex);
                    self.refreshList();
                }
            }
        }
        
    }

    PageTurn.prototype.initDom = function () {
        this.totalPageDom = document.getElementById("totalPage");
        this.ulDom = document.getElementById("ul-tab");
        this.prePageDom = document.getElementsByClassName("pre-page")[0];
        this.nextPageDom = document.getElementsByClassName("next-page")[0];
        this.totalCountDom = document.getElementById("totalCount");
        this.curPageIndexDom = document.getElementById("curPageIndex");

        this.prePageDom.setAttribute("unselectable", "on"); // < IE 10，禁止选中文本
        this.nextPageDom.setAttribute("unselectable", "on"); // < IE 10，禁止选中文本

        var options = this.options,
            selectArr = options.selectArr,
            totalCount = options.totalCount,
            pagination = options.pagination;

        if (!options.disableJump) {
            this.jumtoInputDom = document.getElementById("jumto-input");
        }

        if (!options.disableOptions) {
            this.everyPageNumDom = document.getElementById("everyPageNum");

            for (var i = 0, len = selectArr.length; i < len; i++) {
                var option = document.createElement("option");
                option.value = selectArr[i];
                option.innerText = "每页" + selectArr[i] + "条";
                if (selectArr[i] == pagination.PageSize)
                    option.selected = "selected";
    
                this.everyPageNumDom.appendChild(option);
            }

        }

        this.totalCountDom.innerHTML = totalCount;

        this.initEvent();
    }

    PageTurn.prototype.refreshList = function (notrerenderLi) {
        var options = this.options,
            totalPage = this.totalPage,
            totalCount = options.totalCount,
            pagination = options.pagination,
            liCounts = options.liCounts;

        totalPage = this.totalPage = Math.ceil(totalCount / pagination.PageSize) > 0 ? Math.ceil(totalCount / pagination.PageSize) : 1;

        this.totalPageDom.innerHTML = totalPage;

        this.curPageIndexDom.innerHTML = pagination.PageIndex;

        // 点击 li 时无需删除重绘
        if (!notrerenderLi) {
            this.ulDom.innerHTML = "";

            for (var i = 1; i <= liCounts; i++) {
                var index = Math.floor(pagination.PageIndex / liCounts) * liCounts + i;

                if (pagination.PageIndex % liCounts == 0)
                    index = pagination.PageIndex - this.liCountsArr[i - 1];

                if (index > totalPage)
                    break;
                
                var li = document.createElement("li"); 
                li.classList.add("user-noselect-text");
                
                if (pagination.PageIndex % liCounts == 0 && i == liCounts || pagination.PageIndex % liCounts == i)
                    li.classList.add("active");

                li.setAttribute("data-index", index);
                li.setAttribute("unselectable", "on"); // < IE 10，禁止选中文本
                li.innerHTML = index;
                this.ulDom.appendChild(li);
            }

        }
        
        if (totalPage <= 1) {
            this.prePageDom.style.display = "none";
            this.nextPageDom.style.display = "none";
        } else {
            this.prePageDom.style.display = "block";
            this.nextPageDom.style.display = "block";
        }
        
    }

    PageTurn.prototype.changeLi = function changeLi (pagination, evt) {
        // console.log(...arguments);
        var lis = this.ulDom.getElementsByTagName("li");
        
        if (evt.target.tagName.toLowerCase() == "li") {
            var pageindex = evt.target.getAttribute("data-index"),
                index = 0;
            
            for (var i = 0, len = lis.length; i < len; i++) {
                lis[i].classList.remove("active");
                
                if (lis[i] === evt.target)
                    index = i;
            }

            this.options.onClickItem(index, pageindex);

            evt.target.classList.add("active");
            pagination.PageIndex = Number(pageindex);

            this.refreshList(true);
        } 
    }


    return PageTurn;
})();