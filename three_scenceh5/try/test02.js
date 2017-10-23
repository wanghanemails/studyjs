/**
 * Created by wanghan on 17/10/23.
 */
document.getElementById("ifeng_share_title").innerHTML = shareTitle;
document.getElementById("ifeng_share_thumbnail").innerHTML = shareIcon;
document.getElementById("ifeng_share_description").innerHTML = shareContent;
document.getElementById("ifeng_share_url").innerHTML = shareLink;
window.addEventListener("touchmove", function(a) {
    a.preventDefault()
}, {
    passive: !1
});
window.RAF = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(a) {
            window.setTimeout(a, 1E3 / 60)
        }
}();
/iPad|iPhone|iPod|ios/i.test(navigator.userAgent) || Detector.webgl || alert("\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u63013d\uff0c\u8bf7\u9000\u51fa\u540e\u91cd\u8bd5\uff0c\u6216\u8005\u5c1d\u8bd5\u4f7f\u7528\u5176\u4ed6\u6d4f\u89c8\u5668\u89c2\u770b");
if (/MicroMessenger/.test(navigator.userAgent)) {
    var jsonpUrl = shareLink.replace(/%/g, "%25").replace(/\+/g, "%2B").replace(/ /g, "%20").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/&/g, "%26").replace(/=/g, "%3D");
    Vue.http.jsonp("https://api.3g.ifeng.com/weishare_token_api?url=" + jsonpUrl).then(function(a) {
        var b = {
            debug: !1
        };
        b.appId = a.body.appId;
        b.timestamp = a.body.timestamp;
        b.nonceStr = a.body.nonceStr;
        b.signature = a.body.signature;
        b.jsApiList = ["onMenuShareAppMessage", "onMenuShareTimeline", "onMenuShareQQ", "onMenuShareQZone"];
        wx.config(b);
        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: shareTitle,
                desc: shareContent,
                link: shareLink,
                imgUrl: shareIcon
            });
            wx.onMenuShareQZone({
                title: shareTitle,
                desc: shareContent,
                link: shareLink,
                imgUrl: shareIcon
            });
            wx.onMenuShareQQ({
                title: shareTitle,
                desc: shareContent,
                link: shareLink,
                imgUrl: shareIcon
            });
            wx.onMenuShareTimeline({
                title: shareTitle,
                link: shareLink,
                imgUrl: shareIcon
            })
        })
    }, function(a) {})
}
var isAndroid = /Android 1|Android 2|Android 3|Android 4|Android 5/.test(navigator.userAgent),
    isIfeng = !1,
    camera, scene, renderer, composer, dot, mouseX = 0,
    mouseY = 0,
    skyMesh, camera2, lookPos, object, particleSystem, randomPos, dotSystem, positions3, randomLength = isAndroid ? 4E3 : 1E4,
    touchY = 0,
    disY = 0,
    loaded = [{
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: 173,
            y: 10,
            z: 100
        }
    }, {
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: 173,
            y: 20,
            z: -100
        }
    }, {
        light: 0,
        a: 0,
        type: 0,
        pos: {
            x: 0,
            y: 10,
            z: -200
        }
    }, {
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: -173,
            y: 20,
            z: -100
        }
    }, {
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: -173,
            y: 10,
            z: 100
        }
    }, {
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: 0,
            y: 20,
            z: 200
        }
    }, {
        light: 0,
        a: 0,
        type: 1,
        pos: {
            x: 50,
            y: 50,
            z: -100
        }
    }],
    app = new Vue({
        el: "#app",
        data: {
            ua: "",
            isMobile: !0,
            loading: !0,
            pcImg: "",
            width: 375,
            height: 603,
            left: 0,
            bottom: 0,
            maxWidth: 375,
            fontSize: 20,
            funBottom: "0",
            funTop: "auto",
            funShow: !1,
            funLiked: !1,
            likeNum: 1,
            share: !1,
            isWeixin: /MicroMessenger/.test(navigator.userAgent),
            gameStart: !1,
            played: !1,
            nowWork: -1,
            active: -1,
            light: 0,
            animating: !1,
            animating2: 0,
            nowLen: isAndroid ? 18E3 : 3E4,
            position2: null,
            delay: [],
            loadEnd: !1,
            footer: !1,
            dataInfo: [{
                title: "\u6838\u5fc3",
                lead: "\u4e07\u5c71\u78c5\u7934\u5fc5\u6709\u4e3b\u5cf0\uff0c\u9f99\u886e\u4e5d\u7ae0\u4f46\u631a\u4e00\u9886",
                text: "\u5173\u952e\u65f6\u671f\u6709\u5173\u952e\u62c5\u5f53\uff0c\u201c\u4ee5\u4e60\u8fd1\u5e73\u4e3a\u6838\u5fc3\u7684\u515a\u4e2d\u592e\u201d\u5199\u5165\u5341\u516b\u5c4a\u516d\u4e2d\u5168\u4f1a\u516c\u62a5\u3002\u300a\u4eba\u6c11\u65e5\u62a5\u300b\u793e\u8bba\u6307\u51fa\uff1a\u660e\u786e\u4e60\u8fd1\u5e73\u7684\u6838\u5fc3\u5730\u4f4d\u662f\u515a\u548c\u56fd\u5bb6\u6839\u672c\u5229\u76ca\u6240\u5728\u3002"
            }, {
                title: "\u5f3a\u519b",
                lead: "\u80fd\u6218\u65b9\u80fd\u6b62\u6218\uff0c\u51c6\u5907\u6253\u624d\u53ef\u80fd\u4e0d\u5fc5\u6253\uff0c\u8d8a\u4e0d\u80fd\u6253\u8d8a\u53ef\u80fd\u6328\u6253\uff0c\u8fd9\u5c31\u662f\u6218\u4e89\u4e0e\u548c\u5e73\u7684\u8fa9\u8bc1\u6cd5\u3002",
                text: "\u65e0\u8bba\u662f\u6307\u6325\u673a\u6784\u8fd8\u662f\u4f5c\u6218\u90e8\u961f\uff1b\u65e0\u8bba\u662f\u6b7c\uff0d20\u8fd8\u662f\u56fd\u4ea7\u822a\u6bcd\uff1b\u65e0\u8bba\u662f\u5212\u8bbe\u4e1c\u6d77\u9632\u7a7a\u8bc6\u522b\u533a\u8fd8\u662f\u5357\u6d77\u5e38\u6001\u5316\u6218\u6597\u5de1\u822a\uff1b5\u5e74\u6765\uff0c\u89e3\u653e\u519b\u5728\u6307\u6325\u3001\u88c5\u5907\u3001\u5b9e\u6218\u8bad\u7ec3\u4e0a\u53d1\u751f\u4e86\u7ffb\u5929\u8986\u5730\u7684\u5de8\u53d8\u3002"
            }, {
                title: "\u6cbb\u515a",
                lead: "\u529e\u597d\u4e2d\u56fd\u7684\u4e8b\u60c5\uff0c\u5173\u952e\u5728\u515a\uff0c\u5173\u952e\u5728\u515a\u8981\u7ba1\u515a\u3001\u4ece\u4e25\u6cbb\u515a\u3002",
                text: "5\u5e74\u6765\u5468\u6c38\u5eb7\u3001\u8584\u7199\u6765\u3001\u90ed\u4f2f\u96c4\u3001\u5f90\u624d\u539a\u7b49200\u591a\u540d\u9ad8\u7ea7\u9886\u5bfc\u5e72\u90e8\u88ab\u5ba1\u67e5\uff0c100\u591a\u4e07\u4eba\u56e0\u8fdd\u7eaa\u8fdd\u89c4\u53d7\u5230\u7ec4\u7ec7\u5904\u7406\u3002\u6253\u864e\u3001\u62cd\u8747\u3001\u730e\u72d0\u3001\u53cd\u8150\u529b\u5ea6\u548c\u51b3\u5fc3\u524d\u6240\u672a\u6709\uff0c\u4f5c\u98ce\u7684\u8f6c\u53d8\u6709\u76ee\u5171\u7779\u3002"
            }, {
                title: "\u6df1\u6539",
                lead: "\u4e0d\u662f\u63a8\u8fdb\u4e00\u4e2a\u9886\u57df\u6539\u9769\uff0c\u4e5f\u4e0d\u662f\u63a8\u8fdb\u51e0\u4e2a\u9886\u57df\u6539\u9769\uff0c\u800c\u662f\u63a8\u8fdb\u6240\u6709\u9886\u57df\u6539\u9769",
                text: "5\u5e74\u6765\uff0c\u4e2d\u56fd\u6380\u8d77\u4e86\u65b0\u4e00\u8f6e\u6539\u9769\u7684\u98ce\u66b4\u3002\u50cf\u201c\u8bc1\u660e\u4f60\u5988\u662f\u4f60\u5988\u201d\u8fd9\u7c7b\u201c\u5947\u8469\u8bc1\u660e\u201d\u51cf\u5c11\u4e86800\u4f59\u9879\uff0c\u5b9e\u65bd\u4e8630\u591a\u5e74\u7684\u72ec\u751f\u5b50\u5973\u653f\u7b56\u6b63\u5f0f\u7ed3\u675f\u3001\u5168\u9762\u4e8c\u5b69\u65f6\u4ee3\u6b63\u5f0f\u5f00\u542f\u2026\u2026"
            }, {
                title: "\u5916\u4ea4",
                lead: "\u4ee5\u4e2d\u56fd\u65b9\u6848\u89e3\u51b3\u4e16\u754c\u95ee\u9898\uff0c\u5728\u4e16\u754c\u8303\u56f4\u5b88\u62a4\u4e2d\u56fd\u5229\u76ca\u3002",
                text: "\u63d0\u51fa\u201c\u4e00\u5e26\u4e00\u8def\u201d\u5021\u8bae\u3001\u53ec\u96c670\u4f59\u4e2a\u56fd\u5bb6\u521b\u5efa\u3001\u8fd0\u8425\u4e9a\u6295\u884c\u3001\u63a8\u52a8\u300a\u5df4\u9ece\u534f\u5b9a\u300b\u8fbe\u6210\u3001\u6210\u529f\u4e3e\u529eG20\u5cf0\u4f1a\uff0c\u4ece\u4e5f\u95e8\u3001\u5c3c\u6cca\u5c14\u3001\u5357\u82cf\u4e39\u7b49\u5730\u53ca\u65f6\u64a4\u4fa8\u2026\u20265\u5e74\u6765\uff0c\u4e2d\u56fd\u5728\u4e16\u754c\u4e0a\u7684\u58f0\u97f3\u66f4\u52a0\u54cd\u4eae\uff0c\u4e2d\u56fd\u5728\u6d77\u5916\u7684\u5229\u76ca\u5f97\u5230\u66f4\u597d\u7684\u4fdd\u62a4\u3002"
            }, {
                title: "\u6276\u8d2b",
                lead: "\u5c0f\u5eb7\u8def\u4e0a\u4e00\u4e2a\u90fd\u4e0d\u80fd\u6389\u961f\uff01",
                text: "\u8fd1\u5e74\u6765\uff0c\u4e2d\u56fd\u6253\u51fa\u4e86\u8131\u8d2b\u653b\u575a\u7684\u5386\u53f2\u6700\u4f73\u6218\u7ee9\u3002\u5728\u8fc7\u53bb\u7684\u4e94\u5e74\u91cc\uff0c\u5e73\u5747\u6bcf\u4e09\u79d2\uff0c\u5c31\u6709\u4e00\u4eba\u8de8\u8fc7\u8d2b\u56f0\u7ebf\uff0c\u57281400\u591a\u4e2a\u65e5\u591c\u91cc\uff0c\u603b\u5171\u67095564\u4e07\u4eba\u6446\u8131\u8d2b\u56f0\uff0c\u8fd9\u76f8\u5f53\u4e8e\u4e00\u4e2a\u4e2d\u7b49\u56fd\u5bb6\u7684\u4eba\u53e3\u603b\u6570\u3002"
            }],
            key: 1
        },
        methods: {
            resize: function() {
                this.ua = navigator.userAgent.toLowerCase();
                this.isMobile = /ipad|iphone|ipod|ios|android|symbianos|windows phone|miuibrowser|meego|blackberry/i.test(this.ua) || !! navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
                this.width = document.body.offsetWidth;
                this.height = window.innerHeight;
                this.isMobile ? (this.fontSize = Math.round(this.width / 750 * 40), this.funBottom = "0", this.funTop = "5%") : (this.funShow = !0, this.fontSize = 20, this.funBottom = "6%", this.funTop = "auto");
                this.gameStart && (camera.aspect = window.innerWidth / window.innerHeight, camera.updateProjectionMatrix(), renderer.setSize(window.innerWidth, window.innerHeight), composer.setSize(window.innerWidth, window.innerHeight))
            },
            funLike: function() {
                this.funShow = !0;
                this.funLiked || (this.funLiked = !0, this.likeNum++, this.$http.jsonp("https://survey.news.ifeng.com/accumulator_ext.php?key=" + thisHref).then(function() {}, function(a) {}))
            },
            openComment: function() {
                window.open(commentUrl)
            },
            funShare: function() {
                isIfeng ? window.ground.openShare(shareLink, shareTitle, shareContent, shareIcon, "") : this.share = !0
            },
            funHide: function(a) {
                0 > a.target.className.toString().indexOf("fun") && this.funShow && this.isMobile && (this.funShow = !1)
            },
            download: function() {
                if (isIfeng) return !1;
                this.isWeixin || navigator.userAgent.match(/QQ\//) || navigator.userAgent.match(/WeiBo/i) ? window.open("http://a.app.qq.com/o/simple.jsp?pkgname=com.ifeng.news2&ckey=CK1358442699874") : window.open("http://statistics.appstore.ifeng.com/index.php/api/godownload?app_id=4&d_ch=7439")
            },
            musicPlay: function() {
                musicPlayed || (musicPlayed = !0, bgm.play())
            },
            init: function() {
                renderer = new THREE.WebGLRenderer({
                    antialias: !1
                });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.autoClear = !1;
                document.getElementById("mainBox").appendChild(renderer.domElement);
                object = new THREE.Object3D;
                camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2E3);
                camera.position.set(0, 350, 500);
                camera2 = 0;
                lookPos = new THREE.Vector3(0, 200, 0);
                scene = new THREE.Scene;
                scene.fog = new THREE.FogExp2(1927518, 0);
                scene.add(new THREE.AmbientLight(1320786));
                var a = new THREE.PointLight(66582, 3, 1200, 1);
                a.position.set(0, 200, 180);
                object.add(a);
                object.add(camera);
                scene.add(object);
                a = new THREE.TextureLoader;
                dot = a.load("http://p0.ifengimg.com/l/2017/42/8820103bf1b0c33/dot.png");
                var b = this;
                a.load("http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/starsmap.jpg", function(a) {
                    a = {
                        color: {
                            value: new THREE.Color(1320786)
                        },
                        texture: {
                            value: a
                        }
                    };
                    a = new THREE.ShaderMaterial({
                        uniforms: a,
                        vertexShader: document.getElementById("skyvertex").textContent,
                        fragmentShader: document.getElementById("skyfragment").textContent,
                        side: THREE.BackSide
                    });
                    var c = new THREE.SphereBufferGeometry(800, 10, 10);
                    skyMesh = new THREE.Mesh(c, a);
                    scene.add(skyMesh);
                    b.loadAssetsEnd()
                });
                for (a = 0; a < loaded.length; a++) loaded[a].type ? this.loadModel(a) : this.drawImgs(a);
                var a = new THREE.BufferGeometry,
                    c = new THREE.ShaderMaterial({
                        uniforms: {
                            texture: {
                                value: dot
                            }
                        },
                        vertexShader: document.getElementById("randomdotshader").textContent,
                        fragmentShader: document.getElementById("randomdotfragment").textContent,
                        blending: THREE.AdditiveBlending,
                        transparent: !0
                    });
                positions3 = new Float32Array(3 * randomLength);
                for (var d = new Float32Array(randomLength), f = 0, e = 0; f < randomLength; f += 3, e++) positions3[f] = 500 * (2 * Math.random() - 1), positions3[f + 1] = 500 * Math.random(), positions3[f + 2] = 500 * (2 * Math.random() - 1), d[e] = 2 * Math.random() + 2;
                a.addAttribute("position", new THREE.BufferAttribute(positions3, 3));
                a.addAttribute("size", new THREE.BufferAttribute(d, 1));
                dotSystem = new THREE.Points(a, c);
                scene.add(dotSystem);
                composer = new THREE.EffectComposer(renderer);
                a = new THREE.RenderPass(scene, camera);
                c = new THREE.BloomPass(.8);
                d = new THREE.ShaderPass(THREE.FocusShader);
                d.uniforms.screenWidth.value = window.innerWidth;
                d.uniforms.screenHeight.value = window.innerHeight;
                d.uniforms.waveFactor.value = .00125;
                d.renderToScreen = !0;
                composer.addPass(a);
                composer.addPass(c);
                composer.addPass(d);
                this.isMobile || document.addEventListener("mousemove", this.onDocumentMouseMove, !1);
                window.addEventListener("touchstart", this.cStart, !1);
                window.addEventListener("touchmove", this.cMove, !1);
                window.addEventListener("touchend", this.cEnd, !1);
                this.gameStart = !0
            },
            drawImgs: function(a) {
                loaded[a].e = new Float32Array(this.nowLen);
                loaded[a].d = modelData[a].vertices.length;
                for (var b = 0; b < loaded[a].d; b += 3) this.isMobile ? (loaded[a].e[b] = modelData[a].vertices[b] + loaded[a].pos.x, loaded[a].e[b + 1] = modelData[a].vertices[b + 1] + loaded[a].pos.y) : (loaded[a].e[b] = 1.25 * modelData[a].vertices[b] + loaded[a].pos.x, loaded[a].e[b + 1] = 1.25 * modelData[a].vertices[b + 1] + loaded[a].pos.y), loaded[a].e[b + 2] = 40 * Math.random() - 20 + loaded[a].pos.z;
                for (var b = loaded[a].d, c; b < this.nowLen; b += 3) {
                    do c = Math.ceil((loaded[a].d - 2) * Math.random());
                    while (0 !== c % 3);
                    loaded[a].e[b] = loaded[a].e[c];
                    loaded[a].e[b + 1] = loaded[a].e[c + 1];
                    loaded[a].e[b + 2] = 40 * Math.random() - 20 + loaded[a].pos.z
                }
                loaded[a].a = 1;
                this.loadAssetsEnd()
            },
            loadModel: function(a) {
                var b = new THREE.BufferGeometry,
                    c = new Float32Array(modelData[a].vertices.length);
                c.set(modelData[a].vertices);
                b.addAttribute("position", new THREE.BufferAttribute(c, 3));
                c = (new THREE.Matrix4).makeScale(2, 2, 2);
                this.isMobile || (c = (new THREE.Matrix4).makeScale(2.5, 2.5, 2.5));
                b.applyMatrix(c);
                0 === a ? b.applyMatrix((new THREE.Matrix4).makeRotationY(Math.PI / 4)) : 1 === a ? b.applyMatrix((new THREE.Matrix4).makeRotationY(Math.PI / 2)) : 3 === a ? b.applyMatrix((new THREE.Matrix4).makeRotationY(-Math.PI / 2)) : 4 === a ? b.applyMatrix((new THREE.Matrix4).makeRotationY(-Math.PI / 4)) : 6 === a && b.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI / 4));
                b.applyMatrix((new THREE.Matrix4).makeTranslation(loaded[a].pos.x, loaded[a].pos.y, loaded[a].pos.z));
                loaded[a].c = b.attributes.position.array;
                loaded[a].d = modelData[a].vertices.length;
                loaded[a].a = 1;
                this.loadAssetsEnd()
            },
            loadAssetsEnd: function() {
                for (var a = 0, b = 0; b < loaded.length; b++) loaded[b].a && a++;
                a === loaded.length && !this.played && skyMesh && (this.played = !0, this.createParticle())
            },
            createParticle: function() {
                for (var a = this, b = new THREE.BufferGeometry, c = this.nowLen, d = 0; d < loaded.length; d++) if (loaded[d].type) {
                    var f = loaded[d].c;
                    loaded[d].e = new Float32Array(c);
                    for (var e = 0, g = 0; e < loaded[d].d; e += 3, g++) loaded[d].e[e] = f[e], loaded[d].e[e + 1] = f[e + 1], loaded[d].e[e + 2] = f[e + 2];
                    e = loaded[d].d;
                    for (g = 0; e < c; e += 3) {
                        do g = Math.ceil((loaded[d].d - 2) * Math.random());
                        while (0 !== g % 3);
                        loaded[d].e[e] = f[g];
                        loaded[d].e[e + 1] = f[g + 1];
                        loaded[d].e[e + 2] = f[g + 2]
                    }
                }
                d = {
                    color: {
                        value: new THREE.Color(16777215)
                    },
                    texture: {
                        value: dot
                    }
                };
                d = new THREE.ShaderMaterial({
                    uniforms: d,
                    vertexShader: document.getElementById("vertexshader").textContent,
                    fragmentShader: document.getElementById("fragmentshader").textContent,
                    blending: THREE.AdditiveBlending,
                    transparent: !0
                });
                f = new Float32Array(c / 3);
                e = new Float32Array(c / 3);
                for (g = 0; g < c; g++) f[g] = 2, e[g] = 1;
                this.position2 = new Float32Array(c);
                b.addAttribute("size", new THREE.BufferAttribute(f, 1));
                b.addAttribute("val", new THREE.BufferAttribute(e, 1));
                particleSystem = new THREE.Points(b, d);
                particleSystem.position.y = 200;
                scene.add(particleSystem);
                setTimeout(function() {
                    randomPos = new Float32Array(c);
                    for (var b = 0, d = 0; b < c; b += 3, d++) randomPos[b] = 600 * Math.random() - 300, randomPos[b + 1] = 600 * Math.random() - 300, randomPos[b + 2] = 600 * Math.random() - 300;
                    particleSystem.geometry.addAttribute("position", new THREE.BufferAttribute(randomPos, 3));
                    particleSystem.geometry.attributes.position.needsUpdate = !0;
                    a.loadEnd = !0;
                    window.addEventListener("wheel", a.wheelStart);
                    window.addEventListener("mousewheel", a.wheelStart);
                    window.addEventListener("DOMMouseScroll", a.wheelStart)
                }, 100)
            },
            wheelStart: function(a) {
                this.animating || (0 < a.deltaY ? this.changeActive(this.nowWork + 1) : this.changeActive(this.nowWork - 1))
            },
            changeActive: function(a) {
                if (!this.animating2 && this.loadEnd && this.nowLen) if (!this.footer && (!this.isMobile && 6 === this.light || this.isMobile && 6 === a)) this.footer = !0, this.animating2 = 1, camera2 = 2 * Math.PI, this.changeParticle(6);
                else {
                    if (this.footer) {
                        this.footer = !1;
                        for (var b = this.light = 0; 6 > b; b++) loaded[b].light = 0
                    }
                    this.nowWork = 5 < a ? -1 : -1 > a ? 5 : a;
                    this.animating2 = 1;
                    camera2 = Math.PI / 3 * (this.nowWork + 1);
                    this.changeParticle(this.nowWork)
                }
            },
            changeParticle: function(a) {
                if (this.active === a) return !1;
                this.active = a;
                var b = this.nowLen,
                    c = new Float32Array(b),
                    d = particleSystem.geometry.attributes.val.array;
                this.delay = [];
                for (var f = 0, e = 0; f < b; f += 3, e++) c[f] = particleSystem.geometry.attributes.position.array[f] * d[e] + this.position2[f] * (1 - d[e]), c[f + 1] = particleSystem.geometry.attributes.position.array[f + 1] * d[e] + this.position2[f + 1] * (1 - d[e]), c[f + 2] = particleSystem.geometry.attributes.position.array[f + 2] * d[e] + this.position2[f + 2] * (1 - d[e]), d[e] = 1, this.delay.push({
                    time: Math.random()
                });
                particleSystem.geometry.addAttribute("position", new THREE.BufferAttribute(c, 3));
                particleSystem.geometry.attributes.val.needsUpdate = !0;
                if (-1 === a) for (c = 0; c < b; c += 3) this.position2[c] = randomPos[c], this.position2[c + 1] = randomPos[c + 1], this.position2[c + 2] = randomPos[c + 2];
                else if (a < loaded.length) {
                    loaded[a].light = 1;
                    for (c = this.light = 0; 6 > c; c++) loaded[c].light && this.light++;
                    for (c = 0; c < b; c += 3) this.position2[c] = loaded[a].e[c], this.position2[c + 1] = loaded[a].e[c + 1], this.position2[c + 2] = loaded[a].e[c + 2]
                } else for (c = 0; c < b; c += 3) this.position2[c] = randomPos[c], this.position2[c + 1] = randomPos[c + 1], this.position2[c + 2] = randomPos[c + 2];
                particleSystem.geometry.addAttribute("position2", new THREE.BufferAttribute(this.position2, 3));
                this.animating = !0
            },
            getOption: function(a, b, c) {
                return {
                    position: new THREE.Vector3(a, b, c),
                    positionRandomness: .3,
                    velocity: new THREE.Vector3,
                    velocityRandomness: 2,
                    color: 16777215,
                    colorRandomness: .2,
                    turbulence: .5,
                    lifetime: 3,
                    size: 10,
                    sizeRandomness: 10
                }
            },
            onDocumentMouseMove: function(a) {
                mouseX = (a.clientX - this.width / 2) / this.width * 2;
                mouseY = (a.clientY - this.height / 2) / this.height * -2
            },
            cStart: function(a) {
                this.musicPlay();
                this.funHide(a);
                disY = 0;
                touchY = a.touches[0].pageY
            },
            cMove: function(a) {
                disY = a.touches[0].pageY - touchY
            },
            cEnd: function() {
                40 < disY ? -1 < this.active && this.loadEnd && this.nowLen && this.changeActive(this.active - 1) : (-40 > disY || 0 === disY) && this.active < loaded.length - 1 && this.loadEnd && this.nowLen && this.changeActive(this.active + 1)
            },
            animate: function() {
                RAF(this.animate);
                this.loadEnd && (object.rotation.y += .03 * (camera2 - object.rotation.y), 200.5 <= camera.position.y && 400.5 <= camera.position.z && (camera.position.y += .01 * (200 - camera.position.y), camera.position.z += .01 * (400 - camera.position.z)), lookPos.x += .01 * (50 * mouseX - lookPos.x), lookPos.y += .04 * (200 + 50 * mouseY - lookPos.y), camera.lookAt(lookPos));
                for (var a = .005 * Date.now(), b = 0; b < randomLength; b += 3) positions3[b + 1] += b % 5 * (.5 - b % 2) * .1 * Math.sin(b % 100 + a / 10);
                dotSystem.geometry.addAttribute("position", new THREE.BufferAttribute(positions3, 3));
                dotSystem.rotation.y += .001;
                if (this.loadEnd && particleSystem) {
                    if (this.animating) {
                        for (var b = particleSystem.geometry.attributes.val.array, c = !1, d = 0; d < this.delay.length; d++) 0 > this.delay[d].time ? 0 < b[d] ? (b[d] -= .02, c = !0) : b[d] = 0 : (this.delay[d].time -= .02, c = !0);
                        c || (this.animating2 = this.animating = !1);
                        particleSystem.geometry.attributes.val.needsUpdate = !0
                    } else this.animating2 = !1, -1 !== this.active && 6 !== this.active && (particleSystem.rotation.y += .01 * (mouseX / 3 - particleSystem.rotation.y));
                    b = particleSystem.geometry.attributes.size.array;
                    for (c = 0; c < b.length; c++) b[c] = (2 + 1.5 * Math.sin(.02 * c + a)) * this.key;
                    this.key = this.footer ? this.isMobile ? this.key + .008 * (2 - this.key) : this.key + .004 * (3 - this.key) : this.key + .05 * (1 - this.key);
                    particleSystem.geometry.attributes.size.needsUpdate = !0
                }
                renderer.clear();
                composer.render()
            }
        },
        mounted: function() {
            this.resize();
            var a = this;
            this.$http.jsonp("https://survey.news.ifeng.com/getaccumulator_ext.php?key=" + thisHref).then(function(b) {
                a.likeNum = parseInt(b.body.browse) + 86E3
            });
            this.isMobile || (this.pcImg = '<img class="title0 title" src="http://p3.ifengimg.com/l/2017/42/8820103bf1b0c33/title0.png" /><img class="title2 title" src="http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/title2.png" /><img class="title3 title" src="http://p3.ifengimg.com/l/2017/42/8820103bf1b0c33/title3.png" /><img class="title4 title" src="http://p2.ifengimg.com/l/2017/42/8820103bf1b0c33/title4.png" /><img class="line1 line" src="http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/line.png" /><img class="line2 line" src="http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/line.png" /><img class="lead" src="http://p0.ifengimg.com/l/2017/42/8820103bf1b0c33/lead.png" /><img class="text" src="http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/text.png" /><img class="logo" src="http://p1.ifengimg.com/l/2017/42/8820103bf1b0c33/pc-logo.png" />');
            setTimeout(function() {
                if ("undefined" != typeof ground || "undefined" != typeof window.ground) isIfeng = !0;
                a.init();
                a.animate()
            }, 500)
        }
    });
window.onresize = app.resize;