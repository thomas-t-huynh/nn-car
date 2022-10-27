class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.maxReverseSpeed = -this.maxSpeed / 2;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    if (controlType !== 'DUMMY') {
      this.sensor = new Sensor(this);
    }
    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    // hypot is short for hypotenuse. Get half to get half of car.
    const rad = Math.hypot(this.width, this.height) / 2;
    // angle - tangent angle is the width / height.
    // arc tangent 2
    const alpha = Math.atan2(this.width, this.height);

    // top right corner.
    points.push({
      // combining the car angle and the alpha angle
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    // top left corner
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    // bottom left corner
    points.push({
      // Math.PI is 180 degrees
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    // bottom right corner
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < this.maxReverseSpeed) {
      this.speed = this.maxReverseSpeed;
    }

    // * Apply friction to both directions.
    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    // * car stops once speed is less than friction.
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      // * car doesn't turn when it's sitting still of course.
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }

      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    // * using trig (sin, cos) will allow you to use radius
    // * sin will handle x axis movement, where as cos does y axis.
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, color) {
    // * old way of drawing the car. Creates rectangle, but we don't have control on corners.
    // saves current state of canvas
    // ctx.save();
    // ctx.translate(this.x, this.y); // * positions car on axis.
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    // // * fills (draws) path and shape given before calling.
    // ctx.fill();
    // // * restores last saved state of canvas to maintain angle of car.
    // ctx.restore();

    if (this.damaged) {
      ctx.fillStyle = 'gray';
    } else {
      ctx.fillStyle = color;
    }

    // draw out car
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      // i = 1 bc we already did the first one
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
