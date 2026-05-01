const sharp = require('sharp')

sharp('public/icon.svg').resize(192, 192).png().toFile('public/icon-192.png', err => { if (err) console.error(err); else console.log('192 ok') })
sharp('public/icon.svg').resize(512, 512).png().toFile('public/icon-512.png', err => { if (err) console.error(err); else console.log('512 ok') })
sharp('public/icon.svg').resize(32, 32).png().toFile('public/favicon.ico', err => { if (err) console.error(err); else console.log('favicon ok') })
