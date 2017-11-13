/*
* @Author: 10261
* @Date:   2017-07-11 20:38:13
* @Last Modified by:   10261
* @Last Modified time: 2017-08-10 19:59:25
*/

'use strict';
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }
    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function musicLoad(urlOrArr) {
        urlOrArr.forEach(function (v) {
            var music = new Audio();
            music.src = v;
            music.autoplay = false;
        });
    }
    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        musicLoad: musicLoad,
        onReady: onReady,
        isReady: isReady
    };
    window.resources.musicLoad(['./music/button.wav',
                                './music/death.wav',
                                './music/elec.wav',
                                './music/fire.wav',
                                './music/flip.wav',
                                './music/goal.wav',
                                './music/jumpBlock.wav',
                                './music/run.wav',
                                './music/spell.wav',
                                './music/trans.wav'])
    window.resources.load(['./images/block.png',
                           './images/button.png',
                           './images/buttonAf.png',
                           './images/cage.png',
                           './images/elec.png',
                           './images/fire.png',
                           './images/fire_base.png',
                           './images/fog.png',
                           './images/glass.png',
                           './images/goal.png',
                           './images/jumpAf.png',
                           './images/jumpBoard.png',
                           './images/master.png',
                           './images/mouseB.png',
                           './images/R.png',
                           './images/skate.png',
                           './images/spike.png',
                           './images/brace.png',
                           './images/trans.png',
                           './images/wood.png',
                           './images/ball.png',

                           './images/mouse.png',
                           './images/chicken.png',
                           './images/rabbit.png',
                           './images/horse.png',
                           './images/cow.png',

                           './images/bamboo_section.png',
                           './images/bamboo_tip.png',
                           './images/book.png',
                           './images/chain.png',
                           './images/cloud_1.png',
                           "./images/cloud_2.png",
                           './images/cloud_3.png',
                           './images/cloud_4.png',
                           './images/cloud_5.png',
                           './images/cloud_1_poison.png',
                           './images/cloud_2_poison.png',
                           './images/cloud_3_poison.png',
                           './images/cloud_4_poison.png',
                           './images/cloud_5_poison.png',
                           './images/earth.png',
                           './images/eve.png',
                           './images/grass.png',
                           './images/rope.png',
                           './images/round.png',
                           './images/sky.png',
                           './images/sword.png',
                           './images/water_1.png',
                           './images/water_2.png',
                           './images/water_3.png',
                           './images/bgblock.png',
                           './images/mouse_sprite.png',
                           './images/cow_sprite.png',
                           './images/rabbit_sprite.png',
                           './images/horse_sprite.png',
                           './images/chicken_sprite.png']);

})();

