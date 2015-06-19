function writeMessage(message) {
  text.setText(message);
  layer.draw();
}

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
  x : -600,

  });

var text = new Konva.Text({
  x: 1350,
  y: 100,
  fontFamily: 'Calibri',
  fontSize: 36,
  text: '',
  fill: 'black'
});

layer.add(text);

var ref = new Firebase('https://iocs-nctu.firebaseio.com/regions');
ref.orderByKey().on("child_added", function(snapshot) {
  var vals = snapshot.val();
  vals.name = snapshot.key();
  //var x = Math.random() * 800;
  //var y = Math.random() * 400;
  var node = new Konva.Path({
	//x : x,
	//y : y,
	data : vals.data,
	draggable : true,
	fill : vals.fill,
	stroke : vals.stroke,
	strokeWidth : vals.strokeWidth,
  });
  node.on('mouseover', function() {
    writeMessage(snapshot.key());
  });
  layer.add(node);
  stage.add(layer);
});
