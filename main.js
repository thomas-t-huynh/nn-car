const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
  car.update();

  canvas.height = window.innerHeight; //* prevents car from elongating somehow....

  // * Gives the effect that a camera is lock on car.
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.5); // * Moves canvas by the distance of the car traveling.

  road.draw(ctx);
  car.draw(ctx);

  // * Part of camera effect. Maintains y translate.
  ctx.restore();
  // * calls animate frame multiple times to give it seamless animation look.
  requestAnimationFrame(animate);
}
