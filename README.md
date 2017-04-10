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


 ![alt normalsetting](https://raw.githubusercontent.com/ardencod3/his4gram/master/doc/img/histogram_normal_lena.jpg) 

 ### Setting
 will update this part soon. from now, just look in /test/index.js for how setting are and how it work.