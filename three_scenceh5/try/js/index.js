/**
 * Created by wanghan on 17/9/14.
 */
(function ($) {


    window.requesetAnimFrame = function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (fn) {
                window.setTimeout(fn, 1000/60);
            };
    }();

    var scene,camera,
        renderer,
        aspectRatic,
        neardis,
        fardis,
        WIDTH,
        HEIGHT,
        camera_field_view,
        range,
        count = 0,
        geom,
        holder,
        text_group ,
        font,
        time_add = 0,
        clock,
        delta,
        context,
        animateRunning,
        lastTime,
        derection,
        pause,
        focallength,
        dots,
        canvasText;



    var cubeposition2 = [
        {x:-40,y:-40,z:100},
        {x:-40,y:-40,z:150},
        {x:10,y:-40,z:100},
        {x:10,y:-40,z:150},
        {x:-40,y:10,z:100},
        {x:-40,y:10,z:150},
        {x:10,y:10,z:100},
        {x:10,y:10,z:150},
    ]
    var smokeParticles = [];
    var move_second = false;
    var move_second_over = false;
    var move_third = false;


    var COLORS = {
        white : "0xffffff",
        black : "0x000000",

    }
    var ponits,cubesGroup1,cubesGroup2;

    var cylinder_height = 3;
    window.onload=function () {


        setInterval(function () {
            time_add+=1;
        },1000);
        init()
        animate();

    }


    function   init() {

        createScene();

        createDNA();






    }


    function createScene() {

            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;
            aspectRatic = WIDTH/HEIGHT;
            neardis = 0.1;
            fardis = 10000;


            //创建三大件之场景
            scene = new THREE.Scene();
            scene.background = new THREE.Color( 0x000000 );
            scene.fog = new THREE.Fog(0x000000,1000, -9000);

            camera_field_view = 60;


            //创建三大件之相机
            camera = new THREE.PerspectiveCamera(camera_field_view,aspectRatic,neardis,fardis);



            camera.position.set(0,0,1000);
            camera.lookAt(scene.position);

            scene.add(camera)
            //创建三大件之渲染器
            renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
            renderer.setSize(WIDTH,HEIGHT);
            renderer.setClearColor(0x000000,1.0);

            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft = true; //柔和阴影


        //    制造烟雾 和光


        var light = new THREE.DirectionalLight(0xffffff,0.5);
        light.position.set(10,100,1000);
        scene.add(light);



        var light2 = new THREE.DirectionalLight(0xffffff,0.5);
        light2.position.set(500,500,2000);
        scene.add(light2);

        clock = new THREE.Clock();
        var  smokeTexture = THREE.ImageUtils.loadTexture('images/Smoke-Element.png');
        var  smokeMaterial = new THREE.MeshLambertMaterial({color: 0x8c8c8c, map: smokeTexture, transparent: true,opacity: 1,});
        var smokeGeo = new THREE.PlaneGeometry(WIDTH*10,HEIGHT*10);



        for (var p = 0; p < 100; p++) {
            var smokeparticle = new THREE.Mesh(smokeGeo,smokeMaterial);

            smokeparticle.position.set(Math.random()*WIDTH*5-WIDTH*5/2,Math.random()*HEIGHT*5-HEIGHT*5/2,-1000);
            smokeparticle.rotation.z = Math.random() * -9000;
            scene.add(smokeparticle);
            smokeParticles.push(smokeparticle);
        }



        document.getElementById("WebGL-output").appendChild(renderer.domElement)

        canvasTextFuc();
        createSprites();

    //        允许阴影。
    }

    function createSprites() {

        var sprite_1 = createOneSprite("ponits-1",5,true,1,true);

        scene.add(sprite_1)
    }

    function createOneSprite (name,size,transparent,opacity,sizeAttenuation) {

        // debugger


         // geom = new THREE.Geometry();

        var mytexture = new THREE.ImageUtils.loadTexture("images/dots.png");

        var material = new THREE.SpriteMaterial({
            transparent: transparent,
            opacity: opacity,
            // map:mytexture
            color:0xffffff,
            vertexColors:true,
            map:mytexture

        });



        ponits = new THREE.Group()
         range = -10000;
        for ( var zpos= 0; zpos < 1000; zpos++) {

            // var particle = new THREE.Vector3(Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * range);
            var sprite =  new THREE.Sprite( material );
            sprite.position.set( Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * range );

            sprite.scale.set(3, 3, 3);

            // geom.vertices.push(particle);
            // geom.colors[zpos] = new THREE.Color(0xffffff)

            ponits.add(sprite);
        }


        // geom.normalize ();
        // cloud = new THREE.Points(geom, material);
        // cloud.name = name;
        // // cloud.sortParticles = true;
        //
        // cloud.sortParticles = true
        // // 允许粒子系统对粒子排序
        //
        // cloud.FrustrumCulled = true

        // scene.add(cloud)
        return ponits;


    }

    function createDNA() {

        var blue = 0x82cdf0;
        var yellow = 0xfff0b4;
        var purple = 0x82466e;
        var purple2 = 0xffffff;
        var tubeGeometry = new THREE.CylinderGeometry(0.1,0.1,cylinder_height,64);
        var ballGeometry = new THREE.SphereGeometry(0.8,64,64);
        var blueMaterial = new THREE.MeshBasicMaterial( { color: blue } );
        var yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow } );
        var purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );
        var purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2 } );



         dna = new THREE.Object3D();
         holder = new THREE.Object3D();

        // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        // dirLight.position.set( 0, 0, 1 ).normalize();
        // scene.add( dirLight );
        //
        // var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
        // pointLight.position.set( 0, 100, 90 );
        // scene.add( pointLight );
        // pointLight.color.setHSL( Math.random(), 1, 0.5 );





        materials = [
            new THREE.MeshBasicMaterial( { color: 0xffffff } ), // front
            new THREE.MeshBasicMaterial( { color: 0xffffff } ) // side
        ];


        text_group = new THREE.Group();
        text_group.position.y = 100;

        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_bold.typeface.json', function ( response ) {

            font = response;

            var height = 0.4,
                size = 1.6,
                curveSegments = 64,
                bevelThickness = 4,
                bevelSize = 2,
                bevelEnabled = true;


            var  text_mush1 =  createText(1,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,cylinder_height);
            var  text_mush2 =  createText(0,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,-cylinder_height);

            (function () {

                for (var i = 0; i < 40; i++) {

                    if(i%2){
                        var text = text_mush1;
                    }else {
                        var text = text_mush2;
                    }

                    var add_ball1 = text.clone()

                    add_ball1.position.y = -0.1;
                    var add_ball2 = text.clone()

                    // add_ball1.position.y  += 2;
                    add_ball1.position.x  =-4.6;
                    add_ball2.position.x =  cylinder_height;

                    add_ball1.position.y  =-0.6;
                    add_ball2.position.y  =- 0.6;



                    var blueTube = new THREE.Mesh(tubeGeometry, purpleMaterial2);
                    blueTube.rotation.z = 90 * Math.PI/180;
                    blueTube.position.x = -cylinder_height/2;

                    var yellowTube = new THREE.Mesh(tubeGeometry, purpleMaterial2 );
                    yellowTube.rotation.z = 90 * Math.PI/180;
                    yellowTube.position.x = cylinder_height/2;


                    var ballRight = new THREE.Mesh( ballGeometry, yellowMaterial );
                    ballRight.position.x = cylinder_height;

                    var ballLeft = new THREE.Mesh( ballGeometry, blueMaterial );
                    ballLeft.position.x = -cylinder_height;



                    var row = new THREE.Object3D();
                    row.add(blueTube);
                    row.add(yellowTube);
                    row.add(add_ball1);
                    row.add(add_ball2);

                    row.position.y = i*2;
                    row.rotation.y = 15*i * Math.PI/180;


                    dna.add(row);
                };
            })()

            dna.position.y = -40;

            scene.add(dna);

            holder.add(dna)

            var dna2 = dna.clone();

            dna2.children.length = 30
            dna2.position.x = -20;
            dna2.position.y = -30;

            holder.add(dna2)


            var dna3 = dna.clone();

            dna3.position.x = 20;
            dna3.children.length = 30;
            dna3.position.y = -30;
            holder.add(dna3)

            holder.position.z = -9000;
            scene.add(holder);

            //二屏
            move_second = true;
            setTimeout(function () {

                //标记开始旋转

                setTimeout(function () {
                    //标记结束打散

                    move_second_over = true

                    changeValue("积累终将改变未来");
                    addCubes();


                    for(var j=0;j<cubesGroup1.children.length;j++){

                        positionMove(j)

                    }



                    function positionMove(i) {




                        var tween = new TWEEN.Tween(cubesGroup1.children[i].position).to(cubeposition2[i],1000).onUpdate(function () {


                            cubesGroup1.children[i].position.x = this.x;
                            cubesGroup1.children[i].position.y = this.y;
                            cubesGroup1.children[i].position.z = this.z;

                            cubesGroup1.children[i].rotation.x = 0;
                            cubesGroup1.children[i].rotation.y = 0;
                            cubesGroup1.children[i].rotation.z = 0;
                            cubesGroup1.children[i].geometry.verticesNeedUpdate = true;

                        }).easing(TWEEN.Easing.Quintic.InOut).delay(1000*Math.random()).onComplete(function () {
                            //     拼凑方块完成
                            move_third = true;


                        });


                        // debugger;
                        tween.start();
                    }


                    // add_routine();

                },3000);
            },3000);
        } );







    }

    function createText(text,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,positionX) {


            var textGeo = new THREE.TextGeometry( text, {
                font: font,
                size: size,
                height: height,


            });




           var   textMesh1 = new THREE.Mesh( textGeo, materials );

            textMesh1.position.x = positionX;
            textMesh1.position.y = 0;
            textMesh1.position.z = 0;

            textMesh1.rotation.x = 0;
            textMesh1.rotation.y = Math.PI * 2;

            // debugger;
            text_group.add( textMesh1 );



            return textMesh1;
        }


    function animate() {

        animate_bg();

        delta = clock.getDelta()
        requestAnimationFrame(animate);
        evolveSmoke();
        TWEEN.update();
        render();
    }
    
    function render() {
        renderer.clear();
        renderer.render(scene,camera);
    }

    function animate_bg() {

        // var vertices = geom.vertices;

        if(move_second){

            // vertices.forEach(function (v) {
            //
            //     if(v.z>=1000){
            //
            //         v.setZ(range);
            //     }else {
            //
            //         // v.setZ(9000*Math.random()*(Math.random()>0.5?-1:1));
            //         v.setZ(v.z+HEIGHT/2*0.05);
            //     }
            //
            //     //    很关键。。。。。各种找
            //     cloud.geometry.verticesNeedUpdate = true;
            //
            // });

            ponits.children.map(function (v,index) {




                v.scale.x =2*Math.sin(  (count+index)/180 )+2*Math.cos( (count+index)/180);
                v.scale.y =2*Math.sin((count+index)/180 )+2*Math.cos(  (count+index)/180) ;

                count += 0.01;
                //    很关键。。。。。各种找
                // cloud.geometry.verticesNeedUpdate = true;

            });


            for(var i=0;i<holder.children.length;i++){
                //旋转dna
                if(i==0){
                    holder.children[i].rotation.y += 0.01;
                }else {
                    holder.children[i].rotation.y -= 0.02;
                }

            }
            dna.rotation.y += 0.01;




            animatecanvasText();
        }
        else{



            //星闪烁

            ponits.children.map(function (v,index) {


                if(v.position.z>=1000){

                    v.position.z=range;
                }else {

                    v.position.z = ( v.position.z+HEIGHT/2*0.05);
                }


                v.scale.x =2*Math.sin(  (count+index)/180 )+2*Math.cos( (count+index)/180);
                v.scale.y =2*Math.sin((count+index)/180 )+2*Math.cos(  (count+index)/180) ;

                count += 0.01;
                //    很关键。。。。。各种找
                // cloud.geometry.verticesNeedUpdate = true;

            });


        }


        if(holder.position.z<900){
            holder.position.z+=100*0.9;
        }else {

        }


        if(move_second_over){



            (function () {



                for(var i=0;i<holder.children.length;i++){

                    for(var j=0;j<holder.children[i].children.length;j++){

                        for(var k=0;k<holder.children[i].children[j].children.length;k++){

                            holder.children[i].children[j].children[k].position.x  += (2+i*j*k)*Math.random()*1;
                            holder.children[i].children[j].children[k].position.y  += (2+i*j*k)*Math.random()*0.1;
                            holder.children[i].children[j].children[k].position.z  += (2+i*j*k)*Math.random()*10;
                        }
                    }
                }
            })()

        }

        if(move_third){
            cubesGroup1.rotation.x+=0.01;
            cubesGroup1.rotation.y+=0.01;
            cubesGroup1.rotation.z+=0.01;
        }

    }
    function evolveSmoke() {
        var sp = smokeParticles.length;
        while(sp--) {
            smokeParticles[sp].rotation.z += (delta * 0.2);
        }
    }

    function animatecanvasText(){
        animateRunning = true;
        var thisTime = +new Date();
        context.clearRect(0,0,canvasText.width , canvasText.height);


        dots.map(function (v,index){
            var dot = v;

            if(derection){

                if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z)<0.1) {



                    dot.x = dot.dx;
                    dot.y = dot.dy;
                    dot.z = dot.dz;
                    if(thisTime - lastTime > 2000) derection = false;
                } else {
                    dot.x = dot.x + (dot.dx - dot.x) * 0.1;
                    dot.y = dot.y + (dot.dy - dot.y) * 0.1;
                    dot.z = dot.z + (dot.dz - dot.z) * 0.1;
                    lastTime = +new Date()
                //打乱
                }
            }
            else {


                // // debugger;
                // if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z)<0.1) {
                //     dot.x = dot.tx;
                //     dot.y = dot.ty;
                //     dot.z = dot.tz;
                //     pause = true;
                // } else {
                //
                //     dot.x = dot.x + (dot.tx - dot.x) * 0.1;
                //     dot.y = dot.y + (dot.ty - dot.y) * 0.1;
                //     dot.z = dot.z + (dot.tz - dot.z) * 0.1;
                //     pause = false;
                // }

                dot.x = dot.x + (dot.tx - dot.x) * 0.1;
                dot.y = dot.y + (dot.ty - dot.y) * 0.1;
                dot.z = dot.z + (dot.tz - dot.z) * 0.1;
                //打乱
                pause = false;
            }
            dot.paint();
        });





    }



    function addCubes() {

        cubesGroup1 = new THREE.Group();
        //
        // var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
        // var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        // var cubea = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // cubea.castShadow = true;
        // cubea.position.set(0,0,100);
        // cubea.rotation.set(10,10,10)


        for (var i=0;i<8;i++){
            var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            var fuhao = (i%2 ==0)? 1:-1;
            cube.position.set(i*50-180,50*fuhao-HEIGHT/2,100);
            cube.rotation.set(10,10,10)

            cubesGroup1.add(cube);
        }







        //
        // var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
        // var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        //
        // var cubea = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // cubea.castShadow = true;
        // cubea.position.set(-40,-40,100);
        // cubea.rotation.set(0,0,0)
        // cubesGroup1.add(cubea)
        //
        //
        // var cubeb = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // cubeb.castShadow = true;
        // cubeb.position.set(-40,-40,150);
        // cubeb.rotation.set(0,0,0);
        // cubesGroup1.add(cubeb)


        scene.add(cubesGroup1)

    }
    function add_routine() {

        $("#WebGL-output").css("display","none")
        $(".swiper-container").css("display","block")



        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',
            loop: true,
        });

        $('.right-btn').bind("touchstart",function(){


            mySwiper.slideTo(2, 1000, false);//切换到第一个slide，速度为1秒
        });
    }


    function canvasTextFuc() {
        canvasText = document.getElementById("cas");
        context = canvasText.getContext('2d');
        focallength = 500;

         dots = getimgData("从0和1的世界出发");;
         pause = false;

         initAnimate();


        //计算帧速率

         derection = true;



    }

    function changeValue(changeValue){

        // pause = true;
        //
        // if(!pause) return;
        // debugger;

        dots = getimgData(changeValue);
        pause = false;
        derection = true;
        // pause = false;
        initAnimate(changeValue);
    }
    function initAnimate(){
        dots.map(function(v,index){
            v.x = Math.random()*canvasText.width;
            v.y = Math.random()*canvasText.height;
            v.z = Math.random()*focallength*10 - focallength;

            v.tx = Math.random()*canvasText.width;
            v.ty = Math.random()*canvasText.height;
            v.tz = Math.random()*focallength*10 - focallength;
            v.paint();
        });
        animatecanvasText();
    }


    function getimgData(text){
        drawText(text);

        var imgData = context.getImageData(0,0,canvasText.width , canvasText.height);


        context.clearRect(0,0,canvasText.width , canvasText.height);
         dots = [];

        for(var x=0;x<imgData.width;x++){
            for(var y=0;y<imgData.height;y++){
                var i = (y*imgData.width + x)*4;
                if(imgData.data[i] >= 128&&i%4==0){
                    var dot = new Dot(x-0.5 , y-0.5 , 0 , 0.5);
                    dots.push(dot);
                }
            }
        }

        return dots;
    }

    function drawText(text){
        context.clearRect(0,0,canvasText.width , canvasText.height);
        context.save()
        context.font = "16px 微软雅黑";
        context.fillStyle = "rgba(255,255,255,1)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text , canvasText.width/2 , canvasText.height/2);
        context.restore();
    }


    var Dot = function(centerX , centerY , centerZ , radius){
        this.dx = centerX;
        this.dy = centerY;
        this.dz = centerZ;
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;
        this.z = centerZ;
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
    }

    Dot.prototype = {
        paint:function(){
            context.save();
            context.beginPath();
            var scale = focallength/(focallength + (this.z));
            context.arc(canvasText.width/2 + (this.x-canvasText.width/2)*scale , canvasText.height/2 + (this.y-canvasText.height/2) * scale, this.radius*scale , 0 , 2*Math.PI);
            //核心算法根据距离显示偏移和透明度。
            context.fillStyle = "rgba(255,255,255,"+ scale +")";
            context.fill()
            context.restore();

        }
    }

})(jQuery)