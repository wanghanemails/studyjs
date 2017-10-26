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

    var load_jsons = [];
    var scene,camera,
        renderer,
        aspectRatic,
        neardis,
        fardis,
        WIDTH,
        HEIGHT,
        camera_field_view,
        range,
        clouds,
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
        place=0,
        canvasText,
        x_group,
        x_opacity = 0,
        cube_num =0,
        amount,
        save_position,
        composer,
        prevdots,

        app;

    var otherIndex =0;
    var counts = [],
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    var device_screen_width  = WIDTH/750;
    var device_screen_height  = HEIGHT/1334;
    var time_text = 1000;
    var time_num = 6;

    var dis = [
        {
            z:1000,
            // x:100,
            // y:100
        }
    ]

    var cubeposition2 = [
        {x:70,y:0,z:100},
        {x:70,y:0,z:200},
        {x:170,y:0,z:100},
        {x:170,y:0,z:200},
        {x:70,y:100,z:100},
        {x:70,y:100,z:200},
        {x:170,y:100,z:100},
        {x:170,y:100,z:200},
    ]


    var cubeposition3 = [
        {x:-WIDTH*(Math.random()*10+1),y:-HEIGHT*(Math.random()*10+1),z:100},
        {x:-WIDTH*(Math.random()*10+1),y:-HEIGHT*(Math.random()*10+1),z:100},
        {x:WIDTH*(Math.random()*10+1),y:-HEIGHT*(Math.random()*10+1),z:100},
        {x:WIDTH*(Math.random()*10+1),y:-HEIGHT*(Math.random()*10+1),z:100},
        {x:-WIDTH*(Math.random()*10+1),y:HEIGHT*(Math.random()*10+1),z:100},
        {x:-WIDTH*(Math.random()*10+1),y:HEIGHT*(Math.random()*10+1),z:100},
        {x:WIDTH*(Math.random()*10+1),y:HEIGHT*(Math.random()*10+1),z:100},
        {x:WIDTH*(Math.random()*10+1),y:HEIGHT*(Math.random()*10+1),z:100},
    ]
    var smokeParticles = [];
    var begin_animation = false;
    var move_ponts = true;
    var move_second = false;
    var move_second_over = false;
    var move_third = false;
    var move_third_over = false;
    var move_four = false;
    var move_four_over = false;


    var COLORS = {
        white : "0xffffff",
        black : "0x000000",

    }
    var points,cubesGroup1,cubesGroup2;

    var cylinder_height = 3;
    window.onload=function () {


        pixi();
        addjson();


        setInterval(function () {
            time_add+=1;
        },1000);
        // init()


    }


    function   init() {



        // debugger;
        createScene();

        createDNA();


        animate();




    }


    function createScene() {


            aspectRatic = WIDTH/HEIGHT;
            neardis = 0.1;
            fardis = 10000;


            //创建三大件之场景
            scene = new THREE.Scene();
            scene.background = new THREE.Color( 0x000000 );
            scene.fog = new THREE.FogExp2(0x05050c,0.5);

            camera_field_view = 60;


            //创建三大件之相机
            camera = new THREE.PerspectiveCamera(camera_field_view,aspectRatic,neardis,fardis);


            var axes = new THREE.AxisHelper(2000);
            scene.add(axes);
            camera.position.set(0,0,1000);
            camera.lookAt(scene.position);

            scene.add(camera)
            //创建三大件之渲染器
            renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
            renderer.setSize(WIDTH,HEIGHT);
            renderer.setClearColor(0x000000,1.0);

            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft = true; //柔和阴影

            composer = new THREE.EffectComposer(renderer);
            var renderPass = new THREE.RenderPass(scene,camera);
            composer.addPass(renderPass);
            
            
            var bloomPass = new THREE.BloomPass(0.8);
            composer.addPass(bloomPass);
            
            var effectFilm = new THREE.FilmPass(0.8,0.325,256,false);
            effectFilm.renderToScreen = true;
            composer.addPass(effectFilm);


       var  d = new THREE.ShaderPass(THREE.FocusShader);
        d.uniforms.screenWidth.value = window.innerWidth;
        d.uniforms.screenHeight.value = window.innerHeight;
        d.uniforms.waveFactor.value = 0.00000125;
        d.renderToScreen = !0;

        composer.addPass(d);

        //    制造烟雾 和光

        var ambLight = new THREE.AmbientLight(1320786);
        scene.add(ambLight);
        var light = new THREE.DirectionalLight(0xffffff,0.5);
        light.position.set(-10,500,1000);
        light.name = "lightDirectional_1"
        scene.add(light);



        var light2 = new THREE.DirectionalLight(0xffffff,0.5);
        light2.position.set(-500,500,2000);
        light2.name = "lightDirectional_2"
        scene.add(light2);

        clock = new THREE.Clock();
        var  smokeTexture = new THREE.TextureLoader().load('images/Smoke-Element.png');
        var  smokeMaterial = new THREE.MeshLambertMaterial({color: 0xdcdada, map: smokeTexture, transparent: true,opacity: 0.1,});
        var smokeGeo = new THREE.PlaneGeometry(WIDTH*10,HEIGHT*10);



        for (var p = 0; p < 10; p++) {
            var smokeparticle = new THREE.Mesh(smokeGeo,smokeMaterial);

            smokeparticle.position.set(Math.random()*WIDTH*5-WIDTH*5/2,Math.random()*HEIGHT*5-HEIGHT*5/2,-1000);
            smokeparticle.rotation.z = Math.random() * -9000;
            scene.add(smokeparticle);
            smokeParticles.push(smokeparticle);
        }



        document.getElementById("WebGL-output").appendChild(renderer.domElement)


        createSprites();

    //        允许阴影。
    }

    function createSprites() {
        // points = new THREE.Object3D();
         createOneSprite(10,true,1,true);

    }

    function createOneSprite (size,transparent,opacity,sizeAttenuation) {

        // debugger


         // geom = new THREE.Geometry();


         amount =amount|| 1500;
         
        var positions = new Float32Array( amount * 3 );
         save_position = new Float32Array( amount * 3 );
        var colors = new Float32Array( amount * 3 );
        var sizes = new Float32Array( amount );





        var mytexture = new THREE.TextureLoader().load("images/dot.png");


        var material = new THREE.ShaderMaterial( {

            uniforms: {
                amplitude: { value: 1.0 },
                color:     { value: new THREE.Color( 0xffffff ) },
                texture:   { value: new THREE.TextureLoader().load( "images/dots.png" ) }
            },
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true

        });

        
        // var gemo = new THREE.Geometry();


        var vertex = new THREE.Vector3();
        var color = new THREE.Color( 0xffffff );
         range = 1000 ;
        for ( var zpos= 0; zpos < amount; zpos++) {



            vertex.x = Math.random() * WIDTH - WIDTH / 2;
            vertex.y = Math.random() * HEIGHT - HEIGHT / 2;
            vertex.z =range +(-range*2)*Math.random()-200;

            vertex.toArray( positions, zpos * 3 );
            vertex.toArray( save_position, zpos * 3 );


            color.toArray( colors, zpos * 3 );

            sizes[ zpos ] = size;

            // var color = new THREE.Color(0xffffff)
            //color.setHSL(color.getHSL().h,color.getHSL().s,color.getHSL().l);
            //gemo.colors.push(color);
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

        var cloud = new THREE.Points(geometry,material);
        cloud.name = name;

        cloud.sortParticles = true
        // 允许粒子系统对粒子排序

        cloud.FrustrumCulled = true


        scene.add(cloud)





    }

    function createDNA() {

        var blue = 0x82cdf0;
        var yellow = 0xfff0b4;
        var purple = 0x82466e;
        var purple2 = 0xffffff;
        var tubeGeometry = new THREE.CylinderGeometry(0.1,0.1,cylinder_height,64);
        var ballGeometry = new THREE.SphereGeometry(0.8,64,64);


         holder = new THREE.Object3D();


        text_group = new THREE.Group();
        text_group.position.y = 100;

        var loader = new THREE.FontLoader();
        loader.load( 'js/helvetiker_bold.typeface.json', function ( response ) {

            font = response;

            var height = 0.2,
                size = 1.6,
                curveSegments = 64,
                bevelThickness = 4,
                bevelSize = 2,
                bevelEnabled = true;



            function  creatDnaReal(a) {

                    materials = [
                        new THREE.MeshBasicMaterial( { color: 0xffffff,opacity:a,transparent:true,fog:false} ), // front
                        new THREE.MeshBasicMaterial( { color: 0xffffff ,opacity:a,transparent:true,fog:false} ) // side
                    ];
                    var blueMaterial = new THREE.MeshBasicMaterial( { color: blue ,opacity:a,transparent:true,fog:false} );
                    var yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow,opacity:a ,transparent:true,fog:false} );
                    var purpleMaterial = new THREE.MeshBasicMaterial( { color: purple ,opacity:a,transparent:true,fog:false} );
                    var purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2,opacity:a ,transparent:true,fog:false} );


                var  text_mush1 =  createText(1,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,cylinder_height);
                var  text_mush2 =  createText(0,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,-cylinder_height);


              var  dna = new THREE.Object3D();

                (function () {
                    for (var i = 0; i < 40; i++) {

                        if(i<4){
                            materials = [
                                new THREE.MeshBasicMaterial( { color: 0xffffff,opacity:(i*2/10),transparent:true,fog:false} ), // front
                                new THREE.MeshBasicMaterial( { color: 0xffffff ,opacity:i*2/10,transparent:true,fog:false} ) // side
                            ];
                            blueMaterial = new THREE.MeshBasicMaterial( { color: blue ,opacity:i*2/10,transparent:true,fog:false} );
                            yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow,opacity:i*2/10 ,transparent:true,fog:false} );
                            purpleMaterial = new THREE.MeshBasicMaterial( { color: purple ,opacity:i*2/10,transparent:true,fog:false} );
                            purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2,opacity:i*2/10 ,transparent:true,fog:false} );


                            text_mush1 =  createText(1,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,cylinder_height);
                            text_mush2 =  createText(0,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,-cylinder_height);

                        }
                        else if(i>36){
                            materials = [
                                new THREE.MeshBasicMaterial( { color: 0xffffff,opacity:((40-i)*2/10),transparent:true,fog:false} ), // front
                                new THREE.MeshBasicMaterial( { color: 0xffffff ,opacity:(40-i)*2/10,transparent:true,fog:false} ) // side
                            ];
                            blueMaterial = new THREE.MeshBasicMaterial( { color: blue ,opacity:(40-i)*2/10,transparent:true,fog:false} );
                            yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow,opacity:(40-i)*2/10 ,transparent:true,fog:false} );
                            purpleMaterial = new THREE.MeshBasicMaterial( { color: purple ,opacity:(40-i)*2/10,transparent:true,fog:false} );
                            purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2,opacity:(40-i)*2/10 ,transparent:true,fog:false} );


                            text_mush1 =  createText(1,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,cylinder_height);
                            text_mush2 =  createText(0,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,-cylinder_height);

                        }else {
                            materials = [
                                new THREE.MeshBasicMaterial( { color: 0xffffff,opacity:a,transparent:true,fog:false} ), // front
                                new THREE.MeshBasicMaterial( { color: 0xffffff ,opacity:a,transparent:true,fog:false} ) // side
                            ];
                            var blueMaterial = new THREE.MeshBasicMaterial( { color: blue ,opacity:a,transparent:true,fog:false} );
                            var yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow,opacity:a ,transparent:true,fog:false} );
                            var purpleMaterial = new THREE.MeshBasicMaterial( { color: purple ,opacity:a,transparent:true,fog:false} );
                            var purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2,opacity:a ,transparent:true,fog:false} );


                            var  text_mush1 =  createText(1,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,cylinder_height);
                            var  text_mush2 =  createText(0,height,size,curveSegments,bevelThickness,bevelSize,bevelEnabled,materials,-cylinder_height);

                        }


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




                        var row = new THREE.Object3D();
                        row.add(blueTube);
                        row.add(yellowTube);
                        row.add(add_ball1);
                        row.add(add_ball2);

                        row.position.y = i*2;
                        row.rotation.y = 15*i * Math.PI/180;


                        dna.add(row);

                    }
                })()
                return  dna;
            }

           var dna = creatDnaReal(1);
            dna.position.y = -35;

            // scene.add(dna);

            holder.add(dna)

            var dna2 = creatDnaReal(0.5);

            dna2.children.length = 30
            dna2.position.x = -20;
            dna2.position.y = -25;


            holder.add(dna2)


            var dna3 = creatDnaReal(0.5);

            dna3.position.x = 20;
            dna3.children.length = 30;
            dna3.position.y = -25;

            holder.add(dna3)

            holder.position.z = 900;
            scene.add(holder);




            holder.position.y = 100;


            //二屏


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
        composer.render(delta);
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

        var time = Date.now() * 0.005;
        // var vertices = geom.vertices;



        scene.children.map(function (c1,index1) {
                    if(c1.type == "Points"){

                        var geometry = c1.geometry;
                        var attributes = geometry.attributes;



                        var all_size_length = attributes.size.array.length;

                        for ( var i = 0; i <all_size_length ; i++ ) {
                            // attributes.size.array[ i ] = 8 + 7 * Math.sin( 0.1 * i + time );


                            var each_size = 0.1;

                            if(i<=all_size_length/3){
                                each_size = 0.05
                            }else if(i<=all_size_length*3/5&&i>all_size_length/3){
                                each_size = 0.02
                            }else if(i<=all_size_length*4/5&&i>all_size_length*3/5){
                                each_size = 0.01
                            }else{
                                each_size = 0.1
                            }
                            attributes.size.array[ i ] = 5 + (5 * minone(Math.sin( (each_size * i)) + time ))+ (5 * minone(Math.cos( (each_size * i) + time )));

                            if(i<otherIndex){
                                attributes.size.array[ i ] = 15;

                            }


                        }
                        attributes.size.needsUpdate = true;



                        if(move_second){

                            var all_position_length = attributes.position.array.length;


                            for ( var i = 0; i < attributes.position.array.length; i+=3 ) {



                                if(i<=otherIndex){

                                }
                                else {


                                    if(i<=all_position_length/3){

                                        if(attributes.position.array[i] >=-WIDTH/2){
                                            attributes.position.array[i] -= 0.1*(i*2/all_position_length)+0.01;
                                        }else{
                                            attributes.position.array[i] = WIDTH/2;
                                        }
                                    }else if(i<=all_position_length*3/5&&i>all_position_length/3){



                                    }else if(i<=all_position_length*4/5&&i>all_position_length*3/5){

                                        if(attributes.position.array[i] <=WIDTH/2){
                                            attributes.position.array[i] += 0.2*(i*2/all_position_length)+0.2*Math.random()+0.01;
                                        }else{
                                            attributes.position.array[i] = -WIDTH/2;
                                        }
                                    }else{

                                        if(attributes.position.array[i] <=WIDTH/2){
                                            attributes.position.array[i] += 0.2*(i*2/all_position_length)+0.2*Math.random()+0.01;
                                        }else{
                                            attributes.position.array[i] = -WIDTH/2;
                                        }

                                    }
                                }




                            }
                            for ( var j = 1; j < attributes.position.array.length; j+=3 ) {




                               if(j<=otherIndex){

                               }else {

                                   if(j<=all_position_length/3){

                                       if(attributes.position.array[j] >-HEIGHT/2){
                                           attributes.position.array[j] -= 0.1*(j/all_position_length)+0.1;
                                       }else{
                                           attributes.position.array[j] = HEIGHT/2;
                                       }

                                   }else if(j<=all_position_length*3/5&&j>all_position_length/3){
                                       if(attributes.position.array[j] <HEIGHT/2){
                                           attributes.position.array[j] += 0.2*(j/all_position_length)+0.2*Math.random()+0.01;
                                       }else{
                                           attributes.position.array[j] = -HEIGHT/2;
                                       }

                                   }else if(j<=all_position_length*4/5&&j>all_position_length*3/5){


                                   }else{

                                       if(attributes.position.array[j] <HEIGHT/2){
                                           attributes.position.array[j] += 0.2*(j/all_position_length)+0.2*Math.random()+0.01;
                                       }else{
                                           attributes.position.array[j] = -HEIGHT/2;
                                       }

                                   }
                               }




                            }




                            attributes.position.needsUpdate = true;




                        }
                        else{



                            attributes.position.needsUpdate = true;


                        }




                    }
                })




       if(holder&&begin_animation){
           for(var i=0;i<holder.children.length;i++){
               //旋转dna
               if(i==0){
                   holder.children[i].rotation.y += 0.05;
               }else {
                   holder.children[i].rotation.y -= 0.1;
               }

           }
           if(holder.position.y>0){
               holder.position.y-=1;
           }else {

           }

       }

        if(move_second_over&&move_third!=true){



            (function () {



                if(holder.position.y<100){
                    holder.position.y+=3;
                }else {

                }
            })()

        }




        if(move_four&&x_opacity<1){
            x_opacity+=0.01;
        }
        if(move_four &&!move_four_over){

            x_group.children[1].rotation.y +=0.02;


        }
    }
    function evolveSmoke() {
        var sp = smokeParticles.length;
        while(sp--) {
            smokeParticles[sp].rotation.z += (delta * 0.2);
        }
    }





    function addCubes() {

        $("#cube-2").css("display","block");
        $("#cube-2").html("");

        var str = "<div id='end-2'></div>"
        $("#cube-2").append(str);
        document.getElementById("end-2").appendChild(app.view);


        var frames = [];

        for (var i = 2; i < 100; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('30' + val + '.png'));
        }


        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);



        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = WIDTH / 2;
        anim.y = HEIGHT / 2;
        anim.scale.x=device_screen_width;
        anim.scale.y=device_screen_height;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();





        anim.onComplete=function () {


            setTimeout(function () {
                app.stage.children.shift();

                addCubes2();





                // changeValue("积累终将改变未来");
                // addCubes();



                //
            },1000)



        }
        app.stage.addChild(anim);

        // Animate the rotation
        app.ticker.add(function() {
            // anim.rotation += 0.01;

        });


    }
    function addCubes2() {



        $("#cube-2").html("");

        var str = "<div id='end-2'></div>"
        $("#cube-2").append(str);
        document.getElementById("end-2").appendChild(app.view);

        // var str = "<div id='end-3'></div>"
        // $("#end").append(str);

        // document.getElementById("end").appendChild(app.view);

        var frames = [];

        for (var i = 100; i < 166; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('30' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = WIDTH / 2;
        anim.y = HEIGHT / 2;
        anim.scale.x=device_screen_width;
        anim.scale.y=device_screen_height;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.5;
        anim.loop = false;
        anim.play();



        // anim.onStart = function () {
        //
        //     $("#end").css("display","none");
        // }

        setTimeout(function () {


            app.stage.children.shift();





            // changeValue("积累终将改变未来");
            // addCubes();



            //
        },1000)

        anim.onComplete=function () {



            addX();


        }
        app.stage.addChild(anim);

        // Animate the rotation
        app.ticker.add(function() {
            // anim.rotation += 0.01;
        });


    }

    function addX() {





        // var str = "<div id='end-3'></div>"
        // $("#end").append(str);

        document.getElementById("end").appendChild(app.view);

        var frames = [];

        for (var i = 166; i < 259; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('30' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = WIDTH / 2;
        anim.y = HEIGHT / 2;
        anim.scale.x=device_screen_width;
        anim.scale.y=device_screen_height;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();



        // anim.onStart = function () {
        //
        //     $("#end").css("display","none");
        // }

        setTimeout(function () {


            app.stage.children.shift();





            // changeValue("积累终将改变未来");
            // addCubes();



            //
        },100)

        anim.onComplete=function () {

            loopX();




        }
        app.stage.addChild(anim);

        // Animate the rotation
        app.ticker.add(function() {
            // anim.rotation += 0.01;
        });


    }
    function loopX() {





        // var str = "<div id='end-3'></div>"
        // $("#end").append(str);

        document.getElementById("end").appendChild(app.view);

        var frames = [];

        for (var i = 198; i < 258; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('30' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = WIDTH / 2;
        anim.y = HEIGHT / 2;
        anim.scale.x=device_screen_width;
        anim.scale.y=device_screen_height;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = true;
        anim.play();



        // anim.onStart = function () {
        //
        //     $("#end").css("display","none");
        // }

        setTimeout(function () {


            app.stage.children.shift();





            // changeValue("积累终将改变未来");
            // addCubes();



            //
        },100)

        anim.onComplete=function () {


        }
        app.stage.addChild(anim);

        // Animate the rotation
        app.ticker.add(function() {
            // anim.rotation += 0.01;
        });


    }


    
    function pixi() {
         app = new PIXI.Application(WIDTH, HEIGHT, {backgroundColor: "none",transparent: true});
         document.getElementById("end").appendChild(app.view);
    }


    function addBreak() {
        // $("#WebGL-output").css("display","none")
        $("#end").css("display","block")

        document.getElementById("end").appendChild(app.view);
        app.stage.children.shift();

        var frames = [];

        for (var i = 0; i < 78; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('10' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = WIDTH / 2;
        anim.y = HEIGHT / 2;

        anim.scale.x=device_screen_width;
        anim.scale.y=device_screen_height;


        anim.anchor.set(0.5);
        anim.animationSpeed = 0.4;
        anim.loop = false;
        anim.play();




        anim.onComplete=function () {
            

                // changeValue("积累终将改变未来");
                //


        }
        app.stage.addChild(anim);

        // Animate the rotation
        var count_zhen = 0;
        app.ticker.add(function() {
            // anim.rotation += 0.01;





        });
    }
    

    function add_routine() {

        $("#WebGL-output").css("display","none")
        $("#end").css("display","none")
        $("#cas").css("display","none")
        $(".swiper-container").css("display","block")



        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',
            loop: true,
        });

        $('.right-btn').bind("touchstart",function(){


            mySwiper.slideTo(2, 1000, false);//切换到第一个slide，速度为1秒
        });
    }








    function drawText(text,context,canvasText){

        context.clearRect(0,0,WIDTH , HEIGHT);
        context.save()
        context.font = "100 16px Microsoft Yahei";
        context.fillStyle = "rgba(255,255,255,1)";
        context.textAlign = "center";
        context.textBaseline = "bottom";

        context.fillText(text , canvasText.width/2 , canvasText.height/2);
        context.restore();





    }





    function movediv() {



        $(".begin-1").css("display","block");
        $(".begin-2").css("display","block");


        $(".begin-1").animate({top:"0%"},1000);
        $(".begin-2").animate({top:"0%"},1000);

        setTimeout(function () {
            $(".begin-1").css("display","none");
            $(".begin-2").css("display","none");


            addBreak()
        },1000)

        setTimeout(function () {
            scene.children.length = scene.children.length-1;
            addCubes();
        },3800);
    }

    function addjson(){

        for(var i=0;i<11;i++){
            load_jsons.push("img/addx-"+i+".json")
        }
        for(var i=0;i<10;i++){
            load_jsons.push("img/broken-"+i+".json")
        }

        for(var i=0;i<5;i++){
            load_jsons.push("img/cube01-"+i+".json")
        }
        for(var i=0;i<6;i++){
            load_jsons.push("img/cube02-"+i+".json")
        }

        // load_jsons.push("img/loading-0.json")

        loadjson();
    }

    function loadjson() {


        init()

        PIXI.loader.add("img/loading-0.json").load(function () {
            document.getElementById("loading-sky").appendChild(app.view);

            var frames = [];

            for (var i = 0; i < 13; i++) {
                // var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

                // magically works since the spritesheet was loaded with the pixi loader
                frames.push(PIXI.Texture.fromImage('loading-' + (i+1)+ '.png'));
            }

            // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
            var anim = new PIXI.extras.AnimatedSprite(frames);

            /*
             * An AnimatedSprite inherits all the properties of a PIXI sprite
             * so you can change its position, its anchor, mask it, etc
             */
            anim.x = WIDTH / 2;
            anim.y = HEIGHT / 2;
            anim.scale.x=device_screen_width;
            anim.scale.y=device_screen_height;
            anim.anchor.set(0.5);
            anim.animationSpeed = 0.1;
            anim.loop = true;
            anim.play();



            anim.onComplete=function () {



            }
            app.stage.addChild(anim);

            // Animate the rotation
            app.ticker.add(function() {
                // anim.rotation += 0.01;
            });



            PIXI.loader.add(load_jsons).on("progress",function () {
                console.log(this.progress-100)
                if(Math.floor(this.progress-100)>=100){{

                    // $("#loading-sky").css("display","none");
                    }
                }
            }).load(function () {
                $("#loading-sky").css("display","none")
                begin_animation = true;
                getMyTextData("从0和1的世界出发");
                // getMyTextData("打破现实的边界");
                // getMyTextData("积累终将改变未来");
                // getMyTextData("开放可以享有更多");
                // getMyTextData("连接一切应对未知");
                setTimeout(function () {
                    // canvasTextFuc();
                    move_second = true;



                    //标记开始旋转
                    $(".begin-2").animate({top:"-20%"},2000);
                    setTimeout(function () {
                        //标记结束打散
                        move_second_over = true
                    },3*time_text);
                    setTimeout(function () {
                        //标记结束打散
                        movediv();
                    },2.8*time_text);
                },1000000);
            })



        })




    }

    function minone(a) {

        if(a>=-1&&a<=1){

          return   a;
        }else if(a>0) {
            return 1;
            
        }else {
            return-1;
        }
    }

    function getprevDots() {


        var dots = [];
        scene.children.map(function (c1,index1) {
            if(c1.type == "Points"){

                var geometry = c1.geometry;
                var attributes = geometry.attributes;



                var all_position_length = attributes.position.array.length;
                var all_size_length = attributes.size.array.length;

                for ( var i = 0; i <all_position_length-2 ; i+=3 ) {
                    // attributes.size.array[ i ] = 8 + 7 * Math.sin( 0.1 * i + time );

                    if(i<=otherIndex){

                        var obj = {};

                        obj.x = attributes.position.array[ i ];
                        obj.y = attributes.position.array[ i+1];
                        obj.z = attributes.position.array[ i+2 ];
                        obj.size = 1;


                        dots.push(obj);
                    }
                }

                for ( var i = 0; i <dots.length ; i++ ) {
                    // attributes.size.array[ i ] = 8 + 7 * Math.sin( 0.1 * i + time );


                    if(i<otherIndex){
                        dots[i].size = attributes.size.array[ i ];
                    }

                }

            }
        })

        return dots;
    }

    function getMyTextData(text) {
        move_ponts = false;
        var canvasText = document.getElementById("cas");
        var context = canvasText.getContext('2d');
        drawText(text,context,canvasText);

        var imgData = context.getImageData(0,0,canvasText.width , canvasText.height);
        context.clearRect(0,0,canvasText.width , canvasText.height);

        var dots = [];

        var dotall = [];
        for(var x=0;x<imgData.width;x++){
            for(var y=0;y<imgData.height;y++){
                var i = (y*imgData.width + x)*4;
                if(imgData.data[i] >= 128){
                    // place++
                    var dot = {x:x,y:-y-60};
                    dots.push(dot);
                }
            }
        }




        otherIndex = dots.length;

        prevdots = getprevDots();





        for(var i=0;i<dots.length;i++){

            dotall.push(dots[i].x-150)
            dotall.push(dots[i].y-50)
            dotall.push(600)
        }

        movepoints(dotall);
       
        return dots;
    }
    function movepoints(dotall) {

        scene.children.map(function (c1,index) {
            if(c1.type=="Points"){

                // debugger

                var geometry = c1.geometry;
                var attributes = geometry.attributes;

                move_ponts = false;


                var all_position_length = attributes.position.array.length;


                pointPositionMove(c1,attributes.position.array,dotall,function () {

                //    执行完回调
                })

                attributes.size.needsUpdate = true;
            }
            
        })

    }

    function pointPositionMove(c1,a,b,mycomplete) {

        var tween = new TWEEN.Tween(a).to(b,3000).onUpdate(function () {




            for(var i=0;i<a.length;i++){

                a[i] = this[i] ||0;
            }


            c1.geometry.attributes.position.needsUpdate = true;

        }).easing(TWEEN.Easing.Quintic.InOut).delay(500*Math.random()).onComplete(mycomplete);

        // debugger;
        tween.start();
    }

})(jQuery)