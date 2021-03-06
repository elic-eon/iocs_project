var stage = new Konva.Stage({
  container: 'container',
  width: 1600,
  height: 900,
});

var layer = new Konva.Layer({
  scale : {
	x : 0.6,
	y : 0.6
	},
  y : 200,
  x : -550,

  });

var layer_river = new Konva.Layer({
  scale : {
	x : 0.6,
	y : 0.6
	},
  y : 200,
  x : -550,

  });

var layer_point = new Konva.Layer({
  scale : {
	x : 0.6,
	y : 0.6
	},
  y : 200,
  x : -550,

  });

var layer_text = new Konva.Layer();

var tooltip = new Konva.Label({
        opacity: 0.75,
				visiable: false,
        listening: false
    });

var infoText = new Konva.Text({
	x: 10,
	y: 430,
	text: '點擊鄉鎮、河流查看更多訊息',
	fontSize: 24,
	fontFamily: 'Meiryo, "微軟正黑體", "Microsoft JhengHei"',
	fill: '#555',
	width: 400,
	padding: 20,
	align: 'left'
});

tooltip.add(new Konva.Tag({
	fill: 'black',
	pointerDirection: 'down',
	pointerWidth: 10,
	pointerHeight: 10,
	lineJoin: 'round',
	shadowColor: 'black',
	shadowBlur: 10,
	shadowOffset: 10,
	shadowOpacity: 0.2
}));

tooltip.add(new Konva.Text({
	text: '',
	fontFamily: 'Meiryo, "微軟正黑體", "Microsoft JhengHei"',
	fontSize: 18,
	padding: 5,
	fill: 'white'
}));

var defaultImgObj = new Image();

var pointImg = new Konva.Image({
	x: 1200,
	y: 80,
	draggable: true,
	image: defaultImgObj,
});

layer_text.add(tooltip);
layer_text.add(infoText);
layer_text.add(pointImg);
stage.add(layer);
stage.add(layer_river);
stage.add(layer_point);
stage.add(layer_text);

defaultImgObj.src = 'http://konvajs.github.io/assets/yoda.jpg';
defaultImgObj.onload = function() {
	layer_text.draw();
}

var ref = new Firebase('https://iocs-nctu.firebaseio.com/regions');
ref.orderByKey().on("child_added", function(snapshot) {
  var vals = snapshot.val();
  vals.name = snapshot.key();
  var node = new Konva.Path({
		data : vals.data,
		draggable : true,
		fill : vals.fill,
		stroke : vals.stroke,
		strokeWidth : vals.strokeWidth,
		name : vals.name
  });

  node.on('mouseover mousemove dragmove', function() {
		var mousePos = this.getStage().getPointerPosition();
		tooltip.position({
			x: mousePos.x,
			y: mousePos.y - 5
		});
		tooltip.getText().setText(vals.name + " Postcode: "+vals.postal_code);
		tooltip.show();
		tooltip.moveToTop();
		layer_text.draw();
  });

	node.on('mouseup', function() {
		infoText.setText(vals.name + "\n" +
										"人口: " + vals.population + "\n" +
										"人口密度: " + vals.populationDensity + " 人/平方公里\n" +
										"面積: " + vals.squareMeter + "平方公里\n" +
										"村里數: " + vals.numVil + "\n" +
										"鄰數: " + vals.numNeighborhood);
		layer_text.draw();
	});
	
	node.on('mouseout', function() {
		tooltip.hide();
		layer_text.draw();
	});

  layer.add(node);
  layer.draw();
});

var ref_river = new Firebase('https://iocs-nctu.firebaseio.com/river');
ref_river.orderByKey().on("child_added", function(snapshot) {
  var vals = snapshot.val();
  vals.name = snapshot.key();
  var node = new Konva.Path({
		data : vals.data,
		draggable : true,
		stroke : vals.stroke,
		strokeWidth : vals.strokeWidth,
		name : vals.name
  });

  node.on('mouseover mousemove dragmove', function() {
		var mousePos = this.getStage().getPointerPosition();
		tooltip.position({
			x: mousePos.x,
			y: mousePos.y - 5
		});
		tooltip.getText().setText(vals.name);
		tooltip.show();
		tooltip.moveToTop();
		layer_text.draw();
  });
	
	node.on('mouseout', function(evt) {
		tooltip.hide();
		layer_text.draw();
	});

	node.on('mouseup', function() {
		infoText.setText(vals.name + "\n" +
										"長度: " + vals.river_length + "KM");
		layer_text.draw();
	});

  layer_river.add(node);
	layer_river.draw();
});

var ref_spot = new Firebase('https://iocs-nctu.firebaseio.com/intrest_spot');
ref_spot.orderByKey().on("child_added", function(snapshot) {
  var vals = snapshot.val();
  vals.name = snapshot.key();
	//console.log(vals.name);
  var node = new Konva.RegularPolygon({
		x: vals.x,
		y: vals.y,
		sides: 3,
		radius: 15,
		fill: 'red',
		//rotation: 180,
		draggable : true,
		stroke: 'red',
		strokeWidth : 0,
		name : vals.name
  });

	var myImage = new Image();
	myImage.src = vals.url_img;

	node.on('mouseover mousemove dragmove', function() {
		var mousePos = this.getStage().getPointerPosition();
		tooltip.position({
			x: mousePos.x,
			y: mousePos.y - 5
		});
		tooltip.getText().setText(vals.name);
		tooltip.show();
		tooltip.moveToTop();
		layer_text.draw();
	});
	
	node.on('mouseout', function(evt) {
		tooltip.hide();
		layer_text.draw();
	});

	node.on('click', function() {
		pointImg.setImage(myImage);
		layer_text.draw();
	});

  layer_point.add(node);
	layer_point.draw();
});

function modify_listener(layer, f_on) {
	for(var n = 0; n < layer.getChildren().length; n++) {
		var shape = layer.getChildren()[n];
		shape.setListening(f_on);
		layer.drawHit();
	}
}
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function highlight(layer, cities) {
	var nodes = layer.getChildren().toArray();
	for(var n = 0; n < nodes.length; n++) {
		var shape = nodes[n];
		var name = shape.getAttr('name');
		if (include(cities, name)){
			shape.stroke('red');
			shape.moveToTop();
		}
		else {
			shape.stroke('white');
		}
		layer.draw();
	}
}

document.getElementById('activate_regions').addEventListener('click', function() {
	modify_listener(layer, true);
}, false);
document.getElementById('deactivate_regions').addEventListener('click', function() {
	modify_listener(layer, false);
}, false);
document.getElementById('activate_rivers').addEventListener('click', function() {
	modify_listener(layer_river, true);
}, false);
document.getElementById('deactivate_rivers').addEventListener('click', function() {
	modify_listener(layer_river, false);
}, false);
//document.getElementById('save_position').addEventListener('click', function() {
	//var nodes = layer_point.getChildren().toArray();
	//for(var n = 0; n < nodes.length; n++) {
		//var shape = nodes[n];
		//var name = shape.getAttr('name');
		//var savebackRef = new Firebase('https://iocs-nctu.firebaseio.com/intrest_spot/' + name);
		//savebackRef.update({
			//x: shape.getAttr('x'),
			//y: shape.getAttr('y')
		//});
	//}
//}, false);
document.getElementById('query').addEventListener('click', function() {
	$sql = document.getElementById('sql').value;
	$.post("http://people.cs.nctu.edu.tw/~ssuyi/api/query.php",
		{sql: $sql},
		function(data) {
			var cities = [];
			for (var i = 0; i < data.length; i++) {
				var city = data[i].city_name;
				cities.push(city);
			}
			highlight(layer, cities);
		});
}, false);
