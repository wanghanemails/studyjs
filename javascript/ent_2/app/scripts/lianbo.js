/**
 * Created by wanghan1 on 2017/2/27.
 */
/*
 *  author @ zhaohp
 *  swf  log:
 *   http://y0.ifengimg.com/swf/ifengZhPlayer_v1.0.36.swf
 *   http://y0.ifengimg.com/swf/ifengZhPlayer_v1.0.28.swf
 *  update log:
 *   2016-05-25，增加参数playerCB，条目切换时业务逻辑回调方法，zhaohp
 *   2016-05-26，统一参数名称，zhaohp
 */

var swfUrl = "http://vxml.ifengimg.com/swf/zuhe/zuhePlayer_v1.0.47.swf";

var PlayItems  = function(obj){

    var play = {

        // 初始化播放器配置参数
        initParams : function(){
            //常用配置参数
            this.showDivId = "playerDiv";                                   // flash播放器显示模块id
            this.swfWidth = '400';                                          // flash播放器宽
            this.swfHeight = '300';                                         // flash播放器高
            this.autoPlay = 'true';                                         // 视频自动播放---只有设置为自动播放，this.FirstAutoPlay第一条才能设定是否自动播放
            this.firstAutoPlay = 'true';                                    // 第一条是否自动播放
            this.autoLoop = 'true';                                         // 是否循环播放
            this.subject = "";                                              // 贴片广告参数
            this.postUrl = "";                                              // 海报
            this.playitemcss = "current";                                   // 条目播放中样式
            this.ADOrderFirst = "";                                         // 是否页面打开就播放广告,0不播放，1播放
            this.parentIds = "";                                            // 播放列表结构id列表
            this.index = 0;                                                 // 播放起始索引
            this.playerCB = function(){};                                   // 条目切换时回调方法

            //其他参数
            this.items = [];                                                // 所有条目
            this.itemCount = 0;                                             // 总视频数
            this.curIndex = 0;                                              // 当前播放索引
            this.domain = "v";                                              // 引用频道域名，ent,news,phtv,finance
            this.adUrl = "";                                                // 定向广告地址
            this.preAdurl = "";                                             // 定向前贴片广告地址
            this.noRelatedPage = "";
            this.adType = "";                                               // 默认为2 (专题播放，只有前贴片)，当有preAdurl有效时，会强制转换为0，即自定义广告配置.   =1时，表示内页
            this.ivbAdUrl = "";                                             //adType=0时  有效
            this.postAdUrl = "";                                            //adType=0时  有效
            this.pauseUrl = "";                                             //adType=0时  有效
            this.cornerAdUrl = "";                                          //adType=0时  有效
            this.canShare = "true";

            this.curGuid = '';                                              //缓存当前播放视频guid
            this.remGuid = '';                                              //为统计记录的guid

            if (typeof obj !== 'undefined') {
                for(var o in obj){
                    this[o] = obj[o];
                }
            }else{
                alert('播放器初始化参数错误');
            }
        },

        // 获取频道域名
        getDomain : function() {
            var host = location.host, domain = '';
            var domains = host.split('.');
            if (domains.length >= 3 && host.indexOf("ifeng.com") != -1)
                domain = domains[domains.length - 3];
            return domain;
        },

        // 初始化播放条目
        initItems : function(){
            var _this = this;

            var items = [], count = 0;
            var pid = this.parentIds.split(",");
            for (var a = 0; a < pid.length; a++){           // 计算节点数
                var item = document.getElementById(pid[a]).getElementsByTagName("li");
                for (var i = 0; i < item.length; i++){
                    var videoid = item[i].getAttribute('name');
                    if(videoid && videoid.length==36){
                        items.push(item[i]);
                        count ++ ;
                    }
                }
            }

            for (var i = 0; i < count; i++) {               // 为所有item添加点击事件
                items[i].onclick = function() {
                    for (var j = 0; j < count; j++)
                        if (this == items[j])
                            _this.clickplay(j);
                };
            }

            this.items = items;
            this.itemCount = count;
        },

        // 条目点击播放事件
        clickplay : function(swfindex) {
            this.firstAutoPlay = "true";
            this.ADOrderFirst = "0";
            this.renderPlay(swfindex);
        },

        // 播放条目切换
        renderPlay : function(swfindex) {
            if (this.items.length > 0) {
                var playindex = parseInt(swfindex) % this.itemCount;
                var curritem = this.items[playindex];
                var olditem = this.items[this.curIndex];
                olditem.className = "";
                curritem.className = this.playitemcss;
                this.curIndex = playindex;
                this.changeStream(curritem.getAttribute("name"), playindex);
                this.playerCB.call(this);
            }
        },

        // 播放
        changeStream : function(videoid, playindex) {
            this.curGuid = videoid;

            if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("Android") != -1) // ipad,iphone,android
            {
                var url = "http://dyn.v.ifeng.com/cmpp/video_msg_ipad.js?msg=" + videoid + "&param=playermsg";
                this.loadH5video(url,this);
            } else {

                fo = new FlashWriter({
                    url: swfUrl,
                    width: this.swfWidth,
                    height: this.swfHeight,
                    id: 'fplay'
                });

                if (this.autoPlay == 'true' ) { // 是否自动播
                    if (playindex == this.index && this.firstAutoPlay == "false"){ // 第一条是否自动播放，除第一条外全自动播
                        fo.addVariable("AutoPlay", "false");
                    } else {
                        fo.addVariable("AutoPlay", "true");
                    }
                } else {
                    fo.addVariable("AutoPlay", "false");
                }

                if (this.preAdurl != "") {
                    fo.addVariable('preAdurl', this.preAdurl);
                    fo.addVariable('adType', '0');
                } else {
                    fo.addVariable('adType', '2');
                }

                fo.addVariable('guid', videoid);
                fo.addVariable('from', this.getDomain());
                fo.addVariable('forPlayNum', (parseInt(this.curIndex) + 1)); // 下次播放第几条
                fo.addVariable('ADURL', this.adUrl);
                fo.addVariable('noRelatedPage', this.noRelatedPage);
                fo.addVariable('canShare', this.canShare);
                fo.addVariable('subject', this.subject);
                fo.addVariable('writeby', 'webjs'); //为了兼容以前的专题联播页面。如果source=webjs，表示是js渲染播放器，此时分享功能直接调用脚本方法；否则调用swf自身的分享方法
                fo.addVariable('width', this.swfWidth);
                fo.addVariable('height', this.swfHeight);
                fo.addVariable('postUrl', this.postUrl);
                fo.addVariable('ivbAdUrl', this.ivbAdUrl);
                fo.addVariable('postAdUrl', this.postAdUrl);
                fo.addVariable('pauseUrl', this.pauseUrl);
                fo.addVariable('cornerAdUrl', this.cornerAdUrl);
                fo.addVariable('ADOrderFirst', this.ADOrderFirst);
                fo.addVariable("special", 'true'); // 表示专题引用
                fo.addVariable('PlayerName', "VZHPlayer");
                fo.addParam('allowFullScreen', 'true');
                fo.addParam("wmode", "transparent");
                fo.addParam('allowScriptAccess', 'always');
                // fo.addVariable('guidList', getVideoList(this.items));

                fo.write(this.showDivId);
            }
        },

        // 加载h5播放器
        loadH5video : function(src, _this) {
            var head = document.getElementsByTagName("head")[0];
            var js = document.createElement("script");
            js.setAttribute("src", src);
            js.onload = js.onreadystatechange = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    head.removeChild(js);
                    if (typeof _this['showHTML5Video'] !== 'undefined')
                        _this['showHTML5Video'](playermsg);
                }
            }
            head.appendChild(js);
        },

        // 构造h5播放器并绑定播放、回调、统计事件
        showHTML5Video : function(playermsg) {

            if (typeof(playermsg) != "undefined") {
                var strvideo = '<video  poster = "' + (this.postUrl||playermsg.largePoster) + '" src="' + playermsg.videoplayurl + '" width="' + this.swfWidth + '" height="' + this.swfHeight + '" controls  id="player" />';
                document.getElementById(this.showDivId).innerHTML = strvideo;

                var _this = this;
                var next = parseInt(this.curIndex) + 1;
                var video = document.getElementById('player');
                video.addEventListener("playing", function () {     //注册播放发送统计
                    _this.sendHTML5VideoInfo();
                }, false);
                video.addEventListener("ended", function () {       //注册播放完成回调
                    if(_this.autoLoop == 'true'||(_this.curIndex != _this.itemCount-1)){
                        _this.firstAutoPlay = 'true';
                        _this.renderPlay(next);
                    }
                }, false);

                if (this.autoPlay == 'true'){ // 是否自动播
                    if (this.curIndex != this.index || this.firstAutoPlay == "true"){
                        video.load();
                        video.play();
                    }
                }
            }
        },

        // h5播放器统计
        sendHTML5VideoInfo : function() {
            var sendRequest = function(params) {
                if (typeof params !== 'undefined') {                    // 合并对象。
                    var _merge = function(s, t) {
                        var result = {};

                        if (!t) {
                            return result;
                        }

                        for (var i in s) {
                            result[i] = typeof t[i] !== "undefined" ? t[i] : s[i];
                        }

                        return result;
                    };

                    var url = 'http://stadig.ifeng.com/media.js';
                    var data = _merge({
                        id: '',
                        sid: '',
                        uid: '',
                        from: 'HTML5',
                        provider: 'd5f1032b-fe8b-4fbf-ab6b-601caa9480eb',
                        loc: '', //空
                        cat: '',
                        se: '',
                        ptype: '',
                        vid: 'HTML5Player',
                        ref: '', //域名
                        tm: '' //时间戳
                    }, params);

                    pArr = [];
                    for (var i in data) {
                        pArr.push(i + '=' + encodeURIComponent(data[i]));
                    }
                    var scriptDom = document.createElement('script');
                    url = (pArr.length > 0) ? url + '?' + pArr.join('&') : url;
                    scriptDom.src = url;
                    document.getElementsByTagName("head").item(0).appendChild(scriptDom);
                }
            };

            var getCookie = function(name) {
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                while (i < clen) {
                    var j = i + alen;
                    if (document.cookie.substring(i, j) == arg) {
                        return (function(offset) {
                            var endstr = document.cookie.indexOf(";", offset);
                            if (endstr == -1) {
                                endstr = document.cookie.length;
                            }
                            return decodeURIComponent(document.cookie.substring(offset, endstr));
                        })(j);
                    }
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) break;
                }
                return "";
            };

            if (this.curGuid !== this.remGuid) {
                this.remGuid = this.curGuid;
                var params = {};
                params.id = playermsg.videoid;
                params.sid = getCookie('sid');
                params.uid = getCookie('userid');
                var cid = playermsg.categoryId ? playermsg.categoryId : '';
                var cname = playermsg.columnName;
                params.cat = cid
                params.se = typeof cname !== 'undefined' ? cname : cid;
                params.ptype = cid.substr(0, 4);
                params.ref = window.location.href.replace(/#/g, '$');
                params.tm = new Date().getTime();
                sendRequest(params);
            }

        },

        // flash播放器回调
        swfplay : function(swfindex){
            var _this = window.play;
            if(_this.autoLoop == 'true'||swfindex!=_this.itemCount){
                _this.firstAutoPlay = 'true';
                _this.ADOrderFirst = '0';
                _this.renderPlay(swfindex);
            }
        },

        // 注册全局事件
        regCallback : function(){
            window.swfplay = this.swfplay;  // 播放器回调方法，swf调用js
            window.play = this;
        },

        init : function(){
            this.initParams();
            this.initItems();
            this.renderPlay(this.index);
            this.regCallback();
        }
    }

    return play;
};


/*
 *   新版播放器ifengZhPlayer_v1.0.36.swf已取消分享功能
 */
/* share begin*/
(function(win,doc){
    var share = {
        shareTo:function(site, pic, url, title, smallimg, isflash){
            var _url = encodeURIComponent(url);
            var _title = encodeURIComponent(title);
            var _tp = new Date().getTime();

            var isfalsh = isfalsh || "true"; // 页面调用时，isflash值为false
            var type  = "";
            var shareType = {
                "sinateew": "sina",
                "qqzone": "qqZone",
                "qqteew": "qq"
            };
            if(isfalsh){
                type = "v_" + (shareType[site] || site);    // 播放器分享出去,标识加v
            }else{
                type = shareType[site] || site;
            }

            // 发送分享统计信息
            share.sendTo(type);

            switch (site) {
                case "kaixin":
                    window.open("http://www.kaixin001.com/repaste/share.php?rurl=" + _url + encodeURIComponent("#_share=" + type) + "&rtitle=" + _title);
                    break;

                case "renren":
                    window.open("http://share.renren.com/share/buttonshare.do?link=" + _url + encodeURIComponent("#_share=" + type) + "&title=" + _title);
                    break;

                case "sinateew":
                    var l = (screen.width - 440) / 2;
                    var t = (screen.height - 430) / 2;
                    var _pic = "";
                    var u = "http://v.t.sina.com.cn/share/share.php?appkey=168486312&url=" + _url + encodeURIComponent("?tp=" + _tp + "#_share=" + type) + "&title=" + _title + "&source=ifeng&sourceUrl=http://v.ifeng.com/&content=utf8&pic=" + _pic + "&ralateUid=1806128454";
                    window.open(u, "_blank", "toolbar=0,status=0,resizable=1,width=440,height=430,left=" + l + ",top=" + t);
                    break;

                case "qqzone":
                    window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + _url + encodeURIComponent("?tp=" + _tp + "#_share=" + type));
                    break;

                case "qqteew":
                    var appkey = encodeURI("f8ca1cd768da4529ab190fae9f1bf21d");
                    var _pic = "";
                    var _site = "http://v.ifeng.com";
                    var u = "http://v.t.qq.com/share/share.php?title=" + _title + "&url=" + _url + encodeURIComponent("?tp=" + _tp + "#_share=" + type) + "&appkey=" + appkey + "&site=" + _site + "&pic=" + _pic;
                    window.open(u, "\u8F6C\u64AD\u5230\u817E\u8BAF\u5FAE\u535A", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                    break;

                case "163":
                    var l = (screen.width - 550) / 2;
                    var t = (screen.height - 280) / 2;
                    var u = "http://t.163.com/article/user/checkLogin.do?link=http://www.ifeng.com&source=" + encodeURIComponent("凤凰网") + "&info=" + _title + " " + _url + encodeURIComponent("#_share=" + type) + "&" + _tp;
                    window.open(u, "newwindow", "height=330,width=550,top=" + t + ",left=" + l + ", toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no");
                    break;

                case "feixin":
                    var l = (screen.width - 550) / 2;
                    var t = (screen.height - 280) / 2;
                    var u = "http://space.fetion.com.cn/api/share?Source=" + encodeURIComponent("凤凰视频") + "&Title=" + _title + "&url=" + _url + encodeURIComponent("#_share=" + type) + "&IsEditTitle=false";
                    window.open(u, "newwindow", "top=" + t + ",left=" + l + ", toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no");
                    break;

                case "sohuteew":
                    var l = (screen.width - 660) / 2;
                    var t = (screen.height - 470) / 2;
                    var _pic = "";
                    var u = "http://t.sohu.com/third/post.jsp?url=" + _url + encodeURIComponent("#_share=" + type) + "&title=" + _title + "&content=utf-8" + "&pic=" + _pic;
                    window.open(u, "mb", "toolbar=0,status=0,resizable=1,width=660,height=470,left=" + l + ",top=" + t);
                    break;

                case "51com":
                    var l = (screen.width - 550) / 2;
                    var t = (screen.height - 280) / 2;
                    var u = "http://share.51.com/share/out_share_video.php?from=" + encodeURIComponent("凤凰视频") + "&title=" + _title + "&vaddr=" + _url + encodeURIComponent("#_share=" + type) + "&IsEditTitle=false&charset=utf-8";
                    window.open(u, "newwindow", "top=" + t + ",left=" + l + ", toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no");
                    break;

                case "baiduI":
                    var u = 'http://tieba.baidu.com/i/app/open_share_api?link=' + _url + encodeURIComponent("#_share=" + type);
                    window.open(u);
                    break;

                default:
                    break;
            }

        },
        sendTo:function(type){

            // 参数解析集合
            var operation = {

                // 链接解析
                url : function(type, url){
                    var rst = null;

                    if(typeof url !== 'undefined'){
                        var hIndex = url.indexOf('#'), pIndex = url.indexOf('?');   // 计算hash起始索引、param起始索引
                        var paramStr = '', hashStr = '', uri = '';

                        if(pIndex < hIndex){//param在前，hash在后

                            hashStr = url.substring(hIndex);

                            if(pIndex === -1){//无param
                                paramStr = '';
                                uri = url.substring(0,hIndex);
                            }else{//有param
                                paramStr = url.substring(pIndex,hIndex);
                                uri = url.substring(0,pIndex);
                            }

                        }else if(pIndex > hIndex){//hash在前，param在后

                            paramStr = url.substring(pIndex);

                            if(hIndex === -1){//无hash
                                hashStr = '';
                                uri = url.substring(0,pIndex);
                            }else{//有hash
                                hashStr = url.substring(hIndex,pIndex);
                                uri = url.substring(0,hIndex)
                            }

                        }else {//hash和param不存在
                            uri = url;
                        }

                        if(type == 'param'){
                            rst = paramStr;
                        }

                        if (type == 'hash') {
                            rst = hashStr;
                        }

                        if (type == 'uri') {
                            rst = uri;
                        }
                    }

                    return rst;
                },

                // 字符串解析
                str : function(str, name, val) {
                    var rst = null;

                    if (typeof str !== 'undefined') {
                        var pStrArr = str.split('&');

                        if (str === '' && typeof val !== 'undefined') {
                            rst = name + '=' + val;
                        } else {
                            for (var i = 0; i < pStrArr.length; i++) {
                                var pStr = pStrArr[i];
                                var index = i;
                                var pArr = pStr.split('=');
                                if (pArr[0] === name) {
                                    //获取指定参数值
                                    if (typeof val === 'undefined') {
                                        rst = pArr[1];
                                    } else {
                                        pStrArr[index] = name + '=' + val;
                                        rst = pStrArr.join('&');
                                    }

                                    break;

                                } else if (index === pStrArr.length - 1 && typeof val !== 'undefined') {
                                    rst = str + '&' + name + '=' + val;
                                    break;
                                }
                            }
                        }
                    }

                    return rst;
                },

                // hash处理
                hash : function(hash, name, val) {
                    var op = operation;
                    var rst = null;

                    if (typeof hash !== 'undefined') {

                        if (hash.indexOf('#') === 0) {
                            hash = hash.substr(1);
                        }
                        var hashStrArr = hash.split('#');
                        for (var i = 0; i < hashStrArr.length; i++) {
                            var hashStr = hashStrArr[i];
                            var index = i;
                            var result = op.str(hashStr, name);
                            //获取操作
                            if (typeof val === 'undefined') {

                                if (result !== null) {
                                    rst = result;
                                    break;
                                }

                            } else {

                                if (result !== null) { //存在指定参数
                                    hashStrArr[index] = op.str(hashStr, name, val);
                                    rst = '#' + hashStrArr.join('#');
                                    break;
                                } else if (result === null && index === hashStrArr.length - 1) { //不存在指定参数

                                    if (hash === '') {
                                        rst = '#' + name + '=' + val;

                                    } else {
                                        rst = '#' + hash + '&' + name + '=' + val;
                                    }

                                    break;
                                }
                            }
                        };
                    }

                    return rst;
                },

                //  参数处理
                param : function(paramStr, name, val) {
                    var op = operation;
                    var rst = null;

                    if (typeof paramStr !== 'undefined') {

                        if (paramStr.indexOf('?') === 0) {
                            paramStr = paramStr.substr(1);
                        }
                        //获取操作
                        if (typeof val === 'undefined') {
                            rst = op.str(paramStr, name);
                        } else {
                            rst = '?' + op.str(paramStr, name, val);
                        }
                    }

                    return rst;
                }

            };

            // 构造分享统计信息
            var buildStatisticInfo = function(type) {
                var op = operation;
                var statistic = {};
                statistic.datatype = 'share';
                statistic.value = type;

                var ref = '', uid = '', sid = '';
                var doms = doc.getElementsByTagName("script");
                for (var i = 0; i < doms.length; i++) {
                    var dom = doms[i];
                    if (dom.src.indexOf('http://stadig.ifeng.com/page.js') > -1) {
                        var paramStr = op.url('param', dom.src);
                        ref = op.param(paramStr, 'ref');
                        uid = op.param(paramStr, 'uid');
                        sid = op.param(paramStr, 'sid');
                    }
                }
                statistic.ref = ref || '';
                statistic.uid = uid || '';
                statistic.sid = sid || '';

                var uri = win.location.href;
                var hashStr = op.url('hash', uri), hShare = op.hash(hashStr, '_share');
                var paramStr = op.url('param', uri), pShare = op.param(paramStr, '_share');

                if (pShare !== null) {  //如果参数中含有_share,替换参数值
                    var newParamStr = op.param(paramStr, '_share', type)
                    statistic.uri = uri.replace(paramStr,newParamStr);
                } else {
                    if (hashStr === '') {   //参数不含_share,也不存在hash，直接添加_share作为hash
                        var newHashStr = op.hash(hashStr, '_share', type);
                        statistic.uri = uri + newHashStr;
                    } else {    //参数不含_share,但是已经存在hash
                        if ( hShare!== null) {//如果hash中已经存在_share参数，则替换_share的值
                            var newHashStr = op.hash(hashStr, '_share', type);
                            statistic.uri = uri.replace(hashStr,newHashStr);
                        } else {    //如果hash中不存在_share参数，则在param中添加_share
                            var newParamStr = op.param(paramStr , '_share', type);
                            statistic.uri = uri + newParamStr + hashStr ;
                        }
                    }
                }

                statistic.time = new Date().getTime();

                if (typeof getChannelInfo !== 'undefined') {//频道信息
                    statistic.ci = getChannelInfo();
                }

                if (typeof getStaPara === 'function') {
                    statistic.pt = getStaPara();
                }

                return statistic;
            };

            // 发送统计信息
            var sendStatisticInfo = function(param) {
                var arr = [];
                for(p in param){
                    arr.push(p + '=' + encodeURIComponent( param[p]));
                }
                var url = "http://stadig.ifeng.com/actsta.js?" + arr.join('&');
                var script = doc.createElement('script');
                script.src = url;
                doc.getElementsByTagName("head")[0].appendChild(script);
            };

            var statisticInfo = buildStatisticInfo(type);
            sendStatisticInfo(statisticInfo);
        }
    };

    win.shareTo = share.shareTo;
})(window,document);
/* share end*/