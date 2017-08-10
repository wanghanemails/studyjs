/**
 * Created by wanghan1 on 2017/8/4.
 */


(function ($) {

    WolfFight.prototype = {
        initFirst:function (count_time,zidans,heads) {
            var that = this;
            this.zidan_frequency = 3000;
            this.dom_over = false;
            this.game_over = false;
            this.can_help = true;
            this.with_people = false;
            this.hard_level = 3000;
            this.obj_current = {};
            this.count = 0;
            this.dead_count = 0;
            this.is_deading = false;
            this.touch_end = true;
            this.randomNum = randomNum();


            $(".section1-btn").bind("touchstart",function () {

                $(".section-mask").css("display","block");
            });
            $(".section-mask").bind("touchstart",function () {

                $(".section-1").css("display","none");
                $(".section-2").css("display","block");
                that.begin_function(count_time,zidans,heads);
            });

        },
        total_time:function (count_time,zidans,heads) {
            //全局 时间监听。
            var that = this;
            that.total_task = setInterval(function () {


                that.obj_current.left = parseInt($(".lead_wu")[0].offsetLeft);
                that.obj_current.top = parseInt($(".lead_wu")[0].offsetTop);
                that.obj_current.right = that.obj_current.left + $(".lead_wu")[0].offsetWidth;
                that.obj_current.bottom = that.obj_current.top + $(".lead_wu").height();
                that.obj_current.obj_dom = $(".lead_wu")[0];


                //实时子弹碰撞检测
                that.judgeCollision(that.obj_current);

                //实时是否可解救人质检测。
                that.helpPeople(that.obj_current);



               //    救了一个人质
                that.addCount(that.obj_current,count_time,zidans,heads);

            },50);
        },
        helpPeople:function(obj1){
            var that = this;
            if(that.dom_over){
                    var people_area = $(".success-area")[0];

                    var obj_people_area = {};
                $(".hide_people").removeClass("move_hide_people");
                obj_people_area.left = parseInt(people_area.offsetLeft);
                obj_people_area.top = parseInt(people_area.offsetTop);
                obj_people_area.right = obj_people_area.left + people_area.offsetWidth;
                obj_people_area.bottom = obj_people_area.top + people_area.offsetHeight;
                obj_people_area.obj_dom = people_area;



                if((that.collision(obj1,obj_people_area,1)).area_succe==true&& that.can_help ==true &&that.with_people == false && $(".hide_people:has(li)").length==0&&that.is_deading==false){


                   var first_clone =  $(".heads .head:first").clone();

                   if($(".hide_people .head").length==0){
                       $(".hide_people").append(first_clone);
                       $(".hide_people").addClass("move_hide_people");
                   }


                    $(".heads .head:first").remove();

                    $(".heads .head:first").addClass("moveHead");


                    $(".hide_people").offset({left:obj1.left,top:(obj1.top-20)});


                    that.can_help = false;
                    that.with_people = true;

                    var current_task = setTimeout(function () {



                            if($(".heads .head").length>=6){
                                $(".heads .head").length=6;
                            }else {
                                $(".heads").append("<div class='head'><img src='"+that.randomImg()+"' alt=''></div>");
                            }

                        clearTimeout(current_task);
                    },1000)

                }else  if(that.can_help ==false &&that.with_people == true&&(that.collision(obj1,obj_people_area,3)).area_end==false){

                    $(".hide_people").removeClass("move_hide_people");

                    $(".hide_people").offset({left:obj1.left,top:(obj1.top-20)});


                }



            }
        },
        addCount:function (obj1,count_time,zidans,heads) {
            var that = this;

            if(that.dom_over){
                var people_area = $(".end_area")[0];

                var obj_people_area = {};

                obj_people_area.left = parseInt(people_area.offsetLeft);
                obj_people_area.top = parseInt(people_area.offsetTop);
                obj_people_area.right = obj_people_area.left + people_area.offsetWidth;
                obj_people_area.bottom = obj_people_area.top + people_area.offsetHeight;
                obj_people_area.obj_dom = people_area;

                if((that.collision(obj1,obj_people_area,3)).area_end==true&&that.can_help ==false &&that.with_people == true){

                        that.count += 1;




                    $(".hide_people").html("");
                    $(".hide_people").css("top",init_attribute.hide_people.top+"");
                    $(".hide_people").css("left","");
                    $(".hide_people").css("bottom","");
                    $(".hide_people").css("right",init_attribute.hide_people.right+"");

                    $(".real_count").html(""+that.count);
                    that.can_help = true;

                    that.with_people = false;


                    that.addHard(count_time,zidans,heads);
                    //  增加难度



                }



            }
        },
        beginTime:function (count_time) {
            var that = this;
            that.task_begin = setInterval(function () {
                if($("."+count_time).html()<=0){


                    //倒计时结束

                    $(".section-3").css("display","block");
                    $(".randomeNum").html(that.randomNum);
                    $(".section-2").css("display","none");



                    $(".end_help_count").html(""+that.count);

                    share(that.count,that.randomNum);

                    $(".section3-btn").bind("touchstart",function () {



                        $(".section3-mask").css("display","block");
                    });
                    $(".section3-mask").bind("touchstart",function () {

                        $(".section3-mask").css("display","none");
                    });








                    that.clearMyIntervalAll();


                }else {
                    $("."+count_time).html($("."+count_time).html()-1)

                }
            },1000)
        },
        clearMyIntervalAll:function () {
            var that = this;

            clearInterval(that.task_begin)
            clearInterval(that.total_task)
            clearInterval(that.task_creat_zidan)
        },
        initWolf:function (zidans) {
            var that = this;






            that.gunForzidan(zidans[0],"l-1","0ms","left");
            that.gunForzidan(zidans[1],"l-2","400ms","left");
            that.gunForzidan(zidans[2],"l-3","800ms","left");


            that.gunForzidan(zidans[3],"r-1","800ms","right");
            that.gunForzidan(zidans[4],"r-2","400ms","right");
            that.gunForzidan(zidans[5],"r-3","200ms","right");


        },
        initHeadsDom:function (heads) {
            var that = this;

            var head_dom_str = "";

            for(var i=0;i<6;i++){

                if(i==0){
                    head_dom_str+= "<div class='head moveHead'><img src='"+that.randomImg()+"' alt=''></div>"
                }else {
                    head_dom_str+= "<div class='head'><img src='"+that.randomImg()+"' alt=''></div>"
                }

            }




            $("."+heads).html(head_dom_str);


        },
        randomImg:function () {
            var that = this;

            return imgs_data[Math.floor(Math.random()*12)];
        },
        gunForzidan:function (zidans,n_zidan,trans_delay,move_dis) {



            // var deriction_move = move_dis|| "left";



            var that  = this;

            that.creatZidan(zidans,n_zidan,trans_delay,move_dis);

            that.task_creat_zidan = setInterval(function () {


                if(that.game_over){
                    clearInterval(that.task_creat_zidan);
                    //...
                }else {
                    that.creatZidan(zidans,n_zidan,trans_delay,move_dis);
                }
            },that.zidan_frequency)
        },
        creatZidan:function (zidans,n_zidan,trans_delay,move_dis) {
            var that = this;

            var move_dis = move_dis|| "left";

            var trans_delay = trans_delay||"0ms";


            // var each_zidan = "<div class='zidan'"+n_zidan+"></div>";

            var each_zidan = document.createElement("div");
            if(move_dis=="left"){
                //特殊子弹
                var randomTeNum = Math.floor(Math.random()*100);

                if(randomTeNum>90){

                    $(each_zidan).append("<img class='teshu' src='http://p1.ifengimg.com/71f9287bab6b3ce4/2017/32/{99B6F04D-0ED8-4588-9601-4BB3D85BA7F2}.png' alt=''>");
                }else {
                    $(each_zidan).append("<img src='http://p0.ifengimg.com/fe/ent_game_wolf2/images/zidan-left_4be11b32.png' alt=''>");
                }


            }else {


                if(randomTeNum>90){
                    $(each_zidan).append("<img class='teshu' src='http://p1.ifengimg.com/71f9287bab6b3ce4/2017/32/{940B3A34-C54E-4F51-A330-16A1130D88D9}.png' alt=''>");
                }else {
                    $(each_zidan).append("<img src='http://p0.ifengimg.com/fe/ent_game_wolf2/images/zidan-right_4f352fd5.png' alt=''>");
                }



            }

               each_zidan.className = "zidan zidan"+n_zidan;

                $("."+zidans).append(each_zidan);



          var last_zidan_q =   $(".zidan"+n_zidan).eq($(".zidan"+n_zidan).length-1);
          var  hard_trans = "all linear "+that.hard_level+"ms";



            last_zidan_q.css("-webkit-transition",hard_trans);
            last_zidan_q.css("transition",hard_trans);
            last_zidan_q.css("-webkit-transition-delay",trans_delay);
            last_zidan_q.css("transition-delay",trans_delay);


            var current_task3= setTimeout(function () {

                if(move_dis=="left"){
                    last_zidan_q.css("left",window.innerWidth);
                }else {
                    last_zidan_q.css("left",-window.innerWidth);
                }
                clearTimeout(current_task3)
            },50);

            last_zidan_q.bind("transitionend",function () {
                $(this).remove();
            })
        },
        initLeadEvent:function () {
            var that = this;
            var startX ,startY,begin_left,begin_top;

            $(".lead_wu").bind("touchstart",function (e) {
                that.touch_end = false;

                  startX = e.originalEvent.targetTouches[0].pageX-this.offsetLeft;
                  startY = e.originalEvent.targetTouches[0].pageY-this.offsetTop;


            });

            $(".lead_wu").bind("touchmove",function (e) {

                var e= e||event;

                e.preventDefault();
                if(e && e.stopPropagation) {
                    //因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                } else {
                    //否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }

                var   moveX = e.originalEvent.targetTouches[0].pageX;
               var   moveY = e.originalEvent.targetTouches[0].pageY;
                var    toX = moveX-startX;
                 var   toY = moveY - startY;

            $(this).css("left",toX+"px");
            $(this).css("top",toY+"px");

                // console.log($(".zidan")[0].pageX)

                that.obj_current.left = parseInt(toX);
                that.obj_current.top = parseInt(toY);
                that.obj_current.right = that.obj_current.left + this.offsetWidth;
                that.obj_current.bottom = that.obj_current.top + this.offsetHeight;
                that.obj_current.obj_dom = $(".lead_wu")[0];

             if(that.is_deading == false){

                 that.judgeCollision(that.obj_current);
             }
            });

            $(".container").bind("touchmove",function (e) {
                var e= e||event;
                e.preventDefault();
                if(e && e.stopPropagation) {
                    //因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                } else {
                    //否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }

            });


            that.dom_over =true;

        },

        getAllOffsets:function(click_obj){

                  var top = 0;
                  var left = 0;
                  var right = 0;
                  var bottom = 0;

                // for(var i=0;i<parrents.length;i++){
                //     top += $(parrents[i]).offset().top;
                //     left += $(parrents[i]).offset().left;

                // }
                var obj = {};
                top += $(click_obj).offset().top;
                left += $(click_obj).offset().left;

                right +=left+ $(click_obj).innerWidth();
                bottom += top+$(click_obj).innerHeight();

                obj.top = parseInt(top);
                obj.left = parseInt(left);
                obj.right = parseInt(right);
                obj.bottom = parseInt(bottom);

                obj.obj_dom =  click_obj;


               
               return obj;


        },
        getAllZidanData:function(){
            var that =this;
            var array = [];

            
               
            for(var i=0;i<zidans.length;i++){
                
               

                    var my_length = $("."+zidans[i]).find(".zidan").length;
                 
               
                    if(my_length>0){
                       
                        for(var j=0;j<$("."+zidans[i]).find(".zidan").length;j++){

                            array.push(that.getAllOffsets($("."+zidans[i]).find(".zidan")[j]));

                        }

                    }
             

            }
            return array;
        },
        judgeCollision:function (obj_current) {
                var that = this;
                var zidans_array = that.getAllZidanData();




                for(var i=0;i<zidans_array.length;i++){



                       if((that.collision(obj_current,zidans_array[i],2).area_zidan) ==  true){

                           that.deadFunction();
                       //    中弹
                       };
                //    面积碰撞
                }
        },
         deadFunction:function () {

            $(".hide_people").html("");

             $(".hide_people").css("top",init_attribute.hide_people.top+"");
             $(".hide_people").css("left","");
             $(".hide_people").css("bottom","");
             $(".hide_people").css("right",init_attribute.hide_people.right+"");

            var that = this;

            that.is_deading = true;
                $(".lead_wu").width("75px");
                $(".lead_wu").width("77px");

                $(".lead_wu img").attr("src","http://p0.ifengimg.com/fe/ent_game_wolf2/images/dead_47006c2a.png");


             that.dead_count+=1;
             that.can_help = true;
             that.with_people = false;

             that.is_deading = false;



            // $(".lead_wu").bind("touchend",(function (e) {that.touch_end = true;})());
                var current_task =  setTimeout(function () {
                    $(".lead_wu").css("top","");
                    $(".lead_wu").width(init_attribute.lead_wu.width);
                    $(".lead_wu").height(init_attribute.lead_wu.height);

                    $(".lead_wu img").attr("src","http://p0.ifengimg.com/fe/ent_game_wolf2/images/wujing_0dd74b2d.png");

                    $(".lead_wu").css("left",init_attribute.lead_wu.left);

                    $(".lead_wu").css("bottom",init_attribute.lead_wu.bottom);

                    $(".lead_wu").addClass("fadeOutIn");





                    var current_task2 = setTimeout(function () {
                        $(".lead_wu").removeClass("fadeOutIn");

                        clearTimeout(current_task);
                        clearTimeout(current_task2);
                    },2000)
                },1000)

        },
        collision:function (obj1, obj2,swich_num) {


            var obj_collision = {};
            obj_collision.area_succe = false;
            obj_collision.area_zidan = false;
            obj_collision.area_end = false;


            var left1 = obj1.left;

            var right1 = obj1.right;

            var top1 = obj1.top;

            var bottom1 = obj1.bottom;

            var left2 = obj2.left;

            var right2 = obj2.right;

            var top2 = obj2.top;

            var bottom2 = obj2.bottom;


            if (right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2) {




                switch (swich_num){
                    case 1:
                        obj_collision.area_succe = true;
                        break;
                    case 2:
                        obj_collision.area_zidan = true;
                        break;
                    case 3:
                        obj_collision.area_end = true;
                        break;
                }


            } else{


                switch (swich_num){
                    case 1:
                        obj_collision.area_succe = false;
                        break;
                    case 2:
                        obj_collision.area_zidan = false;
                        break;
                    case 3:
                        obj_collision.area_end = false;
                        break;
                }
            }


            return obj_collision;
        },
        addHard:function (count_time,zidans,heads) {
                var that = this;




                if(that.count==3){
                    that.hard_level =3000;
                    that.zidan_frequency = 3000;
                    that.clearMyIntervalAll();
                    that.begin_function(count_time,zidans,heads)
                }else if(that.count==10){
                    that.hard_level -= 500;
                    that.zidan_frequency = 2500;
                }else if(that.count==15){
                    that.hard_level -= 500;
                    that.zidan_frequency = 2000;
                    that.clearMyIntervalAll();
                    that.begin_function(count_time,zidans,heads)
                }else if(that.count==20){
                    that.hard_level -=  500;
                    that.zidan_frequency = 2000;


                }else if(that.count==25){
                    that.hard_level = 1000;
                    that.zidan_frequency = 2000;
                    that.clearMyIntervalAll();
                    that.begin_function(count_time,zidans,heads)
                }else if(that.count>30){
                    that.hard_level = 500;
                    that.zidan_frequency = 1000;

                }
        },
        randomSpecialZidan:function () {
            var that = this;
        },
        begin_function :function (count_time,zidans,heads) {
            var that = this;
            this.beginTime(count_time);
            this.initHeadsDom(heads)
            this.initWolf(zidans);
            this.total_time(count_time,zidans,heads);
            this.initLeadEvent();
        }
    }
    WolfFight.prototype.constructor = WolfFight;




    function WolfFight(count_time,zidans,heads) {

        this.initFirst(count_time,zidans,heads);
        // this.begin_function(count_time,zidans,heads);



    }
    var zidans = [
        "zidans-1",
        "zidans-2",
        "zidans-3",
        "zidans-4",
        "zidans-5",
        "zidans-6"

    ]
    var imgs_data = [
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-1_d78f1e40.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-2_1f9fe4b0.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-3_f48785a9.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-4_74c86e98.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-5_6f9ce431.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-6_36bb01be.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-7_b3be8358.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-8_07497e12.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-9_8a1c7a2e.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-10_0d0cccd9.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-11_a0e157c6.png",
        "http://p0.ifengimg.com/fe/ent_game_wolf2/images/head-12_f1ba6fb7.png"

    ]
    var init_attribute = {
        lead_wu:{
            left:"120px",
            width:"49px",
            bottom:"8%",
            height:"70px"
        },
        hide_people:{
            top: "8%",
            right: "6%"
        }
    }

    var mywolf = new WolfFight("count_time",zidans,"heads");











function randomNum() {


    var num = Math.floor(Math.random()*10000);

    var num_str = "";


    switch (num.toString().length){
        case 1 :

                if(num==0){
                    num_str = "00001";
                }else {
                    num_str = "0000"+num;
                }

            break;

        case 2 :

            num_str = "000"+num;


            break;
        case 3 :

            num_str = "00"+num;


            break;
        case 4 :

            num_str = "0"+num;


            break;
        case 5 :

            num_str = "10000";

            break;
    }

    return num_str;

}






    function share(data_count,randomeNum,img_url) {
        var count_end = data_count||"n";

        var randomeNum = randomeNum||randomNum();

           var  real_content ='我是战狼'+randomeNum+'号,在非洲撤侨行动中成功解救'+count_end+'人!';

        var url = window.location.href;
        var real_img_url = img_url||"http://p0.ifengimg.com/fe/ent_game_wolf2/images/pic_share_2b5d916d.jpg";
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


            var myvedio = document.getElementById("myaudio");

            myvedio.setAttribute("src","http://p1.ifengimg.com/71f9287bab6b3ce4/2017/32/zhanlang2-bg.mp3");

            myvedio.play();

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
                desc: '加入《战狼2》，一起营救海外侨民', // 分享描述
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
                desc: '加入《战狼2》，一起营救海外侨民',// 分享描述
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
                desc: '加入《战狼2》，一起营救海外侨民', // 分享描述
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



    function muzicPlay() {
        var myvedio = document.getElementById("myaudio");
        myvedio.setAttribute("src","http://p1.ifengimg.com/71f9287bab6b3ce4/2017/32/zhanlang2-bg.mp3");
        myvedio.play();

        $(".muzic-opening").bind("touchstart",function () {
            $(this).css("display","none");
            $(".muzic-stoping").css("display","block");
            myvedio.pause();

        });
        $(".muzic-stoping").bind("touchstart",function () {
            $(this).css("display","none");
            $(".muzic-opening").css("display","block");
            myvedio.play();
        })
    }
    muzicPlay();
})(jQuery)