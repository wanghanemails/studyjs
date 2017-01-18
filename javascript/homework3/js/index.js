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
            that.prev_arr = new Array();
            that.sumM = daysM+hoursM +minuteM+secondM;

            that.getEndTime();
            //调用每隔一秒减时间函数
            //that.timeDown();


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
            //    初始化画出
            var that =this;
            var end_sum = that.backSpace(that.showTime("day",that.sumM))+""+that.backSpace(that.showTime("hour",that.sumM))+""+that.showTime("minute",that.sumM)+""+that.backSpace(that.showTime("second",that.sumM));

            console.log(end_sum.length)
            var arr_num = new Array();

            (function(){
                for(var i=0;i<end_sum.length;i++){
                    arr_num.push(end_sum[i])
                }


                return arr_num;

            })();

            (function(){
                //花出一个由小方块组成的大方块.
                var str = "<ul class='top-container clearfix'>";
                for(var i=0;i<arr_num.length;i++){



                    str += "<li class='each-num'>";
                    str   +=   that.drawCube(arr_num[i])
                    str += "</li>";
                }
                str+= "</ul>"

                console.info(that.prev_arr);
                return  document.getElementById(that.id).innerHTML=str;
            })();





            (function(){
                //根据数字显示颜色
                //花出一个由小方块组成的大方块.

                for(var i=0;i<arr_num.length;i++){

                 that.showNumColor(arr_num[i],i);

                }

            })();



            (function(){
                //根据数字显示颜色
                //花出一个由小方块组成的大方块.

                for(var i=0;i<arr_num.length;i++){



                    that.moveContainer(i)

                }

            })();



            (function(){

                //运动完后当前时间覆盖前一秒时间的字符串数组
                for(var i=0;i<arr_num.length;i++){

                    that.prev_arr[i]=arr_num[i];

                }
                //console.info(that.prev_arr);
                return that.prev_arr;
            })();

            //document.getElementById(that.id).innerHTML = ""+end_sum;
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

            //console.log(oneSmall_cube)


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



            switch (num){


                case "1":


                    (function(){


                        console.log(i)
                        //正面 first   面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");

                        }

                        //右侧面  second  面


                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }


                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");




                    })();break;


                case "2":

                    (function(){
                        //正面
                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");


                        //右侧面

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }



                    })();break;

                case "3":

                    (function(){
                        //正面
                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        //右侧面




                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");


                    })();break;



                case "4":


                    (function (){
                        //正面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        }

                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                        }

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");


                        //右侧面


                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");


                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }


                    })();break;
                case "5":

                    (function(){
                        //正面
                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        //右侧面

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }

                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[1]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");




                    })();break;
                case "6":

                    (function(){
                        //正面
                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");
                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[1]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");

                        //右侧面


                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#ffffff");
                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#ffffff");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");


                    })();break;
                case "7":

                    (function (){
                        //正面

                        for(var j=0;j<3;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[j]).find(".first").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        }

                        //右侧面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[1]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#ffffff");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                    })();break;
                case "8":


                    (function (){
                        //正面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");

                        }

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        }

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");

                        //右侧面


                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");



                    })();break;

                case "9":
                    (function (){

                        //正面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");

                        }

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        }

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[3]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#ffffff");



                        //右侧面


                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");




                    })();break;
                case "0":

                    (function(){

                        //正面
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[0]).find(".first").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[j]).find(".each-small-cube")[2]).find(".first").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");

                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".first").css("backgroundColor","#004276");



                        //右侧面

                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        for(var j=0;j<5;j++){

                            $($($($(".each-num")[i]).find(".each-big-cube .third-screen li.each-row")[j]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");

                        }
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[0]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[2]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .second-screen li.each-row")[4]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#004276");
                        $($($($(".each-num")[i]).find(".each-big-cube .first-screen li.each-row")[3]).find(".each-small-cube")[1]).find(".second").css("backgroundColor","#ffffff");




                    })();break;


            }




        },
        moveContainer:function(x){

        }



    }
    //接受参数   HH：MM：SS
    function GetTime(time,id){
        this.id = id;
        //var current_time = new Date(time).getTime();
        //console.log(current_time);
        this.time = time;
        this.initTime(time,id);
    }




    var getTime = new GetTime("90:14:36:12","content");




})()