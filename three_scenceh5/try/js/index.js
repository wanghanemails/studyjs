/**
 * Created by wanghan on 17/9/14.
 */
(function ($) {

    var scene,camera,
        renderer,
        aspectRatic,
        neardis,
        fardis,
        WIDTH,
        HEIGHT,
        camera_field_view,
        range,
        cloud,
        geom,
        holder,
        text_group ,
        font,
        time_add = 0
    ;
    var move_second = false;
    var move_second_over = false;


    var COLORS = {
        white : "0xffffff",
        black : "0x000000",

    }
    var ponits = [];

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
        setTimeout(function () {
            move_second = true;
        //标记开始旋转

            setTimeout(function () {
                //标记结束打散

                move_second_over = true
            },2000);
        },3000);
        

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
            scene.fog = new THREE.Fog(0x000000,-1000, -2000);

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

            document.getElementById("WebGL-output").appendChild(renderer.domElement)


        createPonits();

    //        允许阴影。
    }

    function createPonits() {

        var ponits_1 = createOnePonit("ponits-1",5,true,1,true);

        scene.add(ponits_1)
    }

    function createOnePonit (name,size,transparent,opacity,sizeAttenuation) {

        // debugger


         geom = new THREE.Geometry();

        var mytexture = new THREE.ImageUtils.loadTexture("dots.png");

        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            sizeAttenuation:sizeAttenuation,
            // map:mytexture
            color:0xffffff,
            vertexColors:true,
            map:mytexture

        });



         range = -10000;
        for ( var zpos= 0; zpos < 1000; zpos++) {

            var particle = new THREE.Vector3(Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * range);

            geom.vertices.push(particle);
            geom.colors[zpos] = new THREE.Color(0xffffff)

            ponits.push(particle);
        }


        // geom.normalize ();
        cloud = new THREE.Points(geom, material);
        cloud.name = name;
        // cloud.sortParticles = true;

        cloud.sortParticles = true
        // 允许粒子系统对粒子排序

        cloud.FrustrumCulled = true

        // scene.add(cloud)
        return cloud;


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

        var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        dirLight.position.set( 0, 0, 1 ).normalize();
        scene.add( dirLight );

        var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
        pointLight.position.set( 0, 100, 90 );
        scene.add( pointLight );
        pointLight.color.setHSL( Math.random(), 1, 0.5 );





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
        requestAnimationFrame(animate);
        render();
    }
    
    function render() {
        renderer.clear();
        renderer.render(scene,camera);
    }

    function animate_bg() {

        var vertices = geom.vertices;

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




            for(var i=0;i<holder.children.length;i++){
                //旋转dna
                if(i==0){
                    holder.children[i].rotation.y += 0.01;
                }else {
                    holder.children[i].rotation.y -= 0.02;
                }

            }
            dna.rotation.y += 0.01;
        }else{
            vertices.forEach(function (v) {

                if(v.z>=1000){

                    v.setZ(range);
                }else {

                    v.setZ(v.z+HEIGHT/2*0.05);
                }

                //    很关键。。。。。各种找
                cloud.geometry.verticesNeedUpdate = true;

            });


        }

        if(holder.position.z<900){
            holder.position.z+=50*0.9;
        }else {

        }


        if(move_second_over){



            (function () {



                for(var i=0;i<holder.children.length;i++){

                    for(var j=0;j<holder.children[i].children.length;j++){

                        for(var k=0;k<holder.children[i].children[j].children.length;k++){

                            holder.children[i].children[j].children[k].position.x  += (1+i*j*k)*Math.random();
                            holder.children[i].children[j].children[k].position.y  += (1+i*j*k)*Math.random();
                            holder.children[i].children[j].children[k].position.z  += (1+i*j*k)*Math.random();
                        }
                    }
                }
            })()

        }


    }

})(jQuery)