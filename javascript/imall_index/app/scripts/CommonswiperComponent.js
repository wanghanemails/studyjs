/**
 * Created by wanghan1 on 2017/4/7.
 */
(function(win,$){
    var CommonswiperComponent = {
        init:function(initData){
            var device = function(e, t, n) {
                n = {
                    type: "pc"
                };
                var r = function(e) {
                        var t = {},
                            n = t.os = {},
                            r = t.browser = {},
                            i = e.match(/WebKit\/([\d.]+)/),
                            s = e.match(/(Android)\s+([\d.]+)/),
                            o = e.match(/(iPad).*OS\s([\d_]+)/),
                            u = !o && e.match(/(iPhone\sOS)\s([\d_]+)/),
                            a = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
                            f = a && e.match(/TouchPad/),
                            l = e.match(/Kindle\/([\d.]+)/),
                            c = e.match(/Silk\/([\d._]+)/),
                            h = e.match(/(BlackBerry).*Version\/([\d.]+)/),
                            p = e.match(/(BB10).*Version\/([\d.]+)/),
                            d = e.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
                            v = e.match(/PlayBook/),
                            m = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/),
                            g = e.match(/Firefox\/([\d.]+)/),
                            y = e.match(/Windows Phone/);
                        return r.webkit = !!i, r.webkit && (r.version = i[1]), y && (n.wphone = !0), s && (n.android = !0, n.version = s[2]), u && (n.ios = !0, n.iphone = !0, n.version = u[2].replace(/_/g, ".")), o && (n.ios = !0, n.ipad = !0, n.version = o[2].replace(/_/g, ".")), a && (n.webos = !0, n.version = a[2]), f && (n.touchpad = !0), h && (n.blackberry = !0, n.version = h[2]), p && (n.bb10 = !0, n.version = p[2]), d && (n.rimtabletos = !0, n.version = d[2]), v && (r.playbook = !0), l && (n.kindle = !0, n.version = l[1]), c && (r.silk = !0, r.version = c[1]), !c && n.android && e.match(/Kindle Fire/) && (r.silk = !0), m && (r.chrome = !0, r.version = m[1]), g && (r.firefox = !0, r.version = g[1]), n.tablet = !!(o || v || s && !e.match(/Mobile/) || g && e.match(/Tablet/)), n.phone = !!(!n.tablet && (s || u || a || h || p || m && e.match(/Android/) || m && e.match(/CriOS\/([\d.]+)/) || g && e.match(/Mobile/)) || y), t
                    },
                    i = r(navigator.userAgent);
                n.config = i, i.os.tablet && (n.type = "pad"), i.os.phone && (n.type = "mobile");
                var s = t.screen.width,
                    o = t.screen.height,
                    u = t.innerWidth,
                    a = t.innerHeight;
                if (i.os.ios || n.type === "pc") n.width = s, n.height = o;
                else {
                    var f = s / u,
                        l = o / a,
                        c = f < l ? f : l;
                    n.width = Math.floor(s / c), n.height = Math.floor(o / c)
                }
                return n
            }(document, window);
            this.loopFlag = initData.loop;
            this.device = device;
            this.index = this.loopFlag ? 1 : 0;//记录显示的图片的index
            this.timer = null;//定时器
            this.initDom(initData);
            this.currentClass = initData.handlercurrent;
            this.timeInter = initData.time;
            //循环模式
            if(initData.auto){
                this.bigpicInterval();
            };
            if(device.type != "pc"){
                this.initMobielEvent(initData);
            }else{
                this.initEvent(initData);
            };

        }
    };
    CommonswiperComponent.init.prototype={
        initDom:function(initData){
            this.container = $('.'+initData.container);
            this.swiper_wrapper = this.container.find('.swiper_wrapper');
            var swiper = this.container.find('.swiper');
            var length = swiper.length;
            this.total = length//记录总共的滑动张数
            //hover操作翻页dom
            this.handler = initData.handlerClassname?this.container.find('.'+initData.handlerClassname):"";
            //翻页对应显示的内容
            this.contentInfo = initData.contentClassname?this.container.find('.'+initData.contentClassname):"";
            //左右翻页按钮
            if(initData.buttonClass){
                this.prev = this.container.find('.'+initData.buttonClass[0]);
                this.next = this.container.find('.'+initData.buttonClass[1]);
            };
            if(initData.loop){
                //循环模式需要给前后各添加一张幻灯
                swiper.eq(0).clone(true).appendTo(this.swiper_wrapper);
                swiper.eq(length-1).clone(true).insertBefore(swiper.eq(0));
                length = length+2;
            };
            swiper = this.container.find('.swiper');
            //修改父元素的宽度
            if(this.device == "mobile"){
                this.width = $(window).width();
                swiper.css("width",this.width);
            }else if(this.device == "pad"){
                if(initData.padFlag){
                    this.width = swiper.eq(0).width();
                }else{
                    this.width = $(window).width();
                    swiper.css("width",this.width);
                }
            }else{
                this.width = swiper.eq(0).width();
            }
            var widthTotal = this.width*length;
            var _this = this;
            this.swiper_wrapper.width(widthTotal);
            if(initData.loop){
                this.swiper_wrapper.css('margin-left',-this.width);
            };

        },
        initEvent:function(initData){
            var swiper = this.container.find('.swiper');
            var _this = this;
            function closeInterval(){
                //关闭定时器
                clearInterval(_this.timer);
            }
            function openInterval(){
                //开启定时器
                _this.bigpicInterval();
            }
            if(initData.auto){
                swiper.hover(function(){
                    closeInterval();
                },function(){
                    openInterval()
                });
                _this.next.hover(function(){
                    closeInterval();
                },function(){
                    openInterval()
                });
                _this.prev.hover(function(){
                    closeInterval();
                },function(){
                    openInterval()
                });
            };

            _this.next.on('click',function(){
                clearInterval(_this.timer);
                _this.swiper_wrapper.stop(true,true);
                _this.index = _this.index+1;
                _this.bigpicSwiper();
                return false;
            });
            _this.prev.on('click',function(){
                clearInterval(_this.timer);
                _this.swiper_wrapper.stop(true,true);
                _this.index = _this.index-1;
                _this.bigpicSwiper();
                return false;
            });
            if(_this.handler){
                _this.handler.find('li').hover(function() {
                    clearInterval(_this.timer);
                    _this.swiper_wrapper.stop(true,true);
                    _this.index = $(this).index()+1;
                    _this.bigpicSwiper();
                    return false;
                }, function() {
                    openInterval();
                    return false;
                });
            };

            _this.container.on("mouseover",function(){
                if(typeof initData.overFun == "function"){
                    initData.overFun();
                }
            });
            _this.container.on("mouseout",function(){
                if(typeof initData.outFun == "function"){
                    initData.outFun();
                }
            });
        },
        bigpicInterval:function(){
            var _this = this;
            clearInterval(this.timer);
            _this.timer = setInterval(function(){
                _this.index = _this.index+1;
                _this.bigpicSwiper();
            },_this.timeInter);
        },
        bigpicSwiper:function(){
            var width = this.width;
            var index = this.index;
            var _this = this;
            if(this.loopFlag){
                if(index > this.total){
                    this.swiper_wrapper.animate({marginLeft:-width*index+'px'},function(){
                        $(this).css('margin-left',-width);
                        _this.index = index = 1;
                        update();
                        return false;
                    });
                }else if(index < 1){
                    this.swiper_wrapper.animate({marginLeft:-width*index+'px'},function(){
                        $(this).css('margin-left',-_this.total*width);
                        _this.index = index = _this.total;
                        update();
                        return false;
                    });
                }else{
                    this.swiper_wrapper.animate({marginLeft:-width*index+'px'},function(){
                        update();
                        return false;
                    });
                };
            }else{
                if(index > this.total - 1){
                    index = this.index = this.total - 1;
                }else if(index < 0){
                    index = this.index = 0;
                }
                this.swiper_wrapper.animate({marginLeft:-width*index+'px'},function(){
                    update();
                    return false;
                });
            }

            function update(){
                //显示对应内容
                if(_this.contentInfo){
                    _this.contentInfo.hide();
                    _this.contentInfo.eq(_this.loopFlag ? index-1 : index).show();
                };
                //操作对应的handler
                if(_this.handler){
                    var li = _this.handler.find('li');
                    li.removeClass(_this.currentClass);
                    li.eq(_this.loopFlag ? index-1 : index).addClass(_this.currentClass);
                }
            }
        },
        initMobielEvent:function(initData){
            var _this = this;
            var swiper = this.container.find('.swiper');
            var container = this.swiper_wrapper;
            var startX,startY,moveX = 0;
            var initLeft;
            this.container.on('touchstart',function(){
                _this.swiper_wrapper.stop(true,true);
                //关闭定时器
                clearInterval(_this.timer);
                //获取marginleft的值
                initLeft = parseInt(container.css('marginLeft'));
                startMove();
                return false;
            });
            this.container.on('touchmove',function(){
                var location = touchMove();
                moveX = location.x;
                container.css('marginLeft',moveX+initLeft+'px');
                return false;
            });
            this.container.on('touchend',function(){
                if(moveX < -10 || moveX > 10){
                    _this.swiper_wrapper.stop(true,true);
                    if(moveX < -10){
                        //向右滑动
                        _this.index = _this.index+1;

                    }else{
                        //向左滑动
                        _this.index = _this.index-1;
                    };
                    _this.bigpicSwiper();
                }else{
                    //tap事件
                    var href = $(this).find('a').attr('href');
                    window.open(href);
                }
                //初始化
                if(initData.auto){
                    //开启定时器
                    _this.bigpicInterval();
                }
                moveX = 0;
                return false;
            });
            _this.next.on('touchend',function(){
                clearInterval(_this.timer);
                _this.swiper_wrapper.stop(true,true);
                _this.index = _this.index+1;
                _this.bigpicSwiper();
                return false;
            });
            _this.prev.on('touchend',function(){
                clearInterval(_this.timer);
                _this.swiper_wrapper.stop(true,true);
                _this.index = _this.index-1;
                _this.bigpicSwiper();
                return false;
            });
            function startMove(){
                var touch = event.touches[0];
                startY = touch.pageY;
                startX = touch.pageX;
            };
            function touchMove(){
                var touch = event.touches[0];
                var x = touch.pageX - startX;
                var y = touch.pageY - startY;
                var location = {
                    x: x,
                    y: y
                };
                return location;
            }
        }
    }
    win.CommonswiperComponent = CommonswiperComponent;
})(window,jQuery)
