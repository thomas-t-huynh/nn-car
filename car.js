class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.maxReverseSpeed = -this.maxSpeed / 2;
    this.friction = 0.05;
    this.angle = 0;

    this.controls = new Controls();
  }

  update() {
    this.#move();
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

    // * sin will handle x axis movement, where as cos does y axis.
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    // * saves current state of canvas
    ctx.save();
    ctx.translate(this.x, this.y); // * positions car on axis.
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    // * fills (draws) path and shape given before calling.
    ctx.fill();
    // * restores last saved state of canvas to maintain angle of car.
    ctx.restore();
  }
}
