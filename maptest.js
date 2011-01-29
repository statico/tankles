var simplex = new SimplexNoise();

var kind_map = ['water', 'sand', 'dirt', 'grass', 'snow'];

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

  for (var y = 0; y < 32; y++) {
    var ny = y / 16;
    for (var x = 0; x < 32; x++) {
      var pixel = Math.floor((simplex.noise(x / 16, ny) + 1) * 2.5);
      console.log(x, y, pixel);
      Crafty.e('2D, DOM, tile, ' + kind_map[pixel]).attr({
        x: x * 16,
        y: y * 16,
        width: 16,
        height: 16,
      });
    }
  }

  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX, dy = base.y - e.clientY;
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
