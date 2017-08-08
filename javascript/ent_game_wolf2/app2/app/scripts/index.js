/**
 * Created by wanghan1 on 2017/8/4.
 */


(function ($) {

    WolfFight.prototype = {

        beginTime:function (count_time) {

            var task_begin = setInterval(function () {
                if($("."+count_time).html()<=0){


                    //结束
                    clearInterval(task_begin)
                }else {
                    $("."+count_time).html($("."+count_time).html()-1)

                }
            },1000)
        },
        initWolf:function (zidans) {
            var that = this;



            that.gunForzidan(zidans[0],"l-1","0ms","left");
            that.gunForzidan(zidans[1],"l-2","500ms","left");
            that.gunForzidan(zidans[2],"l-3","1000ms","left");
            that.gunForzidan(zidans[3],"l-4","1500ms","left");

            that.gunForzidan(zidans[4],"r-1","200ms","right");
            that.gunForzidan(zidans[5],"r-2","700ms","right");
            that.gunForzidan(zidans[6],"r-3","1200ms","right");
            that.gunForzidan(zidans[7],"r-4","1700ms","right");

        },
        gunForzidan:function (zidans,n_zidan,trans_delay,move_dis) {



            // var deriction_move = move_dis|| "left";



            var that  = this;
            // debugger;
            that.creatZidan(zidans,n_zidan,trans_delay,move_dis);

            var task_creat_zidan = setInterval(function () {


                if(that.game_over){
                    clearInterval(task_creat_zidan);
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
               $(each_zidan).append("<img src='../app/images/zidan-left.png' alt=''>");
               each_zidan.className = "zidan zidan"+n_zidan;

                $("."+zidans).append(each_zidan);



          var last_zidan_q =   $(".zidan"+n_zidan).eq($(".zidan"+n_zidan).length-1);
          var  hard_trans = "all linear "+that.hard_level+"s";



            last_zidan_q.css("-webkit-transition",hard_trans);
            last_zidan_q.css("transition",hard_trans);
            last_zidan_q.css("-webkit-transition-delay",trans_delay);
            last_zidan_q.css("transition-delay",trans_delay);

            if(move_dis=="left"){
                last_zidan_q.css("left",window.innerWidth);
            }else {
                last_zidan_q.css("left",-window.innerWidth);
            }







            last_zidan_q.bind("transitionend",function () {
                $(this).remove();
            })
        },
        initLeadEvent:function () {
            var that = this;
            var startX ,startY;

            $(".lead_wu").bind("touchstart",function (e) {
                

                  startX = e.originalEvent.targetTouches[0].pageX-this.offsetLeft;
                  startY = e.originalEvent.targetTouches[0].pageX-this.offsetTop;
              

            });

            $(".lead_wu").bind("touchmove",function (e) {

               var   moveX = e.originalEvent.targetTouches[0].pageX;
               var   moveY = e.originalEvent.targetTouches[0].pageY;

                var    toX = moveX-startX;
                 var   toY = moveY - startY;


            $(this).css("left",toX+"px");
            $(this).css("top",toY+"px");

                // console.log($(".zidan")[0].pageX)

            });            

            // $("body").click(function (e) {

            //         var x = e.pageX;
            //         var y = e.pageY;

            //         console.log(x)
            //         console.log(y)
                   
            //         console.log(that.getAllZidanData());

            // });
        },
        getAllOffsets:function(click_obj){
           

                  var top = 0;
                  var left = 0;
                 

                // for(var i=0;i<parrents.length;i++){
                //     top += $(parrents[i]).offset().top;
                //     left += $(parrents[i]).offset().left;

                // }
                var obj = {};
                top += $(click_obj).offset().top;
                left += $(click_obj).offset().left;
                obj.top = top;
                obj.left = left;
               
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
                            // console.log(that.getAllOffsets($("."+zidans[i]).find(".zidan")[j]))
                        }

                    }
             

            }
            return array;
        }
    }
    WolfFight.prototype.constructor = WolfFight;




    function WolfFight(count_time,zidans) {
        this.zidan_frequency = 1000;
        this.game_over = false;
        this.hard_level = 5;
        this.beginTime(count_time);
        this.initWolf(zidans);
        this.initLeadEvent();

    }
    var zidans = [
        "zidans-1",
        "zidans-2",
        "zidans-3",
        "zidans-4",
        "zidans-5",
        "zidans-6",
        "zidans-7",
        "zidans-8"
    ]

    var mywolf = new WolfFight("count_time",zidans)
})(jQuery)