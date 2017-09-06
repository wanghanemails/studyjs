/**
 * Created by wanghan on 17/9/6.
 */


(function ($) {

    SVGAll.prototype= {
        initSvg:function () {

        },
        section2InitFuc:function () {
            var that = this;
            var first_changeBall = true;


            var proportion_w = 0.86;
            var proportion_h = 0.58;
            var container_strokeW = proportion_w*window.innerWidth;
            var container_strokeH = proportion_h*window.innerHeight;




           //
            // console.log( $("#Layer_1").attr("viewport"));
            // console.log( document.getElementById("Layer_1").getAttribute("viewBox"));


            document.getElementById("section2-sphere").setAttribute("viewBox","0 0 "+window.innerWidth+" "+window.innerHeight);
            var snap_sphere = Snap("#section2-sphere");

            var g1 = snap_sphere.paper.gradient("r(0.0, 0.4, 0.6) rgb(200,200,200)-rgb(0,180,245)");




            var sphere= snap_sphere.paper.ellipse((window.innerWidth)/2,(window.innerHeight),20,20)

            sphere.attr({
                fill: g1,
            });

            var sphere1,sphere2,sphere3,sphere4;

           // document.getElementById("section2-sphere").classList.add("section2-sphereMove");



           var task_count = 0;

          var  task1 =   setInterval(function () {

                var cx =parseFloat($(".section2-sphere radialGradient").attr("cx"));

                   cx += 0.1;

                   if(cx>=1.8){
                    cx = 0;
                   }

              task_count+= 1;
              $(".section2-sphere radialGradient").attr("cx",cx);

              if(task_count==100){
                    clearInterval(task1)
                    }
            },10)

            Snap.animate([(window.innerHeight),20], [(window.innerHeight)/2,16], function (val) {
                    sphere.attr({
                        cy: val[0]
                    });

                }, 1000,mina.bounce,function () {



                Snap.animate([20,20], [0,0], function (val) {


                    console.log(1)

                    chagenBall();
                    sphere.attr({
                        rx: val[1],
                        ry: val[0]
                    });

                }, 500,mina.backin,function () {

                    sphere.remove();
                    var container_vb_w = "651.5";
                    var container_vb_h = "651.5";
                    var path1 = "0.75 0.75 190.75 0.75 200.75 10.75 450.75 10.75 460.75 0.75 650.75 0.75";
                    var path2 = "650.75 0.75 650.75 190.75 640.75 200.75 640.75 450.75 650.75 460.75 650.75 650.75";
                    var path3 = "650.75 650.75 460.75 650.75 450.75 640.75 200.75 640.75 190.75 650.75 0.75 650.75";
                    var path4 = "0.75 650.75 0.75 460.75 10.75 450.75 10.75 200.75 0.75 190.75 0.75 0.75";


                    veiwBoxChange(path1,container_vb_w,container_vb_h);
                    veiwBoxChange(path2,container_vb_w,container_vb_h);
                    veiwBoxChange(path3,container_vb_w,container_vb_h);
                    veiwBoxChange(path4,container_vb_w,container_vb_h);

                    // creatPolygon(4,mypaths,container,"none","rgb(0,180,245)","2px")


                });
            });

            function chagenBall() {
                if(first_changeBall){
                    first_changeBall = false;
                    sphere1= snap_sphere.paper.ellipse(((window.innerWidth)/2)-5,((window.innerHeight)/2)-5,10,10)

                    sphere1.attr({
                        fill: g1,
                    });
                    sphere2= snap_sphere.paper.ellipse(((window.innerWidth)/2)+5,(window.innerHeight)/2-5,10,10)

                    sphere2.attr({
                        fill: g1,
                    });
                    sphere3= snap_sphere.paper.ellipse(((window.innerWidth)/2)-5,(window.innerHeight)/2+5,10,10)

                    sphere3.attr({
                        fill: g1,
                    });
                    sphere4= snap_sphere.paper.ellipse(((window.innerWidth)/2)+5,(window.innerHeight)/2+5,10,10)

                    sphere4.attr({
                        fill: g1,
                    });
                }
            }

            document.getElementById("section2-sphere").addEventListener("webkitAnimationEnd", myStartFunction);

// 标准语法
            document.getElementById("section2-sphere").addEventListener("animationend", myStartFunction);
                // Snap.animate(0, window.innerWidth, function( ) {
                //     snap_sphere.attr({ cx:window.innerWidth/2, cy: window.innerHeight/2}); // move along path via cx & cy attributes
                // }, 2500,mina.easeinout);

        function myStartFunction() {

            var str_pl_ponts = "0.75 0.75 190.75 0.75 200.75 10.75 450.75 10.75 460.75 0.75 650.75 0.75"
            var arr_pl_pnots = str_pl_ponts.split(" ");
            console.log(arr_pl_pnots)
            //
            //
            // Snap.animate(8, 6, function (val) {
            //     sphere.attr({
            //         rx: val
            //     });
            //
            // }, 1000);
            //
            //
            // setTimeout(function () {
            //     Snap.animate(6, 8, function (val) {
            //         sphere.attr({
            //             rx: val
            //         });
            //
            //
            //     }, 1000);
            // },1000);
        }
            
          function creatPolygon(n,paths,container,fill_rgba,stroke_rgba,stroke_width) {

            var polygons = [];
            for(var i =0;i<n;i++){

                var onepolygon = container.paper.polyline(paths[i]).attr({
                    fill: fill_rgba,
                    stroke: stroke_rgba,
                    strokeMiterlimit:10,
                    strokeWidth:stroke_width
                });
                polygons.push(onepolygon)

            }
            return polygons;
          }

          function veiwBoxChange(path,vb_w,vb_h) {
              var paths_old = path.split(" ");

              if(paths_old.length>2){
                  var vb_ws = [];
                  var vb_hs = [];

              for(var i=0;i<paths_old.length;i++){
                    if(i%2==0){
                        vb_ws.push(paths_old[i]);

                    }else {
                        vb_hs.push(paths_old[i])
                    }
              }

              var proportion_vbw =   window.innerWidth/vb_w;
              var proportion_vbh =   window.innerHeight/vb_h;

                var real_path = "";
                // debugger;
              for(var j=0;j<vb_hs.length;j++){
                  real_path +=(parseFloat(vb_ws[j])*proportion_vbw).toString().match(/^\d+(?:\.\d{0,2})?/)+" "+(parseFloat(vb_hs[j])*proportion_vbh).toString().match(/^\d+(?:\.\d{0,2})?/)+" ";

              }

              return real_path;

              }
          }
        }
    }

    SVGAll.prototype.constructor = SVGAll;

    function SVGAll() {

        this.section2InitFuc();
    }

    var svg_all = new SVGAll()
})(jQuery)