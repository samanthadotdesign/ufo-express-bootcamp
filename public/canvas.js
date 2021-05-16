const canvas = document.querySelector('div.canvas-holder canvas');
const sandbox = new GlslCanvas(canvas);

const calcSize = function () {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  const dpi = window.devicePixelRatio;

  const s = Math.max(wh, ww + 200);

  canvas.width = s * dpi;
  canvas.height = s * dpi;
  canvas.style.width = `${s}px`;
  canvas.style.height = `${s}px`;
};

calcSize();

window.addEventListener('resize', () => {
  calcSize();
});

sandbox.load(frag);

const images = ['../assets/glitch.jpeg', '../assets/space.jpeg', '../assets/hubble.jpeg'];
let current = 0;

canvas.addEventListener('click', () => {
  current += 1;

  if (current >= images.length) {
    current = 0;
  }

  sandbox.setUniform('image', images[current]);
});

sandbox.setUniform('image', images[current]);
