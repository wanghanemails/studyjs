/**
 * Created by wanghan1 on 2017/2/21.
 */



//  项目思路  分为两部分 首先  轮播    其次改变页面

(function($){

        Carousel.prototype = {

            initLayout :function(){

                //初始化

                var that = this;
                var current_width = 0;
                var current_height = 0;


                this.first_resize = true;
                this.could_resize = false;


               this.ul =  this.carousel_container.find("ul.carousel-ul");
               this.li =  this.carousel_container.find("ul li.imgs");


              function chooseWH(){
                  //自适应 用来选择 以宽还是高为基础去计算。

                  var real_height = window.innerHeight;
                  //var real_height = window.innerHeight-150-45-92;
                  //除去头部 标题 和底部。

                  var height = true;

                  var n  = $(".current_index").index();


                      (((window.innerWidth/1920)-(real_height/1070))>0) ? height=true : height=false ;

                      //(((window.innerWidth/1000)-(real_height/458))>0) ? console.log("高小以他为比例"):console.log("宽小以他为比例");

                      if(height){
                          //宽大 高小  屏幕  用高算

                          debugger;
                          that.li_width =(real_height-80)/that.li_wh_ratio;

                          that.init_Left =-Math.abs(that.li_width-((window.innerWidth-that.li_width)/2-40));

                          var left = that.init_Left - ((n-1)*(that.li_width+20));
                          //this.right_class_bg

                          //that.carousel_container.css("height",real_height-80+"px");

                          that.ul.css("left",left+"px");

                          that.left_class_bg.css("height",real_height-80+"px");
                          that.left_class_bg.css("width",that.li_width+"px");
                          that.left_class_bg.css("left",that.init_Left+10+"px");


                          that.right_class_bg.css("height",real_height-80+"px");
                          that.right_class_bg.css("width",that.li_width+"px");
                          that.right_class_bg.css("right",that.init_Left-10+"px");

                          this.move_distans = that.li_width;

                          if(that.first_resize){

                              that.li.css("height",real_height-80+"px");
                              that.li.css("width",that.li_width+"px");
                              that.first_resize = false;
                              that.could_resize = true;


                          }else{


                              that.li.stop(false, true).animate({width:that.li_width+"px",height:real_height-80+"px"},1000,function(){

                              });

                          }

                      }
                      else{

                          //    高大宽小 屏幕  用宽算


                          var container_height =   (window.innerWidth*that.container_wh_ratio)



                          that.li_width =((container_height)-80)/that.li_wh_ratio;


                          that.init_Left = -Math.abs(that.li_width-((window.innerWidth-that.li_width)/2-20));
                          var left = that.init_Left - ((n-1)*(that.li_width+20));
                          //that.carousel_container.css("height",container_height-80+"px");

                          that.ul.css("left",left+"px");

                          that.left_class_bg.css("height",container_height-80+"px");
                          that.left_class_bg.css("width",that.li_width+"px");
                          that.left_class_bg.css("left",that.init_Left+10+"px");


                          that.right_class_bg.css("height",container_height-80+"px");
                          that.right_class_bg.css("width",that.li_width+"px");
                          that.right_class_bg.css("right",that.init_Left-10+"px");

                          this.move_distans = that.li_width;

                          if(that.first_resize){
                              that.li.css("height",container_height-80+"px");
                              that.li.css("width", that.li_width+"px");

                          }else{

                              that.li.stop(false, true).animate({width:that.li_width+"px",height:container_height-80+"px"},1000,function(){

                              });

                          }

                      }


                  //that.vedio_play();
                  //console.log(that.isInit)
                  //debugger;
                  //if(that.isInit){
                  //    that.change_play();
                  //}
                  that.isInit = true;
                  //that.change_play();
              }
                chooseWH();

                console.log(that.li_width)

                //debugger;


                $(window).resizeEnd({
                    delay: 1000
                }, function(){
                    //处理代码
                   // 第二部  重绘加上动画。
                    that.could_resize = false;
                   chooseWH();
                });

            },

            prev:function(){

                //前一张
                var that = this;

                var n  = $(".current_index").index();


                if(1<n){

                    $(that.li[n-1]).addClass("current_index").siblings().removeClass("current_index");
                    n  = $(".current_index").index();

                    var left = that.init_Left - ((n-1)*(that.li_width+20));

                    that.ul.stop(false, true).animate({left:left+"px"},1000,function(){

                    });

                }else{

                }

            },
            next:function(){
                //下一张
                var that = this;

                var n  = $(".current_index").index();


                if(n<(that.li.length-2)){


                    $(that.li[n+1]).addClass("current_index").siblings().removeClass("current_index");


                    var left = that.init_Left - (n*(that.li_width+20));

                    that.ul.stop(false, true).animate({left:left+"px"},1000,function(){

                    });

                }else{

                }
            },
            _initEvent:function(){

                //定义左右点击
                var that = this;

                that.right_id_bg.bind("click",function(){
                    that.next();
                });

                that.left_id_bg.bind("click",function(){
                    that.prev();
                });
            },
            initLayout_font:function(){
                //控制中间字体块显示收缩

                $(".triangle").click(function(){


                    if( $(" .current_index .font").parents().hasClass("shrink")){


                        $(".current_index .shrink").addClass("content").removeClass("shrink");
                        $(".current_index .show_font_content").addClass("font-content").removeClass("show_font_content");


                    }else{
                        $(".current_index .content").addClass("shrink").removeClass("content");
                        $(".current_index .font-content").addClass("show_font_content").removeClass("font-content");

                    }

                });
            },
            share_wx_wb:function(){
                //微博  微信  空间 分享
                var data = eval('('+$('.js_swShare_R').closest('[data-info]').attr('data-info')+')');

                var url = data.url, text = data.text, pic = typeof data.pic !== 'undefined' ? data.pic:'';
                $('.js_swShare_R').click(function(){
                    //微博
                    window.open("//service.weibo.com/share/share.php?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(text)+"&pic="+encodeURIComponent(pic));});
                $('.js_twShare_R').click(function(){

                    window.open("//v.t.qq.com/share/share.php?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(text)+"&pic="+encodeURIComponent(pic));
                });
                $('.js_qzShare_R').click(function(){
                    //空间
                    window.open("//sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(text)+"&pics="+encodeURIComponent(pic));
                });
                $('.wx').hover(function(){
                    //空间
                        $(".wxImg").css("display","block");
                } ,function(){
                        $(".wxImg").css("display","none");
                });


                $('.share-logo').bind("click",function(){
                    //空间
                    if($(".share-icons ").css("display")=="block"){
                        $(".share-icons ").css("display","none");
                    }else{
                        $(".share-icons ").css("display","block");
                    }

                } );

            },
            button_click:function(){

                //点击事件  定义button
                $(".button_refresh").bind("click",function(){
                    window.location.reload();
                });

                $(".button_list").bind("click",function(){
                    window.location.href="http://www.ifeng.com";
                });


                $(".play_button").bind("click",function(){

                    $(".play_remark").css("display","none");
                    $(".play_button").css("display","none");

                    $(this).siblings().css("display","none");

                    $(".vedios-container").css("display","block");

                });
            },
            vedio_play:function(){

                //初始化视频


                var that = this;


                var vedios_height = that.li_width*that.li_wh_ratio;

                $(".vedios-container").html();
                $(".vedios-container").append('<div id="playerDiv"></div>');


                var play = new PlayItems({
                    showDivId : 'playerDiv',        // 播放器容器id，默认值为 playerDiv ,可选，不传时使用//注销,其他参数同理
                    parentIds :"playitem",          // 连播条目标签节点id，必选，如有多个列表逗号','分隔,如 'playitem1,playitem2'
                    swfWidth : "100%",               // 播放器宽度，可选，默认值为 400
                    swfHeight :"100%",               // 播放器高度，可选，默认值为 300
                    playitemcss : 'current',        // 条目播放时样式，可选，默认值为 current
                    autoPlay : 'true',              // 是否自动播放，可选，默认值为 true
                    firstAutoPlay : 'true',        // 第一条是否自动播放，只有autoPlay设置为 true时才生效，可选，默认值为 true
                    autoLoop : 'true',              // 列表是否循环播放，可选，默认值为 true
                    postUrl : 'http://p2.ifengimg.com/a/2016/0510/demo.jpg',     // 播放器预览图，可选，无默认值
                    subject : '',                   // 前贴片参数，可选，无默认值，只pc端生效
                    ADOrderFirst :'1',              // 147规则，可选，无默认值
                    index : 1,                      // 从第几条开始播放，0是第一条，可选，默认从0播放
                    playerCB : function(){}         // 条目切换时回调方法，可选
                });

                that.vedio_plays = play;
                play.init();
            },
            change_play:function(){
                // 交互可更改视频细节   未使用
                var that = this;

                var vedios_height = that.li_width*that.li_wh_ratio;

                $(".vedios-container").html();
                $(".vedios-container").append('<div id="playerDiv"></div>');
                that.vedio_plays.swfWidth = that.li_width;
                that.vedio_plays.swfHeight = vedios_height;


            }

        }

      function Carousel (container,left_bt,right_bg,loop){
          this.carousel_container = $(container);
          this.left_class_bg = $("."+left_bt);
          this.right_class_bg = $("."+right_bg);

          this.isInit = false;
          this.left_id_bg = $("#"+left_bt);
          this.right_id_bg = $("#"+right_bg);
          this.current_index = $(".current_index");
          this.loop = loop;
          this.li_wh_ratio = 0.8;
          this.container_wh_ratio = 0.5573;


          //this.move_distans =  -Math.abs(this.li_width-((window.innerWidth-this.li_width)/2-20));;

          this.initLayout();
          this._initEvent();
          this.initLayout_font();
          this.share_wx_wb();
          this.button_click();
          this.vedio_play();
      }


    var carousel  = new  Carousel(".carousel-container","left_arrow_bt","right_arrow_bt",false);

})(jQuery)