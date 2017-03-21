/**
 * Created by wanghan1 on 2017/2/21.
 */



//  项目思路  分为两部分 首先  轮播    其次改变页面

(function($) {

    Carousel.prototype = {

        initLayout: function() {

            //初始化

            var that = this;
            var current_width = 0;
            var current_height = 0;

            this.staSign = true;
            this.first_resize = true;
            this.could_resize = false;

            this.ul = this.carousel_container.find("ul.carousel-ul");
            this.li = this.carousel_container.find("ul li.imgs");

            this.size = this.li.length-3;//减去两张假图和最后一页

            $("html,body").scrollTop(0);
            $("html,body").stop().animate({ scrollTop: 150 }, 1000, function() {


                //    滑动到下面
            });
            this.selfHref = window.location.origin + window.location.pathname;//页面实际地址


            var oHash = that.parseObj(window.location.hash);
            if (!oHash.p || parseInt(oHash.p) == 1) {
                that.staSign = false;
                that.changeHash("p=1");
                //加载他的前后页
                $(this.li[0]).find(".img-container img").attr("src",G_listdata[this.size-2].originalimg)
                $(this.li[2]).find(".img-container img").attr("src",G_listdata[1].originalimg)
            } else { 
                $(this.li[parseInt(oHash.p)]).addClass("current_index").siblings().removeClass("current_index");
                //加载当前页及前后页的图片
                $(this.li[parseInt(oHash.p)]).find(".img-container img").attr("src",G_listdata[parseInt(oHash.p)-1].originalimg);

                var prevImg = $(this.li[parseInt(oHash.p)-1]).find(".img-container img");
                var nextImg = $(this.li[parseInt(oHash.p)+1]).find(".img-container img");
                if(!prevImg.attr("src")){
                    prevImg.attr("src",G_listdata[parseInt(oHash.p)-2].originalimg);
                }
                if(!nextImg.attr("src")){

                    nextImg.attr("src",G_listdata[parseInt(oHash.p)].originalimg);
                }

            }
            function chooseWH() {
                //自适应 用来选择 以宽还是高为基础去计算。

                $("html,body").scrollTop(150);

                var real_height = window.innerHeight;
                //var real_height = window.innerHeight-150-45-92;
                //除去头部 标题 和底部。

                //var height = true;

                var n = $(".current_index").index();


                //(((window.innerWidth/1920)-(real_height/1070))>0) ? height=true : height=false ;

                //(((window.innerWidth/1000)-(real_height/458))>0) ? console.log("高小以他为比例"):console.log("宽小以他为比例");

                //if(height){
                //宽大 高小  屏幕  用高算


                that.li_width = (window.innerHeight - 80) / that.li_wh_ratio;

                that.init_Left = -Math.abs(that.li_width - ((window.innerWidth - that.li_width) / 2 - 20));

                var left = that.init_Left - ((n - 1) * (that.li_width + 20));
                //this.right_class_bg

                //that.carousel_container.css("height",real_height-80+"px");

                that.ul.css("left", left + "px");

                that.left_class_bg.css("height", real_height - 80 + "px");
                that.left_class_bg.css("width", that.li_width + "px");
                that.left_class_bg.css("left", that.init_Left + 10 + "px");


                that.right_class_bg.css("height", real_height - 80 + "px");
                that.right_class_bg.css("width", that.li_width + "px");
                that.right_class_bg.css("right", that.init_Left - 10 + "px");

                this.move_distans = that.li_width;

                if (that.first_resize) {

                    that.li.css("height", real_height - 80 + "px");
                    that.li.css("width", that.li_width + "px");
                    that.first_resize = false;
                    that.could_resize = true;


                } else {


                    that.li.stop(false, true).animate({ width: that.li_width + "px", height: real_height - 80 + "px" }, 500, function() {

                    });

                }

                that.isInit = true;
                //that.change_play();
            }
            chooseWH();

            $(window).resizeEnd({
                delay: 1000
            }, function() {
                //处理代码

                //debugger;
                // 第二部  重绘加上动画。
                that.could_resize = false;
                chooseWH();

            });

        },
        parseObj: function(hash) {
            var rhash = /[#&]([^&=]+)=([^?&=]+)/ig
              , a = rhash.exec(hash)
              , o = {};
            while (a) {
                o[a[1]] = a[2];
                a = rhash.exec(hash);
            }
            return o;
        },
        changeHash: function(hash) {

          var that = this;
          if (parseInt(hash.split('=')[1]) == parseInt(this.size) + 1) {
              window.location.hash = hash;
          } else {
              window.location.hash = hash;
          }
          
          if (typeof (gaoqingAdImpression) == "function") {
              gaoqingAdImpression();
          }
          if (that.staSign == true) {
              try {
                  if (typeof hook === 'function') {
                      var str__ = window.location.href.replace(/&/g, '|');
                      hook('&uri=' + encodeURIComponent(str__) + '&HD=HD');
                  }
              } catch (ex) {}
          }
          that.staSign = true;
          return this;
        },
        prev: function() {
            //前一张
            var that = this;
            var n = $(".current_index").index();

            if (1 < n) {
                $(that.li[n - 1]).addClass("current_index").siblings().removeClass("current_index");
                n = $(".current_index").index();

                //加载上一页及他的前一页图片
                var prevImg = $(this.li[n]).find(".img-container img");//上一页
                var prevImgPrev = $(this.li[n-1]).find(".img-container img");//上页
                
                if(!prevImg.attr("src")){
                    prevImg.attr("src",G_listdata[n-1].originalimg);
                }
                if(!prevImgPrev.attr("src")){
                    if(n==1){
                        prevImgPrev.attr("src",G_listdata[that.size-2].originalimg);
                    }else{
                        prevImgPrev.attr("src",G_listdata[n-2].originalimg);
                    }
                    
                }

                //位移
                var left = that.init_Left - ((n - 1) * (that.li_width + 20));
                that.ul.stop(false, true).animate({ left: left + "px" }, 500, function() {

                });

                //改变hash
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                that.changeHash('p=' + n);

            } else {

            }

        },
        next: function() {
            //下一张
            var that = this;
            var n = $(".current_index").index();

            if (n < (that.li.length - 2)) {
                $(that.li[n + 1]).addClass("current_index").siblings().removeClass("current_index");
                n = $(".current_index").index();

                //加载下一页及他的后一页图片
                var nextImg = $(this.li[n]).find(".img-container img");//下一页
                var nextImgNext = $(this.li[n+1]).find(".img-container img");//下下页
                if(!nextImg.attr("src")){
                    nextImg.attr("src",G_listdata[n-1].originalimg);
                }
                if(!nextImgNext.attr("src")){
                    nextImgNext.attr("src",G_listdata[n].originalimg);
                }

                //位移
                var left = that.init_Left - ((n-1) * (that.li_width + 20));
                that.ul.stop(false, true).animate({ left: left + "px" }, 500, function() {

                });

                //改变hash
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                that.changeHash('p=' + n);
            } else {
                window.location.reload(true);
                window.location.href = that.selfHref;
            }
        },
        _initEvent: function() {

            //定义左右点击
            var that = this;

            that.right_id_bg.bind("click", function() {

                if ($(".vedios-container").css("display") == "block") {

                    //    此处可以加视频播放控制暂停，在轮播的时候

                    //window.swfplay(0);

                }
                that.next();
            });
            $(".right-cursor").bind("click", function() {
                that.next();
            });

            that.left_id_bg.bind("click", function() {
                that.prev();
            });
            $(".left-cursor").bind("click", function() {
                that.prev();
            });
        

        },
        initLayout_font: function() {
            //控制中间字体块显示收缩
            $(".triangle").click(function() {
                if ($(" .current_index .font").parents().hasClass("shrink")) {
                    $(".current_index .shrink").addClass("content").removeClass("shrink");
                    $(".current_index .show_font_content").addClass("font-content").removeClass("show_font_content");

                } else {
                    $(".current_index .content").addClass("shrink").removeClass("content");
                    $(".current_index .font-content").addClass("show_font_content").removeClass("font-content");

                }
            });
        },
        share_wx_wb: function() {
            //微博  微信  空间 分享
            var data = eval('(' + $('.js_swShare_R').closest('[data-info]').attr('data-info') + ')');

            var url = data.url,
                text = data.text,
                pic = typeof data.pic !== 'undefined' ? data.pic : '';

            $('.js_swShare_R').click(function() {
                //微博
                window.open("//service.weibo.com/share/share.php?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(text) + "&pic=" + encodeURIComponent(pic));
            });
            $('.js_twShare_R').click(function() {

                window.open("//v.t.qq.com/share/share.php?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(text) + "&pic=" + encodeURIComponent(pic));
            });
            $('.js_qzShare_R').click(function() {
                //空间
                window.open("//sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(text) + "&pics=" + encodeURIComponent(pic));
            });
            $('.wx').hover(function() {
                //空间
                $(".wxImg").css("display", "block");
            }, function() {
                $(".wxImg").css("display", "none");
            });


            $('.share-logo').bind("click", function() {
                //空间
                if ($(".share-icons ").css("display") == "block") {
                    $(".share-icons ").css("display", "none");
                } else {
                    $(".share-icons ").css("display", "block");
                }

            });

        },
        button_click: function() {
            var that = this;
            //点击事件  定义button
            $(".button_refresh").bind("click", function() {
                window.location.reload(true);

                window.location.href = that.selfHref;
            });

            $(".button_list").bind("click", function() {
                window.location.href = that.listUrl;
            });


            $("#play_button").bind("click", function() {

                $(".play_remark").css("display", "none");
                $(".play_button").css("display", "none");

                $(this).siblings().css("display", "none");

                $(".vedios-container").css("display", "block");

            });
        },
        vedio_play: function() {

            //初始化视频
            var that = this;
            var vedios_height = that.li_width * that.li_wh_ratio;
            var play = new PlayItems({
                showDivId: 'playerDiv', // 播放器容器id，默认值为 playerDiv ,可选，不传时使用//注销,其他参数同理
                parentIds: "playitem", // 连播条目标签节点id，必选，如有多个列表逗号','分隔,如 'playitem1,playitem2'
                swfWidth: "100%", // 播放器宽度，可选，默认值为 400
                swfHeight: "100%", // 播放器高度，可选，默认值为 300
                playitemcss: 'current', // 条目播放时样式，可选，默认值为 current
                autoPlay: 'true', // 是否自动播放，可选，默认值为 true
                firstAutoPlay: 'true', // 第一条是否自动播放，只有autoPlay设置为 true时才生效，可选，默认值为 true
                autoLoop: 'true', // 列表是否循环播放，可选，默认值为 true
                postUrl: 'http://p2.ifengimg.com/a/2016/0510/demo.jpg', // 播放器预览图，可选，无默认值
                subject: '', // 前贴片参数，可选，无默认值，只pc端生效
                ADOrderFirst: '1', // 147规则，可选，无默认值
                index: 1, // 从第几条开始播放，0是第一条，可选，默认从0播放
                playerCB: function() {} // 条目切换时回调方法，可选
            });

            that.vedio_plays = play;
            play.init();
        },
        change_play: function() {
            // 交互可更改视频细节   未使用
            var that = this;
            var vedios_height = that.li_width * that.li_wh_ratio;

            $(".vedios-container").html();
            $(".vedios-container").append('<div id="playerDiv"></div>');
            that.vedio_plays.swfWidth = that.li_width;
            that.vedio_plays.swfHeight = vedios_height;
        }
    }

    function Carousel(container, left_bt, right_bg, loop, left_button, right_button,videoYes,listUrl) {
        this.carousel_container = $(container);
        this.left_class_bg = $("." + left_bt);
        this.right_class_bg = $("." + right_bg);

        this.right_button_bg = $("." + right_bg);
        this.left_button_bg = $("." + right_bg);

        this.isInit = false;
        this.left_id_bg = $("#" + left_bt);
        this.right_id_bg = $("#" + right_bg);
        this.current_index = $(".current_index");
        this.loop = loop;
        this.li_wh_ratio = 0.8;
        this.container_wh_ratio = 0.5573;
        this.listUrl = listUrl;

        this.initLayout();

        if(videoYes){
            this.vedio_play();
        }
        
        this._initEvent();
        this.initLayout_font();
        this.share_wx_wb();
        this.button_click();

    }  
    window.Carousel = Carousel;
    //var carousel = new Carousel(".carousel-container", "left_arrow_bt", "right_arrow_bt", false, "left_button_bg", "right_button_bg","http://baidu.com");
})(jQuery)
