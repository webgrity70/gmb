const colors = ['#ba68c8', '#3cd6ab', '#ebce41', '#ef6a78'];

function r(min, max) {
  return Math.random() * (max - min) + min;
}

export const yesOptions = {
  angle: r(55, 125),
  spread: r(50, 70),
  particleCount: r(50, 100),
  colors,
};

export const noOptions = {
  particleCount: 10,
  startVelocity: 0,
  ticks: 300,
  colors: ['#828282'],
  shapes: ['circle'],
};

export const emptyOptions = {
  particleCount: 10,
  startVelocity: 0,
  ticks: 300,
  colors: ['#828282'],
  shapes: ['circle'],
};

export const halfOptions = {
  angle: r(55, 125),
  spread: r(50, 70),
  particleCount: r(50, 10),
  colors,
};

export const almostFullOptions = {
  angle: r(55, 125),
  spread: r(50, 70),
  particleCount: r(50, 100),
  colors,
};

export const fullOptions = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  shapes: ['square'],
  colors,
};
