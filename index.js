const {app, BrowserWindow} = require('electron');
const path = require('path');
const fetchUrl = require("fetch").fetchUrl;
const interval = 10000;

let winConf = [
    {
        width: 1280,
        height: 1080,
        left: 0,
        top: 0
    },
    {
        width: 320,
        height: 1080,
        left: 1280,
        top: 0
    },
    {
        width: 320,
        height: 1080,
        left: 1600,
        top: 0
    }
]


let winArr = [];

let currentWindow = 0;

app.on('ready', () => { 
      winConf.forEach( (conf, i) => {
          winArr[i] = new BrowserWindow({
            allowRunningInsecureContent: true,
            nodeIntegration: false,
            width: conf.width,
            enableLargerThanScreen: false,
            height: conf.height,
            frame: false,
            x: conf.left,
            y: conf.top
        });
      })    
})

function loadNext() {
    fetchUrl('https://export.yandex.ru/last/last20x.xml', (err, meta, body)=>{
        let str = body.toString();
        let reqText = str.match(/<item found="\d+">([^<]+)<\/item>/)[1];
        let url = "https://yandex.ru/search/";
        if (winConf[currentWindow].width < 1024) {
            url += 'touch/';
        }
        url += `?text=${reqText}&promo=nomooa&noredirect=1`;
        winArr[currentWindow].loadURL(url);
        currentWindow++;
        console.log(url)
        if (currentWindow >= winArr.length) {
            currentWindow = 0;
        }
        setTimeout(loadNext, interval)
    });
}

loadNext();
