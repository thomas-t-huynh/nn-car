const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'KEYS');
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight; //* prevents car from elongating somehow....

  // * Gives the effect that a camera is lock on car.
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7); // * Moves canvas by the distance of the car traveling.
  // * the following variables are: direction of "camera" movement, distance of the movement , % of canvas for where we position the car.

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, 'red');
  }
  car.draw(ctx, 'blue');

  // * Part of camera effect. Maintains y translate.
  ctx.restore();
  // * calls animate frame multiple times to give it seamless animation look.
  requestAnimationFrame(animate);
}
