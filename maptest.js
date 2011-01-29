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
        xspeed: 0,
        yspeed: 0,
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
        if (this.move.right) this.rotation += 5;
        if (this.move.left) this.rotation -= 5;

        //acceleration and movement vector
        var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
          vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;

        // Max speed.
        vx = Math.max(Math.min(vx, .02), -.02);
        vy = Math.max(Math.min(vy, .02), -.02);

        //if the move up is true, increment the y/xspeeds
        if(this.move.up) {
          this.yspeed -= vy;
          this.xspeed += vx;
        } else {
          //if released, slow down the ship
          this.xspeed *= this.decay;
          this.yspeed *= this.decay;
        }

        //move the ship by the x and y speeds or movement vector
        this.x += this.xspeed;
        this.y += this.yspeed;

      });

});
