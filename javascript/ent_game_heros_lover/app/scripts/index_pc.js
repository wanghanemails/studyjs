/**
 * Created by wanghan1 on 2017/8/23.
 */
(function ($) {

    HerosLover.prototype={
        begin_layout:function () {
            var that = this;
            that.window_height =750;
            that.window_width =1206;

            that.progress_bar_height = Math.floor((562/608)*that.window_width*91.2/100);




            //logo 位置

            $(".logo-1").css("marginTop",(that.window_height*328/1206));

            // p1 button 定位
            var top_begin_btn = (that.window_height - $(".begin-btn").height())/2;
            var left_begin_btn = that.window_width*(166/750);

            //
            // $(".begin-btn").css("top",left_begin_btn+"px");
            // $(".begin-btn").css("left",top_begin_btn+"px");

            // p1 button 定位



            //每一个li 的高度
            var each_li_height = (275/1206)*that.window_width;

            $(".p2 .p2-begin .heros-start-ul li").height(each_li_height);
            //每一个li 的高度
            var each_margin_top ="0px" ;
            //每一个li 的的上外边距
            if((each_li_height*6)-that.window_width>0){

                each_margin_top = -(((each_li_height*6)-that.window_width)-12)/5;
                $(".p2 .p2-begin .heros-start-ul li").css("marginTop",each_margin_top+"px");
                $(".p2 .p2-begin .heros-start-ul li:nth-child(1)").css("marginTop","-12px");
            }else {

                each_margin_top =  (that.window_width-(each_li_height*6))/5

                $(".p2 .p2-begin .heros-start-ul li").css("marginTop",each_margin_top+"px");
                $(".p2 .p2-begin .heros-start-ul li:nth-child(1)").css("marginTop","0px");
            }
            //每一个li 的的上外边距





        },
        begin_event:function () {
            var that = this;


            if(IsPC()==true){
                that.click_type = "mousedown";
                that.move_type = "mousemove";
                that.end_type = "mouseup";
            }else {
                that.click_type = "touchstart";
                that.move_type = "touchmove";
                that.end_type = "touchend";
            }

            $(".begin-btn").bind(that.click_type,function () {

                $(".section-container").css("top","-100%");
                $(".p2-begin").css("display","block");
            });
        },
        percentage_to_px:function (left_percentage,screen_size) {
            var that = this;

            var left_percentage =   left_percentage+"";
            var real_left = parseFloat(left_percentage.substr(0,left_percentage.length-1))*screen_size/100;
            return real_left;
        },
        maxNum:function (a,b) {
            var that = this;
            if(a>b){
                return a;
            }else {
                return b;
            }

        },
        each_hero_scene:function () {
            var that = this;

            $(".heros-start-ul li").unbind().bind(that.click_type,function () {
                var n = $(this).index();


                $(".p2-begin").css("display","none");

                $(".real-container").css("display","block");
                $(".real-container li").eq(n).css("display","block");
                //    每次点击的时候初始化   回归原位。



                var progress_left = that.percentage_to_px( $(".real-container li").eq(n).find(".progress-bar").css("left"),that.window_height);

                var progress_half = $(".real-container li").eq(n).find(".progress-bar").width()/2;

                //切口位置  下边的距离
                var  bottom_width = progress_left+progress_half;











                $(".real-container li").eq(n).find(".scene1-left").width(bottom_width);
                $(".real-container li").eq(n).find(".scene1-right").width(that.window_height-bottom_width);


                $(".real-container li").eq(n).find(".scene1-left img").width(that.window_height);
                $(".real-container li").eq(n).find(".scene1-right img").width(that.window_height);


                $(".real-container li").eq(n).find(".scene1-left img").height(that.window_width);
                $(".real-container li").eq(n).find(".scene1-right img").height(that.window_width);







                $(".real-container li").eq(n).find(".scene1-left").css("left","0px");
                $(".real-container li").eq(n).find(".scene1-right").css("right","0px");

                $(".real-container li").eq(n).find(".scene-1-container").css("display","block");

            //    过几秒显示进度条

                var task1 = setTimeout(function () {

                    //第一屏幕慢进

                    $(".real-container li").eq(n).find(".content-font").css("display","block");
                    // $(".real-container li").eq(n).find(".content1-font1").addClass("delay_05s");

                    $(".real-container li").eq(n).find(".content1-font1").addClass("fadeIn");

                    var task2= setTimeout(function () {
                        $(".real-container li").eq(n).find(".content1-font2").addClass("fadeIn");
                        // $(".real-container li").eq(n).find(".content1-font2").addClass("delay_2s");

                        var task3 = setTimeout(function () {
                            var top_progress_bar = (that.window_width-(that.window_width*1100/1206))/2;

                            $(".real-container li").eq(n).find(".progress-bar").css("top",top_progress_bar+"px")
                            $(".real-container li").eq(n).find(".progress-bar").css("display","block");
                            $(".real-container li").eq(n).find(".progress-bar .logo-img").css("top","10px");

                            $(".real-container li").eq(n).find(".scene-1-container").css("display","block");


                            $(".real-container li").eq(n).find(".content1-font1").removeClass("fadeIn");
                            $(".real-container li").eq(n).find(".content1-font2").removeClass("fadeIn");
                            $(".real-container li").eq(n).find(".content1-font1").css("opacity",1);
                            $(".real-container li").eq(n).find(".content1-font2").css("opacity",1);
                            $(".real-container li").eq(n).find(".progress-bar .logo-img").addClass("fadeInAlways");




                            that.move_event(n);
                            clearTimeout(task1)
                            clearTimeout(task2)
                            clearTimeout(task3)
                        }  ,2000)


                    },1000)
                },500)

            //    调用进度条方法
            });
        },
        move_event:function (n) {
                var that = this;
            var startY ,begin_top;
            $(".real-container li ").eq(n).find(".progress-bar .logo-img").bind(that.click_type,start);

            $(".real-container li").eq(n).find(" .progress-bar .logo-img").bind(that.move_type,move);

            $(".real-container li .progress-bar .logo-img").eq(n).bind(that.end_type,end);
            
            
            function start(e) {
                $(this).removeClass("fadeInAlways");
                startY = e.pageX-this.offsetTop;
                that.mouse_down = true;
            }
            function move(e) {
               if(that.mouse_down){
                   var e= e||event;

                   e.preventDefault();
                   if(e && e.stopPropagation) {
                       //因此它支持W3C的stopPropagation()方法
                       e.stopPropagation();
                   } else {
                       //否则，我们需要使用IE的方式来取消事件冒泡
                       window.event.cancelBubble = true;
                   }


                   var   moveY = e.pageX;

                   var   toY = parseInt(moveY - startY);

                   if(toY>10&&toY<that.progress_bar_height){
                       $(this).css("top",toY+"px");


                       var max_width =  that.maxNum($(".real-container li").eq(n).find(".scene-1 .scene1-left").width(),$(".real-container li").eq(n).find(".scene-1 .scene1-right").width());
                       var end_move_img = parseInt((toY - 10)/that.progress_bar_height*max_width);

                       var end_scene1_font =1-((toY - 10)/that.progress_bar_height);
                       end_scene1_font = end_scene1_font.toFixed(8);

                       $(".real-container li").eq(n).find(".scene-1 .scene1-left").css("left",-end_move_img+"px");
                       $(".real-container li").eq(n).find(".scene-1 .scene1-right").css("right",-end_move_img+"px");

                       $(".real-container li").eq(n).find(".content-font").css("opacity",end_scene1_font);
                   }
                   else if(toY<=10){

                       $(".real-container li").eq(n).find(".scene-1 .scene1-left").css("left",0+"px");
                       $(".real-container li").eq(n).find(".scene-1 .scene1-right").css("right",0+"px");

                       $(".real-container li").eq(n).find(" .content-font").css("opacity",1);
                   }
                   else if(toY>=that.progress_bar_height){
                       var move = that.window_height/2;


                       $(".real-container li").eq(n).find(".content2-font1").addClass("delay_05s");
                       $(".real-container li").eq(n).find(".content2-font2").addClass("delay_2s");

                       $(".real-container li").eq(n).find(".content2-font1").addClass("fadeIn");
                       $(".real-container li").eq(n).find(".content2-font2").addClass("fadeIn");

                       //第二屏幕慢进

                       $(".real-container li").eq(n).find(".scene-1 .scene1-left").css("left",-move+"px");
                       $(".real-container li").eq(n).find(".scene-1 .scene1-right").css("right",-move+"px");

                       $(".real-container li").eq(n).find(".content-font").css("opacity",0);
                       $(".real-container li").eq(n).find(".content-font").css("display","none");
                       $(".real-container li").eq(n).find(".scene-1").css("display","none");
                       $(".real-container li").eq(n).find(".scene-1-container").css("display","none");
                       $(".real-container li").eq(n).find(".progress-bar").css("display","none");
                       $(".real-container li").eq(n).find(".scene-2-container").css("display","block");

                       that.mouse_down = false;


                       $(".real-container li").eq(n).find(".back_p2_btn").addClass("fadeIn5sclass");
                       $(".real-container li").eq(n).find(".share_btn").addClass("fadeIn5sclass");

                       that.back_p2(n);

                   }

                }
            }
            function end(e) {
                $(this).addClass("fadeInAlways");
                that.mouse_down = false;
            }
        },
        back_p2:function (n) {
            var that = this;
            $(".real-container li .scene-2-container .back_p2_btn").eq(n).bind(that.click_type,function (e) {
                $(".p2-begin").css("display","block");
                $(".real-container li").eq(n).find(".scene-1 ").css("display","block");
                $(".real-container li").eq(n).find(".scene-2-container").css("display","none");
                $(".real-container li").eq(n).find(".scene-1 .scene1-left").css("left","0px");
                $(".real-container li").eq(n).find(".scene-1 .scene1-right").css("right","0px");
                $(".real-container").css("display","none");
                $(".real-container li").eq(n).css("display","none");


                $(".real-container li").eq(n).find(".content2-font1").removeClass("delay_05s");
                $(".real-container li").eq(n).find(".content2-font2").removeClass("delay_2s");

                $(".real-container li").eq(n).find(".content2-font1").removeClass("fadeIn");
                $(".real-container li").eq(n).find(".content2-font2").removeClass("fadeIn");

                $(".real-container li").eq(n).find(".back_p2_btn").removeClass("fadeIn5sclass");
                $(".real-container li").eq(n).find(".share_btn").removeClass("fadeIn5sclass");

            });


               $(".real-container li .scene-2-container .share_btn").eq(n).bind(that.click_type,function (e) {


             $(".share-mask").css("display","block");



            });
            $(".share-mask").bind(that.click_type,function () {
                $(".share-mask").css("display","none");
            });


        }
    }
    HerosLover.prototype.constructor = HerosLover;

    function HerosLover() {

        this.mouse_down = false;
        this.begin_layout();
        this.begin_event();
        this.each_hero_scene();


    }
    var heros  = new HerosLover();

})(jQuery)