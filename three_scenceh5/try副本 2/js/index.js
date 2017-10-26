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
        app;


    var counts = [],
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

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


        setInterval(function () {
            time_add+=1;
        },1000);
        init()
        animate();

    }


    function   init() {

        pixi();

        createScene();

        createDNA();







    }


    function createScene() {


            aspectRatic = WIDTH/HEIGHT;
            neardis = 0.1;
            fardis = 10000;


            //创建三大件之场景
            scene = new THREE.Scene();
            scene.background = new THREE.Color( 0x000000 );
            scene.fog = new THREE.FogExp2(0x05050c,0.0005);

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
         createOneSprite(5,true,1,true);
        // var sprite_2= createOneSprite("ponits-2",5,true,1,true);


        // ponits.add(sprite_2)
        // scene.add(ponits)
    }

    function createOneSprite (size,transparent,opacity,sizeAttenuation) {

        // debugger


         // geom = new THREE.Geometry();


         amount =amount|| 5000
        var positions = new Float32Array( amount * 3 );
         save_position = new Float32Array( amount * 3 );
        var colors = new Float32Array( amount * 3 );
        var sizes = new Float32Array( amount );





        var mytexture = new THREE.TextureLoader().load("images/dot.png");

        // var material = new THREE.SpriteMaterial({
        //     transparent: transparent,
        //     opacity: opacity,
        //     // map:mytexture
        //     color:0xffffff,
        //     vertexColors:true,
        //     map:mytexture,
        //     sizeAttenuation:sizeAttenuation
        //
        // });
        // var material = new THREE.PointsMaterial({
        //
        //     vertexColors:true,
        //     size: size,
        //     transparent: transparent,
        //     blending: THREE.AdditiveBlending,
        //     map:mytexture,
        //     sizeAttenuation: sizeAttenuation,
        //     color: 0xffffff,
        //     opacity:opacity,
        //
        // })
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

            // var particle = new THREE.Vector3(Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * range);
            // var sprite =  new THREE.Sprite( material );
            // sprite.position.set( Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * range );
            //
            // sprite.scale.set(size, size, size);
            //
            // // geom.vertices.push(particle);
            // // geom.colors[zpos] = new THREE.Color(0xffffff)
            //
            // type_ponts.add(sprite);

            // var particle = new THREE.Vector3(Math.random() * WIDTH - WIDTH / 2,Math.random() * HEIGHT - HEIGHT / 2,range +(-10000)*Math.random())
            // var x = (Math.random()*(range/5))-((range/5)/2);
            // var y = (Math.random()*(range/5))-((range/5)/2);
            // var z = (Math.random()*(range/5))-((range/5)/2);
            // var particle = new THREE.Vector3(x,y,z);
            // gemo.vertices.push(particle)


            vertex.x = Math.random() * WIDTH - WIDTH / 2;
            vertex.y = Math.random() * HEIGHT - HEIGHT / 2;
            vertex.z =range +(-range)*Math.random()-200;

            vertex.toArray( positions, zpos * 3 );
            vertex.toArray( save_position, zpos * 3 );

            // if ( vertex.x < 0 ) {
            //
            //     color.setHSL( 0.5 + 0.1 * ( zpos / amount ), 0.7, 0.5 );
            //
            // } else {
            //
            //     color.setHSL( 0.0 + 0.1 * ( zpos / amount ), 0.9, 0.5 );
            //
            // }

            color.toArray( colors, zpos * 3 );

            sizes[ zpos ] = 3;

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


        // ponits.add(cloud)

        // return cloud;

        // geom.normalize ();
        // cloud = new THREE.Points(geom, material);
        // cloud.name = name;
        // cloud.sortParticles = true;
        //


        // scene.add(cloud)



    }

    function createDNA() {

        var blue = 0x82cdf0;
        var yellow = 0xfff0b4;
        var purple = 0x82466e;
        var purple2 = 0xffffff;
        var tubeGeometry = new THREE.CylinderGeometry(0.1,0.1,cylinder_height,64);
        var ballGeometry = new THREE.SphereGeometry(0.8,64,64);





         holder = new THREE.Object3D();

        // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        // dirLight.position.set( 0, 0, 1 ).normalize();
        // scene.add( dirLight );
        //
        // var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
        // pointLight.position.set( 0, 100, 90 );
        // scene.add( pointLight );
        // pointLight.color.setHSL( Math.random(), 1, 0.5 );








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

            setTimeout(function () {

                // canvasTextFuc();
                move_second = true;
                //标记开始旋转

                setTimeout(function () {
                    //标记结束打散

                    move_second_over = true


                    setTimeout(function () {


                        scene.children.length = scene.children.length-1;


                        movediv();
                        // changeValue("去打破显示的边界");

                    },time_text*3)














                    // function callbackself() {
                    //     if(pause&&move_third!=true ){
                    //
                    //
                    //         callbackself();
                    //     }else{
                    //         //八个方块  每个都来一次   回调函数更保险     canvas  改为 threejs  从背景点中来搞定 ；
                    //         console.log(1)
                    //         move_third_over = true;
                    //
                    //
                    //         changeValue("连接一切应对未知")
                    //         debugger;
                    //
                    //
                    //         return   null;
                    //     }
                    // }
                    // callbackself();
                    // add_routine();

                },3*time_text);
            },2000);
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
    function positionMove(j,a,b,r1,r2,r3,mycomplete) {

        var tween = new TWEEN.Tween(a.position).to(b,1000).onUpdate(function () {


            a.position.x = this.x;
            a.position.y = this.y;
            a.position.z = this.z;

            a.rotation.x = r1;
            a.rotation.y = r2;
            a.rotation.z = r3;
            a.geometry.verticesNeedUpdate = true;

        }).easing(TWEEN.Easing.Quintic.InOut).delay(500*j).onComplete(mycomplete);

        // debugger;
        tween.start();
    }
    function animate_bg() {

        var time = Date.now() * 0.005;
        // var vertices = geom.vertices;

        var interval_num = 180;
        var speed_sprite = HEIGHT/2*0.01;

        scene.children.map(function (c1,index1) {
                    if(c1.type == "Points"){

                        var geometry = c1.geometry;
                        var attributes = geometry.attributes;



                        var all_size_length = attributes.size.array.length;

                        for ( var i = 0; i <all_size_length ; i++ ) {
                            // attributes.size.array[ i ] = 8 + 7 * Math.sin( 0.1 * i + time );


                            var each_size = 0.1;

                            if(i<all_size_length/3){
                                each_size = 5
                            }else if(i<all_size_length*3/5&&i>all_size_length/3){
                                each_size = 0.02
                            }else if(i<all_size_length*4/5&&i>all_size_length*3/5){
                                each_size = 0.01
                            }else{
                                each_size = 0.1
                            }

                            attributes.size.array[ i ] = 5 + 5 * Math.sin( each_size * i + time )+5 * Math.cos( each_size * i + time );


                        }
                        attributes.size.needsUpdate = true;



                        if(move_second){

                            var all_position_length = attributes.position.array.length;


                            for ( var i = 0; i < attributes.position.array.length; i+=3 ) {


                                // if(attributes.position.array[i]>(range)){
                                //     attributes.position.array[i] = range +(-range)*Math.random()-1000;
                                // }else{
                                //     attributes.position.array[i] += 10;
                                // }

                                // attributes.size.array[ i ] = 14 + 13 * Math.sin( 0.1 * i + time );


                                if(i<all_position_length/3){

                                    if(attributes.position.array[i] >-WIDTH/2){
                                        attributes.position.array[i] -= 0.1*(i*2/all_position_length)+0.01;
                                    }else{
                                        attributes.position.array[i] = WIDTH/2;
                                    }
                                }else if(i<all_position_length*3/5&&i>all_position_length/3){



                                }else if(i<all_position_length*4/5&&i>all_position_length*3/5){

                                    if(attributes.position.array[i] <WIDTH/2){
                                        attributes.position.array[i] += 0.2*(i*2/all_position_length)+0.2*Math.random()+0.01;
                                    }else{
                                        attributes.position.array[i] = -WIDTH/2;
                                    }
                                }else{

                                    if(attributes.position.array[i] <WIDTH/2){
                                        attributes.position.array[i] += 0.2*(i*2/all_position_length)+0.2*Math.random()+0.01;
                                    }else{
                                        attributes.position.array[i] = -WIDTH/2;
                                    }

                                }




                            }
                            for ( var j = 1; j < attributes.position.array.length; j+=3 ) {




                                if(j<all_position_length/3){

                                    if(attributes.position.array[j] >-HEIGHT/2){
                                        attributes.position.array[j] -= 0.1*(j/all_position_length)+0.1;
                                    }else{
                                        attributes.position.array[j] = HEIGHT/2;
                                    }

                                }else if(j<all_position_length*3/5&&j>all_position_length/3){
                                    if(attributes.position.array[j] <HEIGHT/2){
                                        attributes.position.array[j] += 0.2*(j/all_position_length)+0.2*Math.random()+0.01;
                                    }else{
                                        attributes.position.array[j] = -HEIGHT/2;
                                    }

                                }else if(j<all_position_length*4/5&&j>all_position_length*3/5){


                                }else{

                                    if(attributes.position.array[j] <HEIGHT/2){
                                        attributes.position.array[j] += 0.2*(j/all_position_length)+0.2*Math.random()+0.01;
                                    }else{
                                        attributes.position.array[j] = -HEIGHT/2;
                                    }

                                }




                            }



                            for ( var k = 2; k < attributes.position.array.length; k+=3 ) {


                                attributes.position.array[k] = save_position[k];

                                // attributes.size.array[ i ] = 14 + 13 * Math.sin( 0.1 * i + time );


                            }


                            attributes.position.needsUpdate = true;



                            attributes.position.needsUpdate = true;
                        }else{

                        // 动 0 , 1, 2  x y z

                            for ( var i = 2; i < attributes.position.array.length; i+=3 ) {


                                if(attributes.position.array[i]>=(range)){
                                    attributes.position.array[i] = -200-(range-900)*Math.random();

                                }else{
                                    attributes.position.array[i] += 10;

                                }

                                // attributes.size.array[ i ] = 14 + 13 * Math.sin( 0.1 * i + time );


                            }


                            attributes.position.needsUpdate = true;


                        }




                    }
                })




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


        if(move_second_over&&move_third!=true){



            (function () {



                // for(var i=0;i<holder.children.length;i++){
                //
                //     for(var j=0;j<holder.children[i].children.length;j++){
                //
                //         for(var k=0;k<holder.children[i].children[j].children.length;k++){
                //
                //             holder.children[i].children[j].children[k].position.x  += (2+i*j*k)*Math.random()*1;
                //             holder.children[i].children[j].children[k].position.y  += (2+i*j*k)*Math.random()*0.1;
                //             holder.children[i].children[j].children[k].position.z  += (2+i*j*k)*Math.random()*10;
                //         }
                //     }
                // }


                if(holder.position.y<100){
                    holder.position.y+=5;
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

    function animatecanvasText(){
        animateRunning = true;
        var thisTime = new Date();
        context.clearRect(0,0,canvasText.width , canvasText.height);


        dots.map(function (v,index){
            var dot = v;

            if(derection){

                if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z)<0.1) {



                    dot.x = dot.dx;
                    dot.y = dot.dy;
                    dot.z = dot.dz;
                    if(thisTime - lastTime > time_text) derection = false;
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
                if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z)<0.1) {
                    dot.x = dot.tx;
                    dot.y = dot.ty;
                    dot.z = dot.tz;
                    pause = true;
                } else {

                    dot.x = dot.x + (dot.tx - dot.x) * 0.1;
                    dot.y = dot.y + (dot.ty - dot.y) * 0.1;
                    dot.z = dot.z + (dot.tz - dot.z) * 0.1;
                    pause = false;
                }

                // dot.x = dot.x + (dot.tx - dot.x) * 0.1;
                // dot.y = dot.y + (dot.ty - dot.y) * 0.1;
                // dot.z = dot.z + (dot.tz - dot.z) * 0.1;
                // //打乱
                // pause = false;
            }
            dot.paint();
        });





    }



    function addCubes() {

        cubesGroup1 = new THREE.Group();




        for (var i=0;i<8;i++){
            var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,opacity:0.9});

            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            cube.position.set(i*100-280,-1000-HEIGHT/2,100);
            cube.rotation.set(10,10,10)

            cubesGroup1.add(cube);
        }



        var light4 = new THREE.DirectionalLight(0xffffff,0.3);
        light4.position.set(-300,-2000,100);
        light4.name = "lightDirectional_3"

        scene.add(light4);


        var light5 = new THREE.DirectionalLight(0xffffff,0.5);
        light5.position.set(-100,10,10);
        light5.name = "lightDirectional_3"

        scene.add(light5);

        scene.add(cubesGroup1);

    }


    function addX() {


        x_group = new THREE.Group();
        var sphere_x = new THREE.Group();

        x_group.name = "x_group";

        x_group.position.set(0,0,0);

        var size = 300;

        // x_opacity = 1 + Math.sin(new Date().getTime() * .0025);
        var textX = new THREE.TextGeometry( "X", {
            font: font,
            size: size,
            height: 0.3*size,


        });
        x_opacity = 0.9;
         var materials2 = [
            new THREE.MeshLambertMaterial( { color: 0xffffff ,transparent:true,opacity: 1,} ), // front
            new THREE.MeshLambertMaterial( { color: 0x8c8c8c,transparent:true,opacity: 1 } ) // side
        ];



        var   textMesh1 = new THREE.Mesh( textX, materials2 );

        textMesh1.position.x = -WIDTH/5;
        textMesh1.rotation.x = (Math.PI * 2*30)/360;
        textMesh1.rotation.y = -(Math.PI * 2*30)/360;



        textMesh1.position.y = 0;
        textMesh1.position.z = 0;


        x_group.add(textMesh1);

        var x_sphere_z = 50;

        var sphereGeometry = new THREE.SphereGeometry(15, 64, 64);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,opacity:1});

        for(var i=0;i<6;i++){

            var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            sphere.position.x=0;
            sphere.position.y=0;
            sphere.position.z=x_sphere_z;
            sphere_x.add(sphere);
        }

        // console.log(sphere_x)
        var x_radia =  200;

        sphere_x.children[0].position.x = -Math.sqrt(x_radia*x_radia-(x_radia/2)*(x_radia/2));
        sphere_x.children[0].position.z = -x_radia/2;



        sphere_x.children[1].position.x = -Math.sqrt(x_radia*x_radia-(x_radia/2)*(x_radia/2));
        sphere_x.children[1].position.z = x_radia/2;

        sphere_x.children[2].position.x = 0;
        sphere_x.children[2].position.z = x_radia;

        sphere_x.children[3].position.x = Math.sqrt(x_radia*x_radia-(x_radia/2)*(x_radia/2));
        sphere_x.children[3].position.z = x_radia/2;


        sphere_x.children[4].position.x = Math.sqrt(x_radia*x_radia-(x_radia/2)*(x_radia/2));
        sphere_x.children[4].position.z = -x_radia/2;


        sphere_x.children[5].position.x = 0;
        sphere_x.children[5].position.z = -x_radia;


        // debugger;
        var track = new THREE.Mesh( new THREE.RingGeometry (x_radia-1, x_radia+1, 64,1,0,Math.PI * 2),
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
        );
        track.rotation.x = - Math.PI / 2;
        track.position.set(0,0,0);
        track.geometry.verticesNeedUpdate = true;
            sphere_x.add(track);

        sphere_x.rotation.x = 30/360*Math.PI*2




        sphere_x.position.set(0,100,100)

        x_group.add(sphere_x)

        var light3 = new THREE.DirectionalLight(0xffffff,1);
        light3.position.set(-100,10,10);
        light3.name = "lightDirectional_3"

        scene.add(light3);
        scene.add(x_group);


        move_four = true;
        // window.track = track;
        // window.sphere_x = sphere_x;
        // window.x_group = x_group;
        //
        //
        //
        // window.scene = scene
        // console.log(scene);
        // window.x_group = x_group

        // textMesh1.rotation.x = 0;
        // textMesh1.rotation.y = Math.PI * 2;


    }
    
    function pixi() {
         app = new PIXI.Application(WIDTH, HEIGHT, {backgroundColor: "none",transparent: true});
         document.getElementById("end").appendChild(app.view);
    }

    function addcubeOpen(i) {



         $("#end").html("");

        var str = "<div id='end-"+i+"'></div>"
        $("#end").append(str);
        document.getElementById("end-"+i).appendChild(app.view);
        cube_num =i


        var frames = [];

        for (var i = 0; i < 39; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('images/cube/box0' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = app.renderer.width / 2;
        anim.y = app.renderer.height / 2+100;

        var obj = {}
        obj.y = (app.renderer.height / 2+100-((6-cube_num)*150));

        var tween = new TWEEN.Tween(anim).to(obj,300).onUpdate(function () {




            anim.y = this.y;
            // x_group.position.x = this.x;
            // x_group.position.y = this.y;
            // x_group.rotation.y = 100;

        }).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {

        });

        // debugger;
        tween.start();


        anim.scale.x=cube_num/10;
        anim.scale.y=cube_num/10;
        anim.anchor.set(0.5);
        anim.animationSpeed = 1;
        anim.loop = false;
        anim.play();

        anim.onComplete=function (i) {


            if(cube_num>4){
                addcubeOpen(cube_num-1)
            }else {

                setTimeout(function () {
                    add_routine();
                },2000);
            }



        }
        app.stage.addChild(anim);

        // Animate the rotation
        app.ticker.add(function() {
            // anim.rotation += 0.01;
        });
    }
    function addBreak() {
        // $("#WebGL-output").css("display","none")
        $("#end").css("display","block")


        var frames = [];

        for (var i = 0; i < 79; i++) {
            var val = i < 9 ? '00' + (i+1) : (i < 99?"0"+(i+1):(i+1));

            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(PIXI.Texture.fromImage('images/broken/10' + val + '.png'));
        }

        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        var anim = new PIXI.extras.AnimatedSprite(frames);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = app.renderer.width / 2;
        anim.y = app.renderer.height / 2;
        anim.scale.x=0.5;
        anim.scale.y=0.5;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.loop = false;
        anim.play();




        anim.onComplete=function () {
           
            
            setTimeout(function () {








                // changeValue("积累终将改变未来");
                addCubes();



                for(var j=0;j<cubesGroup1.children.length;j++){

                    positionMove(j,cubesGroup1.children[j],cubeposition2[j],0,0,0,function () {
                        move_third = true;

                    })

                }

                cubesGroup1.rotation.x= -20/360*2*Math.PI;
                cubesGroup1.rotation.y= -30/360*2*Math.PI;
                cubesGroup1.rotation.z= 15/360*2*Math.PI;
                
                
                
                

                setTimeout(function () {
                    var end_cube = 0;
                    move_third_over = true

                    for(var j=0;j<cubesGroup1.children.length;j++){

                        positionMove(j,cubesGroup1.children[j],cubeposition3[j],0,0,0,function (j) {
                            move_third_over = true;
                            end_cube++;
                            if(end_cube==8){

                                scene.children.length = scene.children.length-1;

                                addX()
                                // changeValue("连接一切应对未知");
                                // debugger;



                                setTimeout(function () {



                                    var tween3 = new TWEEN.Tween(x_group.position).to(dis[0],1000).onUpdate(function () {




                                        x_group.position.z = this.z;
                                        // x_group.position.x = this.x;
                                        // x_group.position.y = this.y;
                                        // x_group.rotation.y = 100;

                                    }).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {


                                        scene.children.length -=1;

                                        move_four_over = true;


                                        //    五

                                        // changeValue("开放可以享有更多");
                                        addcubeOpen(6);

                                    });

                                    // debugger;
                                    tween3.start();





                                },time_text*4)


                            }
                        })

                    }





                },6*time_text);
            },1000)



        }
        app.stage.addChild(anim);

        // Animate the rotation
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


    function canvasTextFuc() {
        canvasText = document.getElementById("cas");
        context = canvasText.getContext('2d');
        focallength = WIDTH;

         dots = getimgData("从0和1的世界出发");;
         pause = false;

         initAnimate();


        //计算帧速率

         derection = true;



    }

    function changeValue(changeValue){

        // pause = true;
        //
        if(!pause) return;
        // debugger;

        dots = getimgData(changeValue);
        pause = false;
        derection = false;
        // pause = false;
        initAnimate(changeValue);
        derection = true;
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
                if(imgData.data[i] >= 128){
                    place++
                    var dot = new Dot(x-0.5 , y-0.5 , 0 , 0.5);
                    dots.push(dot);
                }
            }
        }

       console.log( dots.length)
        return dots;
    }

    function drawText(text){
        context.clearRect(0,0,canvasText.width , canvasText.height);
        context.save()
        context.font = "18px 微软雅黑";
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


    function movediv() {
        addBreak()
    }

})(jQuery)