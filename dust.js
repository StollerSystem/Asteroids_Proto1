function Dust(pos, vel) {
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
  this.transparency = 1

  this.update = function() {
    this.pos.add(this.vel);
    this.transparency -= .005;
  }

  this.render = function() {
    if (this.transparency > 0) {
      push();
      stroke(`rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${this.transparency})`);
      strokeWeight(2);
      point(this.pos.x, this.pos.y);
      pop();
    }
  }
 }

function addDust(pos, vel, n) {
  for (var i = 0; i < n; i++) {
    dust.push(new Dust(pos, vel));
  }
}
