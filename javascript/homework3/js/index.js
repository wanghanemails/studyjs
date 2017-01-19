/**
 * Created by wanghan1 on 2017/1/16.
 */

(function(){

    GetTime.prototype = {

        initTime:function(time,id){

            var that = this;
            that.init = true;
            var timesString = time.split(":");
            var daysM = parseInt(timesString[0])*24*60*60;
            var hoursM = parseInt(timesString[1])*60*60;
            var minuteM = parseInt(timesString[2])*60;
            var secondM = parseInt(timesString[3]);
            that.next_arr = new Array();
            that.sumM = daysM+hoursM +minuteM+secondM;



            that.getEndTime();
            //调用每隔一秒减时间函数
            that.timeDown();


        },
        showTime:function(type,timeMM){
            switch (type){
                case "day" : return Math.floor(timeMM/24/60/60);
                case "hour" : return Math.floor(timeMM%(24*60*60)/60/60);
                case "minute" : return Math.floor(timeMM%(24*60*60)%(60*60)/60);
                case "second" : return Math.floor(timeMM%(24*60*60)%(60*60)%60);

            }
        },

        getEndTime:function(){

            //debugger;

            var that =this;
            var end_sum = that.backSpace(that.showTime("day",that.sumM))+""+that.backSpace(that.showTime("hour",that.sumM))+""+that.showTime("minute",that.sumM)+""+that.backSpace(that.showTime("second",that.sumM));


            var arr_num = new Array();

            (function(){
                for(var i=0;i<end_sum.length;i++){
                    arr_num.push(parseInt(end_sum[i]))
                }


                return arr_num;

            })();


            //(function(){
            //    if(that.init){
            //    for(var i=0;i<end_sum.length;i++){
            //        that.prev_arr.push(end_sum[i])
            //    }
            //        that.init=false;
            //    }
            //
            //    return that.prev_arr;
            //
            //})();

            (function(){
                //花出一个由小方块组成的大方块.
                var str = "<ul class='top-container clearfix'>";
                for(var i=0;i<arr_num.length;i++){



                    str += "<li class='each-num'>";
                    str   +=   that.drawCube(arr_num[i])
                    str += "</li>";
                }


                var unit_str = "<li class='day-unit'>天</li><li class='hour-min'>:</li><li class='min-sec'>:</li>"

                str+=unit_str;
                str+= "</ul>"
                document.getElementById(that.id).innerHTML=str





                //return  ;
            })();





            (function(){
                //根据数字显示颜色
                //花出一个由小方块组成的大方块.

                for(var i=0;i<arr_num.length;i++){

                 that.showNumColor(arr_num[i],i);

                }

            })();


            (function(){

                //当前时间覆盖前一秒时间的字符串数组
                var current_time ="";
                for(var i=0;i<arr_num.length;i++){

                    current_time+=arr_num[i];

                }
                var next_str = (parseInt(current_time)-1)+"";

                var next_arr_s = []


                for(var i=0;i<next_str.length;i++){

                    next_arr_s.push(parseInt(next_str[i]));

                }

                that.next_arr = next_arr_s;


                return that.next_arr;
            })();


            (function(){
                //根据数字显示颜色
                //花出一个由小方块组成的大方块.并运动
                //

                var move_arr  = new Array();
                for(var i=0;i<arr_num.length;i++){


                    if(that.next_arr.length==arr_num.length){

                        if(arr_num[i]!=that.next_arr[i]){

                            move_arr.push(i)


                        }

                    }

                }

                //debugger
                that.moveContainer(move_arr)

            })();

        },
        timeDown:function(){
            var that = this;
            var task = setInterval(function(){
                that.sumM =  that.sumM-1;


                if(that.sumM==0){
                    clearInterval(task);
                    return ;
                }

                that.getEndTime();
            },1000)

        },
        drawDiamonds:function(){
            var that = this;
        },
        backSpace:function(num){
            if(num<10){
             return    "0"+num;
            }else{
             return    num;
            }
        },
        drawCube:function(num){
            var that = this;

            var bigCube = "<ul class='each-big-cube'>";

            var oneSmall_cube = "<ul>";

            (function(){

                for(var i=0;i<5;i++){

                    oneSmall_cube+="<li class='each-row'>";
                    for(var j=0;j<3;j++){
                        oneSmall_cube +="<ul class='each-small-cube clearfix' >";
                        oneSmall_cube +="<li class='first' ></li>";
                        oneSmall_cube +="<li class='second' ></li>";
                        oneSmall_cube +="<li class='third' ></li>";
                        oneSmall_cube +="<li class='four' ></li>";
                        oneSmall_cube +="<li class='five' ></li>";
                        oneSmall_cube +="<li class='six' ></li>";
                        oneSmall_cube +="</ul>";
                    }
                    oneSmall_cube+="</li>";
                }

                oneSmall_cube +="</ul>";

            })();




            bigCube+= "<li class='first-screen'>";
            bigCube+=oneSmall_cube;
            bigCube+= "</li>";

            bigCube+= "<li class='second-screen'>";
            bigCube+=oneSmall_cube;
            bigCube+= "</li>";

            bigCube+= "<li class='third-screen'>";
            bigCube+=oneSmall_cube;
            bigCube+= "</li>";
                //每个li是一个小正方体
                bigCube+= "</ul>";
            return bigCube;

        },
        showNumColor:function(num,i){

            var that = this;

            if(i==2||i==4||i==6){
                switch (num){


                    case 1:


                        (function(){




                            for(var j=0;j<5;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }


                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");


                        })();break;


                    case 2:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;

                    case 3:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;



                    case 4:


                        (function (){
                            //

                            //$($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");



                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }


                            for(var j=0;j<5;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                        })();break;
                    case 5:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");





                        })();break;


                    case 0:

                        (function(){

                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");


                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;


                }
            }else {
                switch (num){


                    case 1:


                        (function(){




                            for(var j=0;j<5;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }


                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");


                        })();break;


                    case 2:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;

                    case 3:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;



                    case 4:


                        (function (){
                            //

                            //$($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");



                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }


                            for(var j=0;j<5;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                        })();break;
                    case 5:

                        (function(){


                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            for(var j=0;j<3;j++){

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[1]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");





                        })();break;
                    case 6:

                        (function(){

                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }


                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");




                        })();break;
                    case 7:

                        (function (){
                            //正面


                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");





                        })();break;
                    case 8:


                        (function (){
                            //正面
                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");


                        })();break;

                    case 9:
                        (function (){


                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");


                        })();break;
                    case 0:

                        (function(){

                            for(var j=0;j<3;j++){
                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                                $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                                $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[j]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            }

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[0]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");
                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[3]).find(".each-small-cube")[2]).find("li").css("backgroundColor","rgba(205,205,205,1)").addClass("showFirst");





                        })();break;


                }
            }

        },
        moveContainer:function(moveArr){



            var that = this;

            if(moveArr.length>0){


                for(var i=0;i<moveArr.length;i++){


                    $($(".each-big-cube")[moveArr[i]]).addClass("moveCube")
                   var $allfirst =  $($(".each-big-cube")[moveArr[i]]).find(".first");

                    for(var j=0;j<$allfirst.length;j++){


                       if($($allfirst[j]).hasClass("showFirst")){

                           $($allfirst[j]).css("backgroundColor","rgba(92,92,92,1)");

                       }
                    }
                }


            }
        }



    }
    //接受参数   HH：MM：SS
    function GetTime(time,id){
        this.id = id;

        this.time = time;
        this.initTime(time,id);
    }




    var getTime = new GetTime("11:14:36:02","content");




})()