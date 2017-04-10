# his4gram

Here is Nodejs module for generate photo histogram without canvas or any dependecies!

Installation: `npm install --save his4gram`

Simple use
```js
var his4gram = require('his4gram');

// generate photo histogram with default setting. Just give input and output path.
his4gram('./lena.png', './histogram_normal_lena.jpg');
```

Thank to the nice Nodejs module [`jimp`](https://github.com/oliver-moran/jimp). that give us freedom from canvas and any dependecies.