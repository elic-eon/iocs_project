var stage = new Konva.Stage({
  container: 'container',
  width: 1920,
  height: 1080,
});

var layer = new Konva.Layer({
  scale : {
	x : 0.5,
	y : 0.5
	},
  y : 250,
  x : -300,

  });

var ref = new Firebase('https://iocs-nctu.firebaseio.com/regions');
ref.orderByKey().on("child_added", function(snapshot) {
  var tmp = new Konva.Path(snapshot.val());
  this.layer.add(tmp);
  this.stage.add(layer);
  console.log(snapshot.val());
});
