$(document).ready(function() {

  Crafty.init(50, 500, 400);
  Crafty.canvas();

  Crafty.sprite(16, "assets/tiles.png", {
    water: [0, 0, 1, 1],
    sand: [1, 0, 1, 1],
    dirt: [2, 0, 1, 1],
    grass: [3, 0, 1, 1],
    snow: [4, 0, 1, 1],
  });

  iso = Crafty.isometric.init(128);
  var z = 0;
  for(var i = 2; i >= 0; i--) {
    for(var y = 0; y < 2; y++) {
      var tile = Crafty.e("2D, DOM, grass, mouse").attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("click", function() {
        this.destroy();
      }).bind("mouseover", function() {
        this.sprite(0,1,1,1);
      }).bind("mouseout", function() {
        this.sprite(0,0,1,1);
      });
      iso.place(i,y,0, tile);
    }
  }

  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
      dy = base.y - e.clientY;
      base = {x: e.clientX, y: e.clientY};

      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
  });
});
