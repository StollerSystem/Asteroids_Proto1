function Dust(pos, vel, trans, color, weight) {
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
  this.transparency = 1
  this.color = color ? color : "main";
  this.weight = weight ? weight : 2;
  
  this.update = function() {
    this.pos.add(this.vel);
    this.trans = trans ? trans : .005;
    this.transparency -= this.trans;
  }

  this.render = function() {
    if (this.transparency > 0) {
      push();
      if (this.color === "main") {
        stroke(`rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${this.transparency})`);
      } else {
        stroke(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${this.transparency})`);
      }
      strokeWeight(random(1,this.weight));
      point(this.pos.x, this.pos.y);
      pop();
    }
  }
 }

function addDust(pos, vel, n, trans, color, weight) {
  for (var i = 0; i < n; i++) {
    dust.push(new Dust(pos, vel, trans, color, weight));
  }
}
