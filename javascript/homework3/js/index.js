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
                var str = "";
                for(var i=0;i<arr_num.length;i++){

                 str   +=   that.drawCube(arr_num[i])

                }
                return  document.getElementById(that.id).innerHTML=str;;
            })();




            //document.getElementById(that.id).innerHTML = ""+end_sum;
        },
        timeDown:function(){
            var that = this;
            var task = setInterval(function(){
                that.sumM =  that.sumM-1;

                console.log(this)

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
             return   ssM = "0"+num;
            }else{
             return    ssM = num;
            }
        },drawCube:function(num){
            var that = this;




            return num;

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




    var getTime = new GetTime("16:10:22:12","content");




})()