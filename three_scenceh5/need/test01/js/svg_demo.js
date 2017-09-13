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

            var g1 = snap_sphere.paper.gradient("r(0.0, 0.4, 0.6) rgb(200,200,200)-rgb(73,104,223)");


            var g1 = "rgb(73,104,223)";



            var sphere= snap_sphere.paper.ellipse((window.innerWidth)/2,(window.innerHeight),10,10)

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

            var movePoint1,movePoint2,movePoint3,movePoint4;
            Snap.animate([(window.innerHeight),10], [(window.innerHeight)/2,8], function (val) {
                    sphere.attr({
                        cy: val[0]
                    });

                }, 500,mina.bounce,function () {



                Snap.animate([10,10], [0,0], function (val) {




                    chagenBall();
                    sphere.attr({
                        rx: val[1],
                        ry: val[0]
                    });

                }, 100,mina.backin,function () {

                    sphere.remove();

                    var container_vb_w = "651.5";
                    var container_vb_h = "651.5";
                    var path1 = "0.75 0.75 190.75 0.75 200.75 10.75 450.75 10.75 460.75 0.75 650.75 0.75";
                    var path2 = "650.75 0.75 650.75 190.75 640.75 200.75 640.75 450.75 650.75 460.75 650.75 650.75";
                    var path3 = "650.75 650.75 460.75 650.75 450.75 640.75 200.75 640.75 190.75 650.75 0.75 650.75";
                    var path4 = "0.75 650.75 0.75 460.75 10.75 450.75 10.75 200.75 0.75 190.75 0.75 0.75";



                    var mypaths = [];
                    mypaths.push(veiwBoxChange(path1,container_vb_w,container_vb_h))
                    mypaths.push(veiwBoxChange(path2,container_vb_w,container_vb_h))
                    mypaths.push(veiwBoxChange(path3,container_vb_w,container_vb_h))
                    mypaths.push(veiwBoxChange(path4,container_vb_w,container_vb_h))




                   //创建细线
                // var polygons =   creatPolygon(mypaths,"none","rgb(73,104,223)","2px")



                    Snap.animate([((window.innerWidth)/2)-5,((window.innerHeight)/2)-5],returnXYmove(veiwBoxChange(path1,container_vb_w,container_vb_h)) , function (val) {
                        sphere1.attr({
                            cx: val[0],
                            cy: val[1]
                        });

                    }, 200,mina.backin,function () {

                    });
                    Snap.animate([((window.innerWidth)/2)+5,((window.innerHeight)/2)-5],returnXYmove(veiwBoxChange(path2,container_vb_w,container_vb_h)) , function (val) {
                        sphere2.attr({
                            cx: val[0],
                            cy: val[1]
                        });

                    }, 200,mina.backin,function () {

                    });
                    Snap.animate([((window.innerWidth)/2)-5,((window.innerHeight)/2)+5],returnXYmove(veiwBoxChange(path3,container_vb_w,container_vb_h)) , function (val) {
                        sphere3.attr({
                            cx: val[0],
                            cy: val[1]
                        });

                    }, 200,mina.backin,function () {

                    });
                    Snap.animate([((window.innerWidth)/2)+5,((window.innerHeight)/2)+5],returnXYmove(veiwBoxChange(path4,container_vb_w,container_vb_h)) , function (val) {
                        sphere4.attr({
                            cx: val[0],
                            cy: val[1]
                        });

                    }, 200,mina.backin,function () {

                    //   球跟线一起动

                        var polygons =  creatPolygon(mypaths,"none","rgb(73,104,223)","2px")



                        var lenA = Snap("#polygon-0").getTotalLength();

                            Snap.animate(0,lenA, function(val) {
                                movePoint1 = Snap("#polygon-0").getPointAtLength(val);
                                sphere1.attr({ cx: movePoint1.x, cy: movePoint1.y }); // move along path via cx & cy attributes
                            }, 700,mina.linear);

                        var lenB = Snap("#polygon-1").getTotalLength();

                        Snap.animate(0,lenB, function(val) {
                            movePoint2 = Snap("#polygon-1").getPointAtLength(val);
                            sphere2.attr({ cx: movePoint2.x, cy: movePoint2.y }); // move along path via cx & cy attributes
                        }, 700,mina.linear);

                        var lenC = Snap("#polygon-2").getTotalLength();

                        Snap.animate(0,lenC, function(val) {
                            movePoint3 = Snap("#polygon-2").getPointAtLength(val);
                            sphere3.attr({ cx: movePoint3.x, cy: movePoint3.y }); // move along path via cx & cy attributes
                        }, 700,mina.linear);


                        var lenD = Snap("#polygon-3").getTotalLength();

                        Snap.animate(0,lenD, function(val) {
                            movePoint4 = Snap("#polygon-3").getPointAtLength(val);
                            sphere4.attr({ cx: movePoint4.x, cy: movePoint4.y }); // move along path via cx & cy attributes
                        }, 700,mina.linear,function () {

                            $("#section2-map").css("display","block");



                            setTimeout(function () {
                                $("#section2-map-location").css("display","block");
                            },1000);
                        });

                    });



                });
            });

            function chagenBall() {
                if(first_changeBall){
                    first_changeBall = false;
                    sphere1= snap_sphere.paper.ellipse(((window.innerWidth)/2)-5,((window.innerHeight)/2)-5,5,5)

                    sphere1.attr({
                        fill: g1,
                    });
                    sphere2= snap_sphere.paper.ellipse(((window.innerWidth)/2)+5,(window.innerHeight)/2-5,5,5)

                    sphere2.attr({
                        fill: g1,
                    });
                    sphere3= snap_sphere.paper.ellipse(((window.innerWidth)/2)-5,(window.innerHeight)/2+5,5,5)

                    sphere3.attr({
                        fill: g1,
                    });
                    sphere4= snap_sphere.paper.ellipse(((window.innerWidth)/2)+5,(window.innerHeight)/2+5,5,5)

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


        }
            
          function creatPolygon(paths,fill_rgba,stroke_rgba,stroke_width) {

            //创建四条线

            var polygons = [];
            for(var i =0;i<4;i++){

                var onepolygon = snap_sphere.paper.polyline(paths[i]).attr({
                    fill: fill_rgba,
                    stroke: stroke_rgba,
                    strokeMiterlimit:10,
                    strokeWidth:stroke_width,
                    "class":"onepolygon "+"polygon-"+i,
                    "id":"polygon-"+i,
                });




                polygons.push(onepolygon)


            }
              toPath();

                var g = snap_sphere.paper.g(polygons[0],polygons[1],polygons[2],polygons[3]).attr(
                    {
                        "class": "g-polygons"
                    }
                );
            return g;
          }

          function veiwBoxChange(path,vb_w,vb_h) {
              var paths_old = path.split(" ");

              if(paths_old.length>2){
                  var vb_ws = [];
                  var vb_hs = [];
                  var movex = window.innerWidth*(56/750)+"";
                  var movey = window.innerHeight*(420/1206)+"";

                  var  movex_del2 =  (movex.toString().match(/^\d+(?:\.\d{0,2})?/))[0]
                  var  movey_del2 =  (movey.toString().match(/^\d+(?:\.\d{0,2})?/))[0]

              for(var i=0;i<paths_old.length;i++){
                    if(i%2==0){
                        vb_ws.push(paths_old[i]);

                    }else {
                        vb_hs.push(paths_old[i])
                    }
              }

              var proportion_vbw =   323/vb_w;
              var proportion_vbh =   350/vb_h;

                var real_path = "";
                // debugger;
              for(var j=0;j<vb_hs.length;j++){
                  // var end_x = (parseFloat((parseFloat(vb_ws[j])*proportion_vbw).toString().match(/^\d+(?:\.\d{0,2})?/))+parseFloat(movex_del2)).toString().match(/^\d+(?:\.\d{0,2})?/);
                  // var end_y = (parseFloat((parseFloat(vb_hs[j])*proportion_vbh).toString().match(/^\d+(?:\.\d{0,2})?/))+parseFloat(movey_del2)).toString().match(/^\d+(?:\.\d{0,2})?/);


                  var end_x = parseFloat((parseFloat(vb_ws[j])*proportion_vbw).toString().match(/^\d+(?:\.\d{0,2})?/))+parseFloat(movex_del2);
                  var end_y = parseFloat((parseFloat(vb_hs[j])*proportion_vbh).toString().match(/^\d+(?:\.\d{0,2})?/))+parseFloat(movey_del2);


                  real_path +=end_x+" "+end_y+" ";

              }


                real_path = real_path.substr(0,real_path.length-1);


              return real_path;

              }
          }
          
          function returnXYmove(path) {
              var path = path.split(" ");
              var xy_move = [parseFloat(path[0]),parseFloat(path[1])];

              return xy_move;
          }
            function returnXYmoveend(path) {
                var path = path.split(" ");
                var xy_move = [parseFloat(path[path.length-2]),parseFloat(path[path.length-1])];

                return xy_move;
            }

            function toPath() {

//转为path的方法
                var polys = document.querySelectorAll('polygon,polyline');
                [].forEach.call(polys,convertPolyToPath);

                function convertPolyToPath(poly){
                    var svgNS = poly.ownerSVGElement.namespaceURI;
                    var path = document.createElementNS(svgNS,'path');
                    var points = poly.getAttribute('points').split(/\s+|,/);

                    var x0=points.shift(), y0=points.shift();
                    var pathdata = 'M'+x0+','+y0+'L'+points.join(' ');
                    if (poly.tagName=='polygon') pathdata+='z';
                    path.setAttribute('id',poly.getAttribute('id'));
                    path.setAttribute('class',poly.getAttribute('class'));
                    path.setAttribute('fill',poly.getAttribute('fill'));
                    path.setAttribute('stroke',poly.getAttribute('stroke'));
                    path.setAttribute('d',pathdata);

                    poly.parentNode.replaceChild(path,poly);
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