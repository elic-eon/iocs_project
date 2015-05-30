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

var ref = new Firebase('https://iocs-nctu.firebaseio.com/regions');
ref.orderByKey().on("child_added", function(snapshot) {
  var tmp = new Konva.Path(snapshot.val());
  this.layer.add(tmp);
  this.stage.add(layer);
  console.log(snapshot.val());
});
