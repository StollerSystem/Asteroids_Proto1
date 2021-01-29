function Enemy(pos, r) {

  if (pos == null) {
    pos = createVector(random(width), random(height));
  }

  this.update = function () {
    Entity.prototype.update.call(this);
  }



  Entity.call(this, pos.x, pos.y, r)
  this.point = random(1,3)
  this.vel = p5.Vector.random2D();
  this.vel.mult(4);
  this.rotation = random(.03,.1)

  this.render = function () {

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    stroke(255)
    fill(0);
    // triangle(-this.r, -this.r,
    //   -this.r, this.r,
    //   this.r, 0);
    // circle(0,0,this.r);
    beginShape();
    vertex(this.r / 2, this.r / 2)
    vertex(this.r * this.point, 0)
    vertex(this.r / 2, -this.r / 2)
    vertex(0, -this.r * this.point)
    vertex(-this.r / 2, -this.r / 2)
    vertex(-this.r * this.point, 0)
    vertex(-this.r / 2, this.r / 2)
    vertex(0, this.r * this.point)
    endShape(CLOSE);
    ellipse(0,0,this.r,this.r)
    pop();
  }
}

Enemy.prototype = Object.create(Entity.prototype);