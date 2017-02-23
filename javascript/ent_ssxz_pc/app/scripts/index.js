/**
 * Created by wanghan1 on 2017/2/21.
 */



//  项目思路  分为两部分 首先  轮播    其次改变页面

(function($){




        Carousel.prototype = {

            initLayout :function(){

                var that = this;
                var current_width = 0;
                var current_height = 0;


                this.first_resize = true;
                this.could_resize = false;


               this.ul =  this.carousel_container.find("ul");
               this.li =  this.carousel_container.find("ul li");


              function chooseWH(){

                  var real_height = window.innerHeight-150-45-92;

                  var height = true;

                  var n  = $(".current").index();

                      (((window.innerWidth/1000)-(real_height/458))>0) ? height=true : height=false ;

                      //(((window.innerWidth/1000)-(real_height/458))>0) ? console.log("高小以他为比例"):console.log("宽小以他为比例");


                      if(height){
                          //宽大 高小  屏幕  用高算

                          that.li_width =(real_height-80)/that.li_wh_ratio;

                          that.init_Left =-Math.abs(that.li_width-((window.innerWidth-that.li_width)/2-20));

                          var left = that.init_Left - ((n-1)*(that.li_width+20));
                          //this.right_class_bg

                          //that.carousel_container.css("height",real_height-80+"px");

                          that.ul.css("left",left+"px");

                          that.left_class_bg.css("height",real_height-80+"px");
                          that.left_class_bg.css("width",that.li_width+"px");
                          that.left_class_bg.css("left",that.init_Left+10+"px");


                          that.right_class_bg.css("height",real_height-80+"px");
                          that.right_class_bg.css("width",that.li_width+"px");
                          that.right_class_bg.css("right",that.init_Left+10+"px");

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

                      }else{

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
                          that.right_class_bg.css("right",that.init_Left+10+"px");

                          this.move_distans = that.li_width;

                          if(that.first_resize){
                              that.li.css("height",container_height-80+"px");
                              that.li.css("width", that.li_width+"px");

                          }else{

                              that.li.stop(false, true).animate({width:that.li_width+"px",height:container_height-80+"px"},1000,function(){

                              });

                          }

                      }

              }

                chooseWH();


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

                var that = this;

                var n  = $(".current").index();


                if(1<n){

                    $(that.li[n-1]).addClass("current").siblings().removeClass("current");
                    n  = $(".current").index();

                    var left = that.init_Left - ((n-1)*(that.li_width+20));

                    that.ul.stop(false, true).animate({left:left+"px"},1000,function(){

                    });

                }else{

                }

            },
            next:function(){
                var that = this;

                var n  = $(".current").index();


                if(n<(that.li.length-2)){

                    $(that.li[n+1]).addClass("current").siblings().removeClass("current");


                    var left = that.init_Left - (n*(that.li_width+20));

                    that.ul.stop(false, true).animate({left:left+"px"},1000,function(){

                    });

                }else{

                }
            },
            _initEvent:function(){

                var that = this;

                that.right_id_bg.bind("click",function(){
                    that.next();
                });

                that.left_id_bg.bind("click",function(){
                    that.prev();
                });
            },
            initLayout_font:function(){


                $(".triangle").click(function(){


                    if( $(" .current .font").parents().hasClass("shrink")){


                        $(".current .shrink").addClass("content").removeClass("shrink");
                        $(".current .show_font_content").addClass("font-content").removeClass("show_font_content");


                    }else{
                        $(".current .content").addClass("shrink").removeClass("content");
                        $(".current .font-content").addClass("show_font_content").removeClass("font-content");

                    }

                });
            },
            share_wx_wb:function(){
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
            }



        }

























      function Carousel (container,left_bt,right_bg,loop){
          this.carousel_container = $(container);
          this.left_class_bg = $("."+left_bt);
          this.right_class_bg = $("."+right_bg);

          this.left_id_bg = $("#"+left_bt);
          this.right_id_bg = $("#"+right_bg);
          this.current = $(".current");
          this.loop = loop;
          this.li_wh_ratio = 0.8;
          this.container_wh_ratio = 0.4583;


          //this.move_distans =  -Math.abs(this.li_width-((window.innerWidth-this.li_width)/2-20));;

           this.initLayout();
          this._initEvent();
          this.initLayout_font();
          this.share_wx_wb();
      }


    var carousel  = new  Carousel(".carousel-container","left_arrow_bt","right_arrow_bt",false);

})(jQuery)