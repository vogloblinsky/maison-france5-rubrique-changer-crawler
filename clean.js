'use strict';

var color   = require('dominant-color'),
    glob = require('glob'),
    rimraf = require('rimraf');

glob( 'screenshots/*', {
    dot: false,
    nodir: true,
    cwd: __dirname
}, function(err, files) {
    let i = 0,
        f,
        basename,
        len = files.length;
    let loop = function() {
        if (i < len) {
            f = files[i];
            console.log(f);
            color(f, {format: 'rgb'}, function(err, color){
                //console.log(color);
                if (color[0] === color[1] && color[0] === color[2] && color[1] === color[2]) {
                    console.log('image grey');
                    rimraf(f, () => {});
                }
                i++
                loop();
            })
        }
    };
    loop();
});
