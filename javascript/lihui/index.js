/**
 * Created by wanghan1 on 2017/7/25.
 */

(function ($) {


    var man_wrong_data=[
        "http://p1.ifengimg.com/a/2017/0726/g1.png",
        "http://p1.ifengimg.com/a/2017/0726/g2-2.png",
        "http://p1.ifengimg.com/a/2017/0726/g3-4.png",
        "http://p1.ifengimg.com/a/2017/0726/g4-2.png",
        "http://p1.ifengimg.com/a/2017/0726/g5-2.png"
    ]

    var women_wrong_data=[
        "http://p1.ifengimg.com/a/2017/0726/f1.png",
        "http://p1.ifengimg.com/a/2017/0726/f2.png",
        "http://p1.ifengimg.com/a/2017/0726/f3.png",
        "http://p3.ifengimg.com/a/2017/0726/f4-3.png",
        "http://p3.ifengimg.com/a/2017/0726/f5-3.png"
    ]


    HoldOther.prototype = {
        initContainerWidth:function () {
            var that = this;
            var real_width ,real_height;
            var current_proportion = window.innerWidth/window.innerHeight;
            if(IsPC()==true){
                $(".section1").css("backgroundSize","cover");
                $(".section2").css("backgroundSize","cover");
                $(".section3").css("backgroundSize","cover");
                if(current_proportion-that.normal_proportion>0){
                    $(".section-container").height("100%");

                    real_width = window.innerHeight*that.normal_proportion;
                    $(".section-container").width(real_width);

                }else {

                    $(".section-container").width("100%");

                    real_height = window.innerWidth/that.normal_proportion;

                    $(".section-container").height(real_height);
                    $(".section-container").css("top",(window.innerHeight-real_height)/2+"px");
                }



            }else {
                $(".section-container").width("100%");

                $(".section-container").height("100%");
            }

        },
        initBeginTime:function () {
            var that = this;
            var task = setInterval(function () {

               if( $(".time").html()>0){
                   $(".time").html($(".time").html()-1);
               }else {

                   clearInterval(task);

                   $(".section2").css("display","none");
                   $(".section3").css("display","block");

                   $("#count_total").html(that.count);
                   $("#hold_type").html(that.type_hold);



                  share(that.count,that.type_hold,that.right_img_url);

                   $(".share_container").unbind().bind(that.click_event,function () {

                       if($(".mask").css("display")=="block"){

                           $(".mask").css("display","none");
                           $("#count_total").css("opacity","1");
                           $("#hold_type").css("opacity","1");
                       }else {
                           $(".mask").css("display","block");
                           $("#count_total").css("opacity","0.6");
                           $("#hold_type").css("opacity","0.6");
                       }



                   });
                   $(".mask").unbind().bind(that.click_event,function () {

                       $(".mask").css("display","none");
                       $("#count_total").css("opacity","1");
                       $("#hold_type").css("opacity","1");

                   });

                $(".refresh_end").unbind().bind(that.click_event,function () {


                    if($(".mask").css("display")=="block"){

                        $(".mask").css("display","none");
                        $("#count_total").css("opacity","1");
                        $("#hold_type").css("opacity","1");
                    }else {

                        $(".section1").css("display","block");
                        $(".section2").css("display","none");
                        $(".section3").css("display","none");
                        that.count = 0;
                        $(".time").html(60)
                        that.initMyfirst();
                    }
                });

               }
            },1000)
        },
        initMyfirst:function () {

            var that = this;
            var click_event ;
            that.wrong_img_url= "";
            that.right_img_url = "";
            that.type_hold = "";





            $(".img-container").css("top", (parseInt($(".section-container").css("width"))*450/750)+"px");
            //计算出中间尺寸

            if(IsPC()==true){

                that.click_event = "click";
            }else{
                that.click_event = "touchstart";
            }
            $(".btns-man").unbind().bind(that.click_event,function () {
                that.sureManWomen(0);

                that.initBeginTime();
            });

            $(".btns-women").unbind().bind(that.click_event,function () {
                that.sureManWomen(1);
                that.initBeginTime();
            });
        },
        sureManWomen:function (choice) {
            var that = this;
            //    决定是渣男还是小三
            if(choice==0){
                that.type_hold = "渣男";
                that.wrong_img_url= man_wrong_data;
                that.right_img_url = "http://p3.ifengimg.com/a/2017/0726/g0-2.png";


            }else {
                that.type_hold = "小三";
                that.wrong_img_url= women_wrong_data;
                that.right_img_url = "http://p1.ifengimg.com/a/2017/0726/f0.png";

            }

            $(".section1").css("display","none");
            $(".section2").css("display","block");

            that.initEventDom();
        },
        initEventDom:function () {
                var that =this;

                if(that.count<that.checkpoint.length){

                        var li_length = that.checkpoint[that.count];

                        var str_li = "";

                        for(var i=0;i<li_length;i++){

                            str_li += "<li><img src='"+that.randomImg(that.wrong_img_url)+"' /></li>"
                        }

                  $(".img-container").html(str_li);
                    that.liLayout();

                }else {

                    var li_length = that.checkpoint[that.checkpoint.length-1];

                    var str_li = "";

                    for(var i=0;i<li_length;i++){

                        str_li += "<li><img src='"+that.randomImg(that.wrong_img_url)+"' /></li>"
                    }

                    $(".img-container").html(str_li);


                    that.liLayout(true);
                }
                that.randomBgColor();


                that.count++;

        },
        randomImg:function (array_img) {
                var that = this;


                return   array_img[Math.floor(array_img.length*Math.random())];
        },
        liLayout:function (end) {




            var that = this;
            var row_length;

            if(end==true){
                row_length = Math.sqrt(that.checkpoint[that.checkpoint.length-1]);
            }else {
                row_length = Math.sqrt(that.checkpoint[that.count]);
            }


            var li_width = Math.floor(Math.floor($(".img-container").width()-1)/row_length);





            $(".img-container li").width(li_width);
            $(".img-container li").height(li_width);



            if(that.count<that.checkpoint.length){
                that.randomRight();
            }else {
                that.randomRight(true);
            }

        },
        randomRight:function (end) {
            var that = this;
            var random_num;
            if(end==true){
                random_num = Math.ceil(Math.random()*that.checkpoint[that.checkpoint.length-1]);
            }else {
                random_num =Math.ceil(Math.random()*that.checkpoint[that.count]);
            }


            $($(".img-container li")[random_num-1]).addClass("right_li");
            $($(".img-container li")[random_num-1]).find("img").attr("src",that.right_img_url);

            that.bindNewEvent();

        },
        randomBgColor:function () {
        //        处理背景色
            var rgb_c = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"

            // $($(".img-container")[0]).css("backgroundColor",rgb_c);

            document.getElementById("img-container").style.backgroundColor = rgb_c;

        },
        bindNewEvent:function () {

            var that = this;
                $(".img-container li.right_li").unbind().bind(that.click_event,function () {
                    that.initEventDom();
                });
        }
        
    }
    HoldOther.prototype.constructor = HoldOther;


    function HoldOther() {
        this.count = 0;
        this.checkpoint = [4,9,16,25,25,36,36,49,49,49,64,64,64,81];
        this.normal_proportion = 750/1334;
        this.width = window.innerWidth;

        this.initContainerWidth();
        this.initMyfirst();
    }

    var hold = new HoldOther();



    function share(data_count,data_type,img_url) {
        var count_end = data_count||"n";
        var hold_type = data_type|| "小三/渣男";
        var real_content = "我在《我的前半生》里抓小三好过瘾，你也来玩吧~ ";
        if(data_count&&hold_type){
            real_content ='我在《我的前半生》里抓了'+count_end+'次'+hold_type+'，你也来试试吧！'
        }
        var url = window.location.href;
        var real_img_url = img_url||"http://p1.ifengimg.com/a/2017/0727/548d2bd56e43a95size49_w300_h300.jpg";
        var link = "http://creative.ifeng.com/WxInterface";
        var data = {
            'url':url,
        }
        $.getJSON(link+"/WxInterface.php?callback=?",data,function(data){
            var sign = eval(data);
            wx.config({
                debug: false,
                appId: sign.appId,
                timestamp:sign.timestamp,
                nonceStr: sign.nonceStr,
                signature: sign.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo'
                ]
            });
        });
        wx.ready(function  () {
            // 分享给朋友圈
            wx.onMenuShareTimeline({
                title: real_content, // 分享标题
                link: '', // 分享链接
                imgUrl: real_img_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            // 朋友
            wx.onMenuShareAppMessage({
                title: real_content, // 分享标题
                desc: '火眼金睛“识小三”、“辨渣男”', // 分享描述
                link: '', // 分享链接
                imgUrl: real_img_url, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            // QQ
            wx.onMenuShareQQ({
                title: real_content, // 分享标题
                desc: '火眼金睛“识小三”、“辨渣男”',// 分享描述
                link: '', // 分享链接
                imgUrl: real_img_url,// 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            // 新浪
            wx.onMenuShareWeibo({
                title: real_content, // 分享标题
                desc: '火眼金睛“识小三”、“辨渣男”', // 分享描述
                link: '', // 分享链接
                imgUrl: real_img_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        })
    }

    share();
})(jQuery)