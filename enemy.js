function Enemy(pos, r) {

  if (pos == null) {
    pos = createVector(random(width), random(height));
  }

  
  
  
  Entity.call(this, pos.x, pos.y, r)
  this.crazyness = random(1,5);
  this.point = random(1,3);
  this.vel = p5.Vector.random2D();
  this.vel.mult(4);
  this.rotation = random(.03,.1);
  
  this.update = function () {
    Entity.prototype.update.call(this);
    var changeCourse = random(1,100)
    if (changeCourse <= this.crazyness) {
      console.log("enemy boost!")
      this.shootLaser();
      this.setAccel(1)
      this.vel = p5.Vector.random2D();
      this.vel.mult(4);
    } else {
      this.setAccel(0)
    }
  }

  var scope = this;
  this.shootLaser = function() {
    var laser = new Laser(scope.pos, scope.vel, scope.heading);
    var dustVel = laser.vel.copy();    
    addDust(scope.pos, dustVel.mult(.5), 4, .045, 2, 5);
    lasers.push(laser);
  }

  this.render = function () {

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    stroke(255)
    strokeWeight(random(1,1.5))
    fill(0);    
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
    
    // push();
    // translate(this.pos.x, this.pos.y);
    // ellipse(0,0,this.r,this.r);
    // stroke(255);
    // fill(0);
    // strokeWeight(1);
    // pop();

  }
}

Enemy.prototype = Object.create(Entity.prototype);