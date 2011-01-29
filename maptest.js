var simplex = new SimplexNoise();

var kind_map = ['water', 'sand', 'dirt', 'grass', 'snow'];

var TILE_SIZE = 16;
var REGION_SIZE = 8;
var cache = {}; // optimized

function build_tile(vpx, vpy) {
  var regionx = Math.floor(Math.floor(vpx / TILE_SIZE) / REGION_SIZE);
  var regiony = Math.floor(Math.floor(vpy / TILE_SIZE) / REGION_SIZE);

  if (cache[regionx + ':' + regiony]) return;
  console.log('building', regionx, regiony);

  for (var dx = 0; dx < REGION_SIZE; dx++) {
    for (var dy = 0; dy < REGION_SIZE; dy++) {
      var worldx = regionx * REGION_SIZE + dx;
      var worldy = regiony * REGION_SIZE + dy;
      var pixel = Math.floor((simplex.noise(worldx / 15, worldy / 15) + 1) * 2.5);

      var tile = Crafty.e('2D, DOM, tile, ' + kind_map[pixel]).attr({
        x: worldx * TILE_SIZE - vpx,
        y: worldy * TILE_SIZE - vpy,
        width: TILE_SIZE,
        height: TILE_SIZE,
      });
      tile.intersect = tile_intersect;
    }
  }

  cache[regionx + ':' + regiony] = true;
}

function tile_intersect(x, y, w, h) {
  var rect;
  if (typeof x === "object") {
    rect = x;
  } else {
    rect = {x: x, y: y, w: w, h: h};
  }
  return this._x + 8 < rect.x + rect.w && this._x + this._w - 8 > rect.x &&
    this._y + 8 < rect.y + rect.h && this._h + this._y - 8 > rect.y;
};

$(document).ready(function() {

  Crafty.init(50, 400, 300);
  Crafty.canvas();

  Crafty.sprite(TILE_SIZE, "assets/tiles.png", {
    water: [0, 0, 1, 1],
    sand: [1, 0, 1, 1],
    dirt: [2, 0, 1, 1],
    grass: [3, 0, 1, 1],
    snow: [4, 0, 1, 1],
    player: [0, 2, 1, 1],
  });

  // Panning
  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX, dy = base.y - e.clientY;
      base = {x: e.clientX, y: e.clientY};

      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;

      r = Crafty.viewport.rect();
      build_tile(-r.x, -r.y);
      /*
      for (yy = r.y / REGION_SIZE; yy < r.y + r.h; yy += REGION_SIZE) {
        for (var xx = r.x / REGION_SIZE; xx < r.x + r.w; xx += REGION_SIZE) {
          build_region(-xx, -yy);
        }
      }
      */
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
      drag: 1.0,
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
        this.speed = Math.min(this.speed + 0.1, 1.2) * this.drag;
      } else {
        this.speed *= this.decay * this.drag;
      }

      var vx = Math.sin(this._rotation * Math.PI / 180) * this.speed,
      vy = Math.cos(this._rotation * Math.PI / 180) * this.speed;

      this.x += vx;
      this.y -= vy;
    }).collision('water', function() {
      this.drag = 0.2;
    }).collision('snow', function() {
      this.drag = 0.7;
    }).collision('sand, dirt, grass', function() {
      this.drag = 1.0;
    });

});
