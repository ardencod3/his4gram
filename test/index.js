var his4gram = require('../index.js');

// run with default setting
his4gram('./lena.png', './histogram_normal_lena.jpg');

// run with png transparent gray background
var option = {
	channel: { red: true, green: true, blue: true },
	background: { red: 125, green: 125, blue: 125, alpha: 125},
}
his4gram('./lena.png', './histogram_lena.png', option);

// run with only green and blue channel and have red background
var option = {
	channel: { red: true, green: false, blue: false },
}
his4gram('./lena.png', './red_lena.jpg', option);

// run with only green and blue channel and have red background
var option = {
	channel: { red: false, green: true, blue: true },
    background: { red: 125, green: 0, blue: 0},
}
his4gram('./lena.png', './custom_lena.jpg', option);


// run with custom size setting
var option = {
    width: 512,
    height: 512
}
his4gram('./lena.png', './custdom_lena.jpg', option);
