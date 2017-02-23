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




               this.ul =  this.carousel_container.find("ul");
               this.li =  this.carousel_container.find("ul li");



                var real_height = window.innerHeight-150-45-92;



              function chooseWH(){


                  var height = true;
                  if( window.innerWidth<1000||(real_height)<458){
                      //最小屏  最小宽高
                      current_width = 1000;
                      current_height = 458;
                      console.log(((window.innerWidth/1000)-(real_height/458)));
                      (((window.innerWidth/1000)-(real_height/458))>0) ? height=true : height=false ;

                      if(height){
                      //宽大 高小  屏幕  用高算

                          $("html").css("overflow","visible");

                          that.li_width =(current_height-80)/that.li_wh_ratio;

                          that.init_Left = that.li_width-((window.innerWidth-that.li_width)/2-20);

                          that.carousel_container.css("height",current_height-80+"px");
                          that.li.css("height",current_height-80+"px");
                          that.li.css("width", that.li_width+"px");




                          that.ul.css("left",+-that.init_Left+"px");





                      }else{

                      //    高大宽小 屏幕  用宽算


                          $("html").css("overflow","visible");

                           var container_height =   (1000*that.container_wh_ratio)



                          that.li_width =((container_height)-80)/that.li_wh_ratio;

                          that.init_Left = that.li_width-((1000-that.li_width)/2-20);

                          that.carousel_container.css("height",container_height-80+"px");
                          that.li.css("height",container_height-80+"px");
                          that.li.css("width", that.li_width+"px");
                          that.ul.css("left",+-that.init_Left+"px");



                      }



                  //  1000以内
                  }
                  else{
                      $("html").css("overflow","hidden");

                      (((window.innerWidth/1000)-(real_height/458))>0) ? height=true : height=false ;

                      //(((window.innerWidth/1000)-(real_height/458))>0) ? console.log("高小以他为比例"):console.log("宽小以他为比例");


                      if(height){
                          //宽大 高小  屏幕  用高算

                          that.li_width =(real_height-80)/that.li_wh_ratio;

                          that.init_Left = that.li_width-((window.innerWidth-that.li_width)/2-20);
                          that.carousel_container.css("height",real_height-80+"px");
                          that.li.css("height",real_height-80+"px");
                          that.li.css("width",that.li_width+"px");
                          that.ul.css("left",+-that.init_Left+"px");

                      }else{

                          //    高大宽小 屏幕  用宽算



                          var container_height =   (window.innerWidth*that.container_wh_ratio)



                          that.li_width =((container_height)-80)/that.li_wh_ratio;

                          that.init_Left = that.li_width-((window.innerWidth-that.li_width)/2-20);

                          that.carousel_container.css("height",container_height-80+"px");
                          that.li.css("height",container_height-80+"px");
                          that.li.css("width", that.li_width+"px");
                          that.ul.css("left",+-that.init_Left+"px");


                      }



                  //    else闭合前
                  }
              }

                chooseWH();


                $(window).resizeEnd({
                    delay: 1000
                }, function(){
                    //处理代码
                   // 第二部  重绘加上动画。
                   //chooseWH();
                });
            }



















        }

























      function Carousel (container,left_bt,right_bt,loop){
          this.carousel_container = $(container);
          this.left_bg = $(left_bt);
          this.right_bt = $(right_bt);
          this.loop = loop;
          this.li_wh_ratio = 0.8;
          this.container_wh_ratio = 0.4583;

         this.initLayout();
      }


    var carousel  = new  Carousel(".carousel-container",".left-arrow-bt",".right-right-bg",false);

})(jQuery)