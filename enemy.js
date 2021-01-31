function Enemy(r) {

  var outOfBounds = [  
  createVector(random(width), -r),
  createVector(width+r, random(height)),
  createVector(random(width), height+r),
  createVector(-r, random(height))
  ]
  
  var pos = outOfBounds[floor(random(0,4))]  

  Entity.call(this, pos.x, pos.y, r)
  this.crazyness = random(1,3+level/3);
  this.shotThresh = random(1,2+level/4);
  // this.crazyness = 10;
  this.point = random(1, 3);
  this.vel = p5.Vector.random2D();
  this.vel.mult(4);
  this.rotation = random(.03, .1);
  // this.isDestroyed = false;
  // this.destroyFrames = 1000;

  this.update = function () {

    Entity.prototype.update.call(this);
    var changeCourse = random(1, 100)
    var shoot = random(1,25)
    if (changeCourse <= this.crazyness) {      
      this.setAccel(1)
      this.vel = p5.Vector.random2D();
      this.vel.mult(4);
    } else {
      this.setAccel(0)
    }
    if (shoot <= this.shotThresh) {
      this.shootLaser();
    }
    // if (this.isDestroyed) {
    //   for (var i = 0; i < this.brokenParts.length; i++) {
    //     this.brokenParts[i].pos.add(this.brokenParts[i].vel);
    //     this.brokenParts[i].heading += this.brokenParts[i].rot;
    //   }
    // }

  }

  var scope = this;
  this.shootLaser = function () {
    var laser = new Laser(scope.pos, scope.vel, scope.heading, true);
    var dustVel = laser.vel.copy();
    addDust(scope.pos, dustVel.mult(.5), 4, .045, 2, 5);
    lasers.push(laser);
  }

  this.render = function () {

    if (this.isDestroyed) {
      // ship debris
      for (var i = 0; i < this.brokenParts.length; i++) {
        push();
        let transNum = (1 * ((this.destroyFrames--) / 1000))
        let trans = transNum > 0 ? transNum : 0;
        stroke(`rgba(${rgbColor4[0]},${rgbColor4[1]},${rgbColor4[2]},${trans})`);
        var bp = this.brokenParts[i];
        translate(bp.pos.x, bp.pos.y);
        rotate(bp.heading);
        line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
        pop();
      }
    } else {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading);
      stroke(`rgba(${rgbColor4[0]},${rgbColor4[1]},${rgbColor4[2]},${1})`);
      strokeWeight(random(1, 2.5))
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
      ellipse(0, 0, this.r, this.r)
      pop();
    }    
  }

  

  this.vertices = function () {

    var vertices = [
      p5.Vector.add(createVector(this.r / 2, this.r / 2), this.pos),
      p5.Vector.add(createVector(this.r * this.point, 0), this.pos),
      p5.Vector.add(createVector(this.r / 2, -this.r / 2), this.pos),
      p5.Vector.add(createVector(0, -this.r * this.point), this.pos),
      p5.Vector.add(createVector(-this.r / 2, -this.r / 2), this.pos),
      p5.Vector.add(createVector(-this.r * this.point, 0), this.pos),
      p5.Vector.add(createVector(-this.r / 2, this.r / 2), this.pos),
      p5.Vector.add(createVector(0, this.r * this.point), this.pos)
    ]

    return vertices;
  }
}

Enemy.prototype = Object.create(Entity.prototype);