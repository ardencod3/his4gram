var Jimp = require('jimp');
var mergeOptions = require('merge-options');

function defaultOption() {
  return {
		width: 256,
		height: 128,
		background: { red: 0, green: 0, blue: 0, alpha: 255 },
		channel: {
			red: true,
			green: true,
			blue: true
		}
	};
}
function buildOption(inputOption) {
	var option = inputOption;
	
	if (typeof option !== 'undefined' && typeof option !== 'object') {
		option = {};
	}

	if (typeof option.background !== 'undefined' && typeof option.background !== 'object') {
		delete option.background;
	}

	return mergeOptions(defaultOption(), option);
}

function generateHistogram(input, output, inputSetting, callback) {
	var setting = buildOption(inputSetting);
	var rgbData = array256Builder();
	Jimp.read(input, function (err, image) {
		if (err) {
			console.log(err);
			return;
		}
		image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
			rgbData.r[this.bitmap.data[ idx + 0 ]]++;
			rgbData.g[this.bitmap.data[ idx + 1 ]]++;
			rgbData.b[this.bitmap.data[ idx + 2 ]]++;
			rgbData.a[this.bitmap.data[ idx + 3 ]]++;
			
			if(x + 1 === image.bitmap.width && y + 1 === image.bitmap.height) {
				rgbData.minmax = getRGBMinMax(rgbData);
				rgbData.scale = getScale(rgbData.minmax.bound, setting.height);
				rgbDataToHis(rgbData, setting, function(outputJimp) {
					outputJimp.write(output, function() {
						if (typeof callback === 'function') {
							callback();
						}
					});
				});
			}
		});
	});
};

function getRGBMinMax(rgbData) {
	var minmaxData = {
		r: getMinMax(rgbData.r),
		g: getMinMax(rgbData.g),
		b: getMinMax(rgbData.b),
		a: getMinMax(rgbData.a),
	}
	
	minmaxData.bound = getMinMax([0, minmaxData.r.max, minmaxData.g.max, minmaxData.b.max, ]);
	
	return minmaxData;
}

function getScale(boundData, height) {
	var output =  height / (boundData.max || 1);
	return Number(output.toFixed(4));
}

function getMinMax(colorArray) {
	return { max: Math.max.apply(null, colorArray), min: Math.min.apply(null, colorArray) }
}

function getDrawLimit(colorData, scale) {
	return colorData * scale;
}

function gertColorValue(channelActive, VerticalLimit, horizonLevel) {
	if (!channelActive || VerticalLimit <= 0) {
		return 0;
	}

	if (VerticalLimit >= horizonLevel) {
		return 255;
	}
	
	return 0;
}

function numberCheck(input, fallback) {
	if (typeof input !== 'number') {
		return fallback;
	}
	return input
}

function buildIntHex(channel, rVertical, gVertical, bVertical, horizonLevel, background) {
	
	var red = gertColorValue(channel.red, rVertical, horizonLevel);
	var green = gertColorValue(channel.green, gVertical, horizonLevel);
	var blue = gertColorValue(channel.blue, bVertical, horizonLevel);
	
	if (red + green + blue === 0) {
		return Jimp.rgbaToInt(numberCheck(background.red, 0), numberCheck(background.green, 0), numberCheck(background.blue, 0), numberCheck(background.alpha, 255));
	}
	
	return Jimp.rgbaToInt(red, green, blue, 255);
}

function rgbDataToHis(rgbData, setting, callback) {
	var w = setting.width
	var h = setting.height
	var horizonLevel = 0;
	var tempHex = null;
	var rVertical = 0;
	var gVertical = 0;
	var bVertical = 0;
	var imageOutput = new Jimp(setting.width , setting.height, 0xFFFFFFFF, function (err, image) {});
	
	for(var verticalIndex = 0; verticalIndex < w; verticalIndex++) {
		
		rVertical = getDrawLimit(rgbData.r[verticalIndex],rgbData.scale);
		gVertical = getDrawLimit(rgbData.g[verticalIndex],rgbData.scale);
		bVertical = getDrawLimit(rgbData.b[verticalIndex],rgbData.scale);
		
		for( var horizonIndex = h-1; horizonIndex >= 0; horizonIndex--) {
			horizonLevel = h - horizonIndex;
			tempHex = buildIntHex(setting.channel, rVertical, gVertical, bVertical, horizonLevel, setting.background);
				
			imageOutput.setPixelColor(tempHex, verticalIndex, horizonIndex);
			
			if (verticalIndex+1 === w && horizonIndex === 0) {
				if (typeof callback === 'function') {
					callback(imageOutput);
				}
			}
		}
	}
}

function array256(default_value) {
  var arr = [];
  var i = 0;
  for (i = 0; i<256; i++) { arr[i] = default_value; }
  return arr;
}

function array256Builder() {
	var output = {};
	
	output.r = array256(0);
	output.g = array256(0);
	output.b = array256(0);
	output.a = array256(0);
	
	return output;
}

module.export = generateHistogram;
// var option = {
// 	channel: { red: true, green: true, blue: true },
// 	background: { red: 125, green: 125, blue: 125, alpha: 125},
// }
// generateHistogram('./4.jpg', './his_th_13389230.png', option);
