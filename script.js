const canvas = document.querySelector('#signal-canvas');
const context = canvas.getContext('2d');
const word = 'LIIEFIES';
let width = 0;
let height = 0;
let frame = 0;

function random(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function clamp(value, lower, upper) { return Math.max(lower, Math.min(upper, value)); }

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.font = '6px "JetBrains Mono", monospace';
  context.textBaseline = 'middle';
}

function field(x, y, time) {
  const nx = x / width;
  const ny = y / height;
  const topWave = Math.abs(ny - (.13 + .05 * Math.sin(nx * 9.4 + time)));
  const lowerWave = Math.abs(ny - (.74 + .085 * Math.sin(nx * 8.1 - time * .8)));
  const sideWave = Math.abs(nx - (.83 + .035 * Math.sin(ny * 8.6 + time * .7)));
  const diagonal = Math.abs(ny - (.54 - nx * .56 + .025 * Math.sin(nx * 13 - time)));
  const flare = Math.hypot((nx - .4) * 1.15, (ny - .68) * .82);
  return Math.max(
    clamp(1 - topWave * 12, 0, 1) * .65,
    clamp(1 - lowerWave * 9, 0, 1) * .5,
    clamp(1 - sideWave * 12, 0, 1) * .82,
    clamp(1 - diagonal * 12, 0, 1) * .42,
    clamp(1 - flare * 3.1, 0, 1) * .38,
  );
}

function draw() {
  context.clearRect(0, 0, width, height);
  const time = frame * .006;
  const step = width < 640 ? 8 : 7;
  for (let y = 5, row = 0; y < height; y += step, row += 1) {
    for (let x = 4, column = 0; x < width; x += step, column += 1) {
      const strength = field(x, y, time);
      const noise = random(column, row);
      if (noise < .969 - strength * .77) continue;
      const flicker = .74 + .26 * Math.sin(time * 1.4 + column * .12 + row * .08);
      const green = Math.floor(183 + strength * 37);
      context.fillStyle = `rgba(${224 + Math.floor(strength * 28)},${green},${78 + Math.floor(strength * 42)},${(.12 + strength * .44 + noise * .09) * flicker})`;
      const letters = random(column + 37, row + 11) < .56 + strength * .22;
      const char = letters ? word[(column + row * 3) % word.length] : '+·•'[Math.floor(random(column + 2, row + 5) * 3)];
      context.fillText(char, x, y);
    }
  }
  frame += 1;
  window.requestAnimationFrame(draw);
}

const discord = document.querySelector('#discord-copy');
const toast = document.querySelector('#toast');
let toastTimer;
discord.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('liiefies'); } catch { /* Browser may block clipboard access. */ }
  toast.textContent = 'copied liiefies';
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 1600);
});

window.addEventListener('resize', resize);
resize();
draw();
