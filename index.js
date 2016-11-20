'use strict';

var casper = require('casper').create({
        logLevel: 'debug',
        verbose: false,
        waitTimeout: 50000
    }),
    mainDelay = 3500,

    shows = [
        {date: '28-01-2015', url: '296307'}
    ],
    i = 0,
    len = shows.length;

casper.start('http://www.france5.fr/emissions/la-maison-france-5', function() {
    var that = this;
    var loop = function() {
        console.log('loop: ' + i + ' len: ' + len);
        if (i < len) {
            that.echo(shows[i].url);
            casper.open('http://www.france5.fr/emissions/la-maison-france-5/diffusions/' + shows[i].date + '_' + shows[i].url );
            casper.then(function() {
                that.echo('Page: ' + that.getTitle());
                casper.evaluate(function(id) {
                    var j = 0,
                        links = document.querySelectorAll('section.bloc_sommaire a'),
                        leng = links.length;
                    for (j; j < leng; j++) {
                        if (links[j].getAttribute('title').toLowerCase().indexOf('changer') !== -1) {
                            links[j].click();
                        }
                        if (id && links[j].getAttribute('title').toLowerCase().indexOf(id) !== -1) {
                            links[j].click();
                        }
                    }
                }, shows[i].id);
                that.wait(mainDelay, function() {
                    casper.evaluate(function() {
                        document.querySelectorAll('.galerie_evol li a')[0].click()
                    });
                    that.wait(mainDelay, function() {
                        var numberOfPics = casper.evaluate(function() {
                            return document.querySelectorAll('.thumbs img').length;
                        });

                        var k = 0,
                            loopPic = function() {
                                if (k < numberOfPics) {
                                    casper.evaluate(function(inc) {
                                        document.querySelectorAll('.thumbs img')[inc].click();
                                    }, k);
                                    that.wait(mainDelay, function() {
                                        var url = casper.evaluate(function() {
                                            return document.querySelector('#slideshow img').getAttribute('src');
                                        });
                                        that.wait(mainDelay, function() {
                                            //that.echo('url: ' + url);
                                            /*that.capture('screenshots/maison-france5-' + shows[i].date + '-' + k + '-screen.jpg', undefined, {
                                                format: 'jpg',
                                                quality: 75
                                            });*/
                                            if (url) {
                                                that.download(url, 'screenshots/maison-france5-' + shows[i].date + '-' + k + '.jpg');
                                                //that.echo('screenshot ok for ' + shows[i].date);
                                            }
                                            k++
                                            loopPic();
                                        });
                                    });
                                } else {
                                    that.echo('screenshot ok for ' + shows[i].date);
                                    i++
                                    loop();
                                }
                            }
                        loopPic();
                    });

                });
            });
        } else {
            that.echo('The end !').exit();
        }
    }

    loop();
});
casper.viewport(1500, 1050);
casper.run();


/*
casper.open('http://www.france5.fr/emissions/la-maison-france-5/diffusions/09-12-2015_440127');

casper.then(function() {
    //this.echo('First Page: ' + this.getTitle());
    if (this.exists('section.bloc_sommaire')) {
        this.echo('the toc exists');
    }
    casper.evaluate(function() {
        document.querySelectorAll('section.bloc_sommaire a')[5].click();
    });
    this.wait(3000, function() {
        casper.evaluate(function() {
            document.querySelectorAll('.galerie_evol li a')[0].click()
        });
        this.wait(1500, function() {
            let url = casper.evaluate(function() {
                return document.querySelector('#slideshow img').getAttribute('src');
            });
            this.echo(url);
            this.download(url, 'maison-france5.jpg');
        });
        this.echo('screenshot ok');
    });
});
*/
