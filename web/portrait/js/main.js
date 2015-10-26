/*
*
* mads - version 2.00.01  
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }
    
    /* Unique ID on each initialise */
    this.id = this.uniqId();
    
    /* Tracked tracker */
    this.tracked = [];
    
    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];
    
    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];
    
    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');
    
    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () {
    
    return new Date().getTime();
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {
    
    /* 
    * name is used to make sure that particular tracker is tracked for only once 
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type; 
    
    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');
            
            if (typeof value == 'undefined') {
                value = '';
            }
            
            /* Insert Macro */
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            src = src.replace('{{value}}', value);
            /* */
            img.src = src + '&' + this.id;
            
            img.style.display = 'none';
            this.bodyTag.appendChild(img);
            
            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;
    
    if (typeof callback != 'undefined') {
        script.onload = callback;
    }
    
    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    
    this.headTag.appendChild(link);
}

/*
*
* Unit Testing for mads 
*
*/
var testunit = function () {
    var app = new mads();
    
    console.log(typeof app.bodyTag != 'undefined');
    console.log(typeof app.headTag != 'undefined');
    console.log(typeof app.custTracker != 'undefined');
    console.log(typeof app.path != 'undefined');
    console.log(typeof app.contentTag != 'undefined');
    
    app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js',function () {
        console.log(typeof window.jQuery != 'undefined');
    });
    
    app.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
    
    app.contentTag.innerHTML = 
        '<div class="container"><div class="jumbotron"> \
            <h1>Hello, world!</h1> \
            <p>...</p> \
            <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p> \
        </div></div>';
    
    app.custTracker = ['http://www.tracker.com?type={{type}}&tt={{tt}}','http://www.tracker2.com?type={{type}}'];
    
    app.tracker('CTR', 'test');
    app.tracker('E','test','name');
    
    app.linkOpener('http://www.google.com');
}

var nam = function () {
    this.sdk = new mads();
    
    this.audio = new Audio(this.sdk.path + 'audio/Ding-small-bell.mp3');
    this.audioClap = new Audio(this.sdk.path + 'audio/Clapping-sound-effect.mp3');
    
    var _this = this;
    
    this.sdk.loadCss(this.sdk.path + 'css/style.css');
    this.sdk.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', function () {
        _this.sdk.loadJs('https://code.jquery.com/ui/1.11.3/jquery-ui.js', function () {
            _this.sdk.loadJs(_this.sdk.path + 'js/jquery.ui.touch-punch.min.js', function () {
                _this.game();
            });
            
        })
    });
    
    this.sdk.contentTag.innerHTML = 
        '<div id="frame-1"> \
            <div id="section-1"></div> \
            <div id="section-2"> \
                <div id="text"></div> \
                <div id="play"> \
                    <div id="img"></div> \
                </div> \
            </div> \
        </div>  \
        <div id="frame-2"></div>  \
        <div id="frame-3"> \
            <div id="overlay"></div> \
            <div id="logo"></div> \
            <div id="text"></div> \
            <div id="more"> \
                <div id="img"></div> \
            </div> \
        </div> \
        <d';
    
    var play = document.getElementById('play');
    play.addEventListener('click', function () {
        _this.sdk.tracker('E', 'nam_play');
        document.getElementById('frame-1').style.display = 'none';
        document.getElementById('frame-2').style.display = 'block';
    });
    var more = document.getElementById('more');
    more.addEventListener('click', function () {
        _this.sdk.linkOpener('http://www.nam.org/ExIm/');
        _this.sdk.tracker('CTR', 'nam_site');
    });
}
nam.prototype.game = function () {
    
    var _this = this;
    var count = 0;
    var check = function() {
        if (count == 5) {
            $(".icon-draggable").draggable('disable');
            
            _this.audioClap.play();
            
            document.getElementById('frame-3').style.display = 'block';
        }
    }

    var rma = document.createElement('div');
    rma.innerHTML = 
        '<div id="game-container"> \
            <div id="hand"></div> \
            <div id="text"></div> \
            <div class="region region-1"><div class="canada"></div></div> \
            <div class="region region-2"><div class="mexico"></div></div> \
            <div class="region region-3"><div class="brazil"></div></div> \
            <div class="region region-4"><div class="europe"></div></div> \
            <div class="region region-5"><div class="china"></div></div> \
            <div class="usa-icon"></div> \
            <div class="icon-draggable"></div> \
            <div id="count"> \
                <div class="count0"></div> \
            </div> \
        </div>';

    $(rma).find(".icon-draggable").draggable({
        start : function () {
            document.getElementById('hand').style.display = 'none';
        },
        stop: function() {
            $(this).css({
                top: '60px',
                left: '25px'
            });
            check();
        }
    });

    $(rma).find(".region").droppable({
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            _this.audio.load();
            _this.audio.play();
            
            $(this).addClass("dropped").droppable('disable');
            $(this).find('div').show();

            count++;
            countDom.children[0].className = 'count' + count;
            _this.sdk.tracker('E', 'nam_job' + count);
        }
    });

    document.getElementById('frame-2').appendChild(rma)
    var countDom = document.getElementById('count');
}

new nam();

