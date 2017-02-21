/**
 * Created by wanghan1 on 2017/2/21.
 */



//  项目思路  分为两部分 首先  轮播    其次改变页面

(function($){




        Carousel.prototype = {

            initLayout :function(){

                var current_width = 0;
                var current_height = 0;

                console.log( window.innerWidth)
                console.log( window.innerHeight)

                var real_height = window.innerHeight-150-45-92;



              function chooseWH(){
                  if( window.innerWidth<1000||(real_height)<458){
                      //最小屏  最小宽高
                      current_width = 1000;
                      current_height = 458;


                  }else{

                      console.log((real_height)/458);
                      (((window.innerWidth/1000)-(real_height/458))>0) ? console.log("高小以他为比例"):console.log("宽小以他为比例");





                  }
              }

                chooseWH();


                $(window).resize(function() {
                   // 第二部  重绘加上动画。
                   chooseWH();
                });
            }

        }

























      function Carousel (){
         this.initLayout();
      }


    var carousel  = new  Carousel();

})(jQuery)