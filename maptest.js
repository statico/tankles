var map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 0],
  [2, 3, 3, 3, 4, 4, 4, 3, 3, 2, 0],
  [2, 3, 3, 3, 4, 4, 4, 3, 2, 2, 0],
  [2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

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

  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      Crafty.e('2D, DOM, tile, ' + kind_map[map[y][x]]).attr({
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
