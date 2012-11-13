/* 
    Document   : main.css
    Created on : 29/10/2012, 4:59:16 AM
    Author     : Alan Dennis Eaton <alan.dennis.eaton@gmail.com>
*/

'use strict';

//-----------------------------------------------------------------
btk.define({
    name: 'main@clock',
    load: true,
    libs: {
        base: 'base@common',
        Timer: 'timer@btk'
    },
    css: [
        'base@wtk',
        'box@wtk',
        'main@clock'
    ],
    when: [
        'state::document.loaded'
    ],
    init: function(libs, exports) {

        //---------------------------------------------------------
        var Timer = libs.Timer;


        //---------------------------------------------------------
        var global = btk.global;
        var doc = btk.document;
        
        var page = global.page;


        //---------------------------------------------------------
        var view = doc.getElementById('clockView');
        var body = doc.getElementById('clockBody');
        var output = doc.getElementById('clockTime');

        // for testing
        page.clock = {
            'view': view,
            'body': body,
            'output': output
        };
        
        
        //---------------------------------------------------------
        var oldWidth=0;
        
        var factor = 1.5;
        
        var tick = function(timer) {
            var width = global.innerWidth;
            var text = new Date().toLocaleTimeString();
            
            if (width != oldWidth) {
                oldWidth = width;
                output.style.fontSize = String(Math.floor(factor*width/text.length)) + 'px';
            }
            
            output.innerText = text;
        };
        
        
        //---------------------------------------------------------
        var optionStringToObject = function(options) {
            var regex = /([^&=]+)=([^&]*)/g;
            var object = {};
            var m;

            m = regex.exec(options);
            while (m) {
                object[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                m = regex.exec(options);
            }

            return object;
        };


        page.search = doc.location.search.substring(1);

        page.params = optionStringToObject(page.search);
        
        
        //---------------------------------------------------------
        var fullscreenEnabled = function() {
            return doc.webkitFullscreenEnabled;
        };
        
        var isFullscreen = function() {
            if (!fullscreenEnabled()) return false;
            
            return doc.webkitIsFullScreen;
        };
        
        var requestFullscreen = function() {
            console.log('requesting fullscreen mode');
            
            if (!fullscreenEnabled()) return;
            
            if (isFullscreen()) return;
            
            view.webkitRequestFullscreen();
        };
        
        var exitFullscreen = function() {
            console.log('exiting fullscreen mode');
            
            if (!fullscreenEnabled()) return;
            
            if (!isFullscreen()) return;
            
            doc.webkitExitFullscreen();
        };
        
        var toggleFullscreen = function() {
            if (isFullscreen()) {
                exitFullscreen();
            }
            else {
                requestFullscreen();
            }
        };
        
        
        page.fullscreenEnabled = fullscreenEnabled();
        
        // this does not work
        // it seems that requesting fullscreen has to be a user action
        if (!!page.params.fullscreen) {
            requestFullscreen();
        }
        
        
        //---------------------------------------------------------
        body.addEventListener('click', toggleFullscreen);
        
        page.timer = new Timer(tick, Timer.second).repeat().start(0);
        
        
    //-------------------------------------------------------------
    }
});

