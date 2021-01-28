function Ship(pos, r) {
  Entity.call(this, width / 2, height / 2, 20);
  this.isDestroyed = false;
  this.destroyFrames = 1000;
  this.shields = shieldTime;
  this.rmax = 4 / 3 * this.r;
  this.rmax2 = this.rmax * this.rmax;
  this.tailEdge = true; //if true will hide vapor trail
  this.tailSkip = false;//tail effect toggles between true/false


  // magic for tail effect
  this.lastPos = new Array(20);
  for (var i = 0; i < this.lastPos.length; i++) {
    this.lastPos[i] = new Array(3);
    this.lastPos[i][0] = createVector(this.pos.x, this.pos.y);
    this.lastPos[i][1] = this.heading;
    this.lastPos[i][2] = 1;
  }


  var scope = this;
  input.registerAsListener(" ".charCodeAt(0), function (char, code, press) {
    if (!press) {
      return;
    }
    title = false;
    var laser = new Laser(scope.pos, scope.vel, scope.heading);
    if (score > 0) {
      score -= 5;
    }
    
    var dustVel = laser.vel.copy();    
    addDust(scope.pos, dustVel.mult(.5), 4, .045, "secondary", 5);

    var effect = laserSoundEffects[floor(random() * laserSoundEffects.length)];
    laser.playSoundEffect(effect);
    lasers.push(laser);
  });
  input.registerAsListener(RIGHT_ARROW, function (char, code, press) {
    title = false;
    scope.setRotation(press ? 0.08 : 0);
    if (press) {
      rocketSoundEffects[1].play();
    } else {
      rocketSoundEffects[1].stop();
    }
  });
  input.registerAsListener(LEFT_ARROW, function (char, code, press) {
    title = false;
    scope.setRotation(press ? -0.08 : 0);
    if (press) {
      rocketSoundEffects[1].play();
    } else {
      rocketSoundEffects[1].stop();
    }
  });
  input.registerAsListener(UP_ARROW, function (char, code, press) {
    title = false;
    scope.setAccel(press ? 0.2 : 0);
    if (press) {
      rocketSoundEffects[0].play();
    } else {
      rocketSoundEffects[0].stop();
    }
  });

  this.update = function () {
    Entity.prototype.update.call(this);
    this.vel.mult(boostStabilizer);
    if (this.isDestroyed) {
      for (var i = 0; i < this.brokenParts.length; i++) {
        this.brokenParts[i].pos.add(this.brokenParts[i].vel);
        this.brokenParts[i].heading += this.brokenParts[i].rot;
      }
    } else {
      this.vel.mult(boostStabilizer);
    }
    if (this.shields > 0 && !title) {
      this.shields -= 1;
    }

    // More tail effect magic 
    this.tailSkip = !this.tailSkip;
    if (this.tailSkip === false) {
      for (var i = this.lastPos.length - 1; i > 0; i--) {
        this.lastPos[i][0] = this.lastPos[i - 1][0];
        this.lastPos[i][1] = this.lastPos[i - 1][1];
        this.lastPos[i][2] = this.lastPos[i - 1][2];
      }
      this.lastPos[0][0] = createVector(this.pos.x - this.r * cos(this.heading), this.pos.y - this.r * sin(this.heading));
      this.lastPos[0][1] = this.heading;
      if (this.tailEdge) {        
        this.lastPos[0][2] = 0;
        this.tailEdge = false;        
      } else {
        this.lastPos[0][2] = 1;
      }

    }
  }

  this.brokenParts = [];

  this.destroy = function () {
    this.isDestroyed = true;
    for (var i = 0; i < 6; i++)
      this.brokenParts[i] = {
        pos: this.pos.copy(),
        vel: p5.Vector.random2D(),
        heading: random(0, 360),
        rot: random(-0.07, 0.07)
      };
  }

  this.hits = function (asteroid) {

    // Are shields up?
    if (this.shields > 0) {
      return false;
    }

    // Is the ship far from the asteroid?
    var dist2 = (this.pos.x - asteroid.pos.x) * (this.pos.x - asteroid.pos.x)
      + (this.pos.y - asteroid.pos.y) * (this.pos.y - asteroid.pos.y);
    if (dist2 >= (asteroid.rmax + this.rmax2) * (asteroid.rmax + this.rmax2)) {
      return false;
    }

    // Is the ship inside the asteroid?
    if (dist2 <= asteroid.rmin2) {
      return true;
    }

    // Otherwise, we need to check for line intersection
    var vertices = [
      createVector(-2 / 3 * this.r, this.r).rotate(this.heading),
      createVector(-2 / 3 * this.r, -this.r).rotate(this.heading),
      createVector(4 / 3 * this.r, 0).rotate(this.heading)
    ];
    for (var i = 0; i < vertices.length; i++) {
      vertices[i] = p5.Vector.add(vertices[i], this.pos);
    }
    var asteroid_vertices = asteroid.vertices();

    for (var i = 0; i < asteroid_vertices.length; i++) {
      for (var j = 0; j < vertices.length; j++) {
        var next_i = (i + 1) % asteroid_vertices.length;
        if (lineIntersect(vertices[j], vertices[(j + 1) % vertices.length],
          asteroid_vertices[i], asteroid_vertices[next_i])) {
          
          return true;
        }
      }
    }
    return false;
  }

  this.playSoundEffect = function(soundArray){
    soundArray[floor(random(0,soundArray.length))].play();
  }

  this.render = function () {
    if (this.isDestroyed) {      
      // ship debris
      for (var i = 0; i < this.brokenParts.length; i++) {
        push();
        let transNum = (1 * ((this.destroyFrames--) / 1000))
        let trans = transNum > 0 ? transNum : 0;
        stroke(`rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${trans})`);
        var bp = this.brokenParts[i];
        translate(bp.pos.x, bp.pos.y);
        rotate(bp.heading);
        line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
        pop();
      }
    } else {
      //render vapor tail      
      for (var i = this.lastPos.length - 2; i >= 0; i--) {
        push();
        // won't render the tail stroke right after respawn...looks werid 
        if (this.shields < 170 ) {
          stroke(`rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${this.lastPos[i][2] / 10})`)
        } else {
          stroke(0);
        }
        fill(`rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${this.lastPos[i][2] / random(4,6)})`);
        beginShape();
        vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * -1 * ((this.lastPos.length - i / 1.05) / this.lastPos.length) * this.r, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * -1 * ((this.lastPos.length - i / 1.05) / this.lastPos.length) * this.r);

        vertex(this.lastPos[i + 1][0].x + sin(this.lastPos[i + 1][1]) * -1 * ((this.lastPos.length - (i + 1) / 1.05) / this.lastPos.length) * this.r, this.lastPos[i + 1][0].y - cos(this.lastPos[i + 1][1]) * -1 * ((this.lastPos.length - (i + 1) / 1.05) / this.lastPos.length) * this.r);

        vertex(this.lastPos[i + 1][0].x + sin(this.lastPos[i + 1][1]) * (+1) * ((this.lastPos.length - (i + 1) / 1.05) / this.lastPos.length) * this.r, this.lastPos[i + 1][0].y - cos(this.lastPos[i + 1][1]) * (+1) * ((this.lastPos.length - (i + 1) / 1.05) / this.lastPos.length) * this.r);

        vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * (+1) * ((this.lastPos.length - i / 1.05) / this.lastPos.length) * this.r, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * (+1) * ((this.lastPos.length - i / 1.05) / this.lastPos.length) * this.r);
        endShape(CLOSE);
        pop();
      }

      // draw ship
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading);
      fill(0);
      // shield up effect 
      var shieldTrans = random(1,.3)
      var shieldCol = `rgba(${mainRGB[0]},${mainRGB[1]},${mainRGB[2]},${shieldTrans})`
      var weight = this.shields > 0 ? random(1.5,4) : random(1,1.5);
      var shipColor = this.shields > 0 ? shieldCol : mainColor;
      stroke(shipColor);
      strokeWeight(weight)
      triangle(-this.r, -this.r,
        -this.r, this.r,
        4 / 3 * this.r, 0);

      // thruster animations
      if (this.accelMagnitude != 0) {
        push()
        var trans = random(.9, .2)
        stroke(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        fill(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        strokeWeight(1)
        translate(-this.r, 0);
        var thrustEnd = random(-45, -10)
        triangle(this.r - 22, this.r - 10,
          this.r - 22, -this.r + 10,
          thrustEnd, 0);
        pop()
      }
      if (this.rotation > 0) {
        push()
        var trans = random(.9, .2)
        stroke(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        fill(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        strokeWeight(1)
        translate(-this.r, 0);
        var thrustEnd = random(-35, -10)
        triangle(this.r + 15, -10,
          this.r + 25, -3,
          this.r + 20, thrustEnd);
        pop()
      }
      if (this.rotation < 0) {
        push()
        var trans = random(.9, .2)
        stroke(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        fill(`rgba(${secondaryRGB[0]},${secondaryRGB[1]},${secondaryRGB[2]},${trans})`);
        strokeWeight(1)
        translate(-this.r, 0);
        var thrustEnd = random(35, 10)
        triangle(this.r + 15, 10,
          this.r + 25, 3,
          this.r + 20, thrustEnd);
        pop()
      }

      pop();
    }
  }
}

Ship.prototype = Object.create(Entity.prototype);