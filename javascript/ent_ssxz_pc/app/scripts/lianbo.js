/**
 * Created by wanghan1 on 2017/2/27.
 */
/*
 *  author @ zhaohp
 *  swf  log:
 *   http://y0.ifengimg.com/swf/ifengZhPlayer_v1.0.36.swf
 *   http://y0.ifengimg.com/swf/ifengZhPlayer_v1.0.28.swf
 *  update log:
 *   2016-05-25�����Ӳ���playerCB����Ŀ�л�ʱҵ���߼��ص�������zhaohp
 *   2016-05-26��ͳһ�������ƣ�zhaohp
 */

var swfUrl = "http://vxml.ifengimg.com/swf/zuhe/zuhePlayer_v1.0.47.swf";

var PlayItems  = function(obj){

    var play = {

        // ��ʼ�����������ò���
        initParams : function(){
            //�������ò���
            this.showDivId = "playerDiv";                                   // flash��������ʾģ��id
            this.swfWidth = '400';                                          // flash��������
            this.swfHeight = '300';                                         // flash��������
            this.autoPlay = 'true';                                         // ��Ƶ�Զ�����---ֻ������Ϊ�Զ����ţ�this.FirstAutoPlay��һ�������趨�Ƿ��Զ�����
            this.firstAutoPlay = 'true';                                    // ��һ���Ƿ��Զ�����
            this.autoLoop = 'true';                                         // �Ƿ�ѭ������
            this.subject = "";                                              // ��Ƭ������
            this.postUrl = "";                                              // ����
            this.playitemcss = "current";                                   // ��Ŀ��������ʽ
            this.ADOrderFirst = "";                                         // �Ƿ�ҳ��򿪾Ͳ��Ź��,0�����ţ�1����
            this.parentIds = "";                                            // �����б�ṹid�б�
            this.index = 0;                                                 // ������ʼ����
            this.playerCB = function(){};                                   // ��Ŀ�л�ʱ�ص�����

            //��������
            this.items = [];                                                // ������Ŀ
            this.itemCount = 0;                                             // ����Ƶ��
            this.curIndex = 0;                                              // ��ǰ��������
            this.domain = "v";                                              // ����Ƶ��������ent,news,phtv,finance
            this.adUrl = "";                                                // �������ַ
            this.preAdurl = "";                                             // ����ǰ��Ƭ����ַ
            this.noRelatedPage = "";
            this.adType = "";                                               // Ĭ��Ϊ2 (ר�ⲥ�ţ�ֻ��ǰ��Ƭ)������preAdurl��Чʱ����ǿ��ת��Ϊ0�����Զ���������.   =1ʱ����ʾ��ҳ
            this.ivbAdUrl = "";                                             //adType=0ʱ  ��Ч
            this.postAdUrl = "";                                            //adType=0ʱ  ��Ч
            this.pauseUrl = "";                                             //adType=0ʱ  ��Ч
            this.cornerAdUrl = "";                                          //adType=0ʱ  ��Ч
            this.canShare = "true";

            this.curGuid = '';                                              //���浱ǰ������Ƶguid
            this.remGuid = '';                                              //Ϊͳ�Ƽ�¼��guid

            if (typeof obj !== 'undefined') {
                for(var o in obj){
                    this[o] = obj[o];
                }
            }else{
                alert('��������ʼ����������');
            }
        },

        // ��ȡƵ������
        getDomain : function() {
            var host = location.host, domain = '';
            var domains = host.split('.');
            if (domains.length >= 3 && host.indexOf("ifeng.com") != -1)
                domain = domains[domains.length - 3];
            return domain;
        },

        // ��ʼ��������Ŀ
        initItems : function(){
            var _this = this;

            var items = [], count = 0;
            var pid = this.parentIds.split(",");
            for (var a = 0; a < pid.length; a++){           // ����ڵ���
                var item = document.getElementById(pid[a]).getElementsByTagName("li");
                for (var i = 0; i < item.length; i++){
                    var videoid = item[i].getAttribute('name');
                    if(videoid && videoid.length==36){
                        items.push(item[i]);
                        count ++ ;
                    }
                }
            }

            for (var i = 0; i < count; i++) {               // Ϊ����item��ӵ���¼�
                items[i].onclick = function() {
                    for (var j = 0; j < count; j++)
                        if (this == items[j])
                            _this.clickplay(j);
                };
            }

            this.items = items;
            this.itemCount = count;
        },

        // ��Ŀ��������¼�
        clickplay : function(swfindex) {
            this.firstAutoPlay = "true";
            this.ADOrderFirst = "0";
            this.renderPlay(swfindex);
        },

        // ������Ŀ�л�
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

        // ����
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

                if (this.autoPlay == 'true' ) { // �Ƿ��Զ���
                    if (playindex == this.index && this.firstAutoPlay == "false"){ // ��һ���Ƿ��Զ����ţ�����һ����ȫ�Զ���
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
                fo.addVariable('forPlayNum', (parseInt(this.curIndex) + 1)); // �´β��ŵڼ���
                fo.addVariable('ADURL', this.adUrl);
                fo.addVariable('noRelatedPage', this.noRelatedPage);
                fo.addVariable('canShare', this.canShare);
                fo.addVariable('subject', this.subject);
                fo.addVariable('writeby', 'webjs'); //Ϊ�˼�����ǰ��ר������ҳ�档���source=webjs����ʾ��js��Ⱦ����������ʱ������ֱ�ӵ��ýű��������������swf����ķ�����
                fo.addVariable('width', this.swfWidth);
                fo.addVariable('height', this.swfHeight);
                fo.addVariable('postUrl', this.postUrl);
                fo.addVariable('ivbAdUrl', this.ivbAdUrl);
                fo.addVariable('postAdUrl', this.postAdUrl);
                fo.addVariable('pauseUrl', this.pauseUrl);
                fo.addVariable('cornerAdUrl', this.cornerAdUrl);
                fo.addVariable('ADOrderFirst', this.ADOrderFirst);
                fo.addVariable("special", 'true'); // ��ʾר������
                fo.addVariable('PlayerName', "VZHPlayer");
                fo.addParam('allowFullScreen', 'true');
                fo.addParam("wmode", "transparent");
                fo.addParam('allowScriptAccess', 'always');
                // fo.addVariable('guidList', getVideoList(this.items));

                fo.write(this.showDivId);
            }
        },

        // ����h5������
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

        // ����h5���������󶨲��š��ص���ͳ���¼�
        showHTML5Video : function(playermsg) {

            if (typeof(playermsg) != "undefined") {
                var strvideo = '<video  poster = "' + (this.postUrl||playermsg.largePoster) + '" src="' + playermsg.videoplayurl + '" width="' + this.swfWidth + '" height="' + this.swfHeight + '" controls  id="player" />';
                document.getElementById(this.showDivId).innerHTML = strvideo;

                var _this = this;
                var next = parseInt(this.curIndex) + 1;
                var video = document.getElementById('player');
                video.addEventListener("playing", function () {     //ע�Ქ�ŷ���ͳ��
                    _this.sendHTML5VideoInfo();
                }, false);
                video.addEventListener("ended", function () {       //ע�Ქ����ɻص�
                    if(_this.autoLoop == 'true'||(_this.curIndex != _this.itemCount-1)){
                        _this.firstAutoPlay = 'true';
                        _this.renderPlay(next);
                    }
                }, false);

                if (this.autoPlay == 'true'){ // �Ƿ��Զ���
                    if (this.curIndex != this.index || this.firstAutoPlay == "true"){
                        video.load();
                        video.play();
                    }
                }
            }
        },

        // h5������ͳ��
        sendHTML5VideoInfo : function() {
            var sendRequest = function(params) {
                if (typeof params !== 'undefined') {                    // �ϲ�����
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
                        loc: '', //��
                        cat: '',
                        se: '',
                        ptype: '',
                        vid: 'HTML5Player',
                        ref: '', //����
                        tm: '' //ʱ���
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

        // flash�������ص�
        swfplay : function(swfindex){
            var _this = window.play;
            if(_this.autoLoop == 'true'||swfindex!=_this.itemCount){
                _this.firstAutoPlay = 'true';
                _this.ADOrderFirst = '0';
                _this.renderPlay(swfindex);
            }
        },

        // ע��ȫ���¼�
        regCallback : function(){
            window.swfplay = this.swfplay;  // �������ص�������swf����js
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
 *   �°沥����ifengZhPlayer_v1.0.36.swf��ȡ��������
 */
/* share begin*/
(function(win,doc){
    var share = {
        shareTo:function(site, pic, url, title, smallimg, isflash){
            var _url = encodeURIComponent(url);
            var _title = encodeURIComponent(title);
            var _tp = new Date().getTime();

            var isfalsh = isfalsh || "true"; // ҳ�����ʱ��isflashֵΪfalse
            var type  = "";
            var shareType = {
                "sinateew": "sina",
                "qqzone": "qqZone",
                "qqteew": "qq"
            };
            if(isfalsh){
                type = "v_" + (shareType[site] || site);    // �����������ȥ,��ʶ��v
            }else{
                type = shareType[site] || site;
            }

            // ���ͷ���ͳ����Ϣ
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
                    var u = "http://t.163.com/article/user/checkLogin.do?link=http://www.ifeng.com&source=" + encodeURIComponent("�����") + "&info=" + _title + " " + _url + encodeURIComponent("#_share=" + type) + "&" + _tp;
                    window.open(u, "newwindow", "height=330,width=550,top=" + t + ",left=" + l + ", toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no");
                    break;

                case "feixin":
                    var l = (screen.width - 550) / 2;
                    var t = (screen.height - 280) / 2;
                    var u = "http://space.fetion.com.cn/api/share?Source=" + encodeURIComponent("�����Ƶ") + "&Title=" + _title + "&url=" + _url + encodeURIComponent("#_share=" + type) + "&IsEditTitle=false";
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
                    var u = "http://share.51.com/share/out_share_video.php?from=" + encodeURIComponent("�����Ƶ") + "&title=" + _title + "&vaddr=" + _url + encodeURIComponent("#_share=" + type) + "&IsEditTitle=false&charset=utf-8";
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

            // ������������
            var operation = {

                // ���ӽ���
                url : function(type, url){
                    var rst = null;

                    if(typeof url !== 'undefined'){
                        var hIndex = url.indexOf('#'), pIndex = url.indexOf('?');   // ����hash��ʼ������param��ʼ����
                        var paramStr = '', hashStr = '', uri = '';

                        if(pIndex < hIndex){//param��ǰ��hash�ں�

                            hashStr = url.substring(hIndex);

                            if(pIndex === -1){//��param
                                paramStr = '';
                                uri = url.substring(0,hIndex);
                            }else{//��param
                                paramStr = url.substring(pIndex,hIndex);
                                uri = url.substring(0,pIndex);
                            }

                        }else if(pIndex > hIndex){//hash��ǰ��param�ں�

                            paramStr = url.substring(pIndex);

                            if(hIndex === -1){//��hash
                                hashStr = '';
                                uri = url.substring(0,pIndex);
                            }else{//��hash
                                hashStr = url.substring(hIndex,pIndex);
                                uri = url.substring(0,hIndex)
                            }

                        }else {//hash��param������
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

                // �ַ�������
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
                                    //��ȡָ������ֵ
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

                // hash����
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
                            //��ȡ����
                            if (typeof val === 'undefined') {

                                if (result !== null) {
                                    rst = result;
                                    break;
                                }

                            } else {

                                if (result !== null) { //����ָ������
                                    hashStrArr[index] = op.str(hashStr, name, val);
                                    rst = '#' + hashStrArr.join('#');
                                    break;
                                } else if (result === null && index === hashStrArr.length - 1) { //������ָ������

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

                //  ��������
                param : function(paramStr, name, val) {
                    var op = operation;
                    var rst = null;

                    if (typeof paramStr !== 'undefined') {

                        if (paramStr.indexOf('?') === 0) {
                            paramStr = paramStr.substr(1);
                        }
                        //��ȡ����
                        if (typeof val === 'undefined') {
                            rst = op.str(paramStr, name);
                        } else {
                            rst = '?' + op.str(paramStr, name, val);
                        }
                    }

                    return rst;
                }

            };

            // �������ͳ����Ϣ
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

                if (pShare !== null) {  //��������к���_share,�滻����ֵ
                    var newParamStr = op.param(paramStr, '_share', type)
                    statistic.uri = uri.replace(paramStr,newParamStr);
                } else {
                    if (hashStr === '') {   //��������_share,Ҳ������hash��ֱ�����_share��Ϊhash
                        var newHashStr = op.hash(hashStr, '_share', type);
                        statistic.uri = uri + newHashStr;
                    } else {    //��������_share,�����Ѿ�����hash
                        if ( hShare!== null) {//���hash���Ѿ�����_share���������滻_share��ֵ
                            var newHashStr = op.hash(hashStr, '_share', type);
                            statistic.uri = uri.replace(hashStr,newHashStr);
                        } else {    //���hash�в�����_share����������param�����_share
                            var newParamStr = op.param(paramStr , '_share', type);
                            statistic.uri = uri + newParamStr + hashStr ;
                        }
                    }
                }

                statistic.time = new Date().getTime();

                if (typeof getChannelInfo !== 'undefined') {//Ƶ����Ϣ
                    statistic.ci = getChannelInfo();
                }

                if (typeof getStaPara === 'function') {
                    statistic.pt = getStaPara();
                }

                return statistic;
            };

            // ����ͳ����Ϣ
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