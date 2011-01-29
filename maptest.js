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
    player: [0, 2, 1, 1],
  });

  for (var y = 0; y < 32; y++) {
    var ny = y / 16;
    for (var x = 0; x < 32; x++) {
      var pixel = Math.floor((simplex.noise(x / 16, ny) + 1) * 2.5);
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

  var player = Crafty.e('2D, DOM, player, controls, collision')
      .attr({
        move: {
          left: false,
          right: false,
          up: false,
          down: false,
        },
        speed: 0,
        decay: 0.95,
        x: Crafty.viewport.width / 2,
        y: Crafty.viewport.height / 2,
      })
      .origin('center')
      .bind("keydown", function(e) {
        if (e.keyCode === Crafty.keys.RA) {
          this.move.right = true;
        } else if (e.keyCode === Crafty.keys.LA) {
          this.move.left = true;
        } else if (e.keyCode === Crafty.keys.UA) {
          this.move.up = true;
        }
      }).bind("keyup", function(e) {
        if (e.keyCode === Crafty.keys.RA) {
          this.move.right = false;
        } else if (e.keyCode === Crafty.keys.LA) {
          this.move.left = false;
        } else if (e.keyCode === Crafty.keys.UA) {
          this.move.up = false;
        }
      }).bind("enterframe", function() {
        if (this.move.right) this.rotation += 4;
        if (this.move.left) this.rotation -= 4;

        if (this.move.up) {
          this.speed = Math.min(this.speed + 0.1, 1.2);
        } else {
          this.speed *= this.decay;
        }

        var vx = Math.sin(this._rotation * Math.PI / 180) * this.speed,
            vy = Math.cos(this._rotation * Math.PI / 180) * this.speed;

        this.x += vx;
        this.y -= vy;
      });

});
