import p5 from 'p5';

let greenPepeImg;
let yellowPepeImg;
let pondLilyPadsBg;

const greenStartPos = [
  { x: 17, y: 500, color: 'green' },
  { x: 213, y: 500, color: 'green' },
  { x: 409, y: 500, color: 'green' },
  // { x: 409, y: 320 },
  // { x: 605, y: 500 }
];

const yellowStartPos = [
  { x: 801, y: 500, color: 'yellow' },
  { x: 997, y: 500, color: 'yellow' },
  { x: 1193, y: 500, color: 'yellow' }
];

let pepes = [...greenStartPos, false, ...yellowStartPos];

let currentIdx = -1;

let yMoving = 500, yVel = 0, xVel = 0, step = 0;
const groundY = 634, gravity = 5;

const myp5 = new p5(() => { }, document.getElementById('p5_view'));

const swap = (arr, i, j) => {
  if (!("length" in arr)) {
    return false;
  }
  if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) {
    return false;
  }
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

myp5.preload = () => {
  // 150, 134
  greenPepeImg = myp5.loadImage('./assets/green-pepe-smile.png');
  yellowPepeImg = myp5.loadImage('./assets/yellow-pepe-smile.png');
  pondLilyPadsBg = myp5.loadImage('./assets/lily-pads-bg.jpeg');
}

myp5.setup = () => {
  myp5.createCanvas(1360, 760);
  // myp5.createCanvas(myp5.windowWidth - 300, myp5.windowHeight - 100);
}

myp5.windowResized = () => {
  // myp5.resizeCanvas(myp5.windowWidth - 300, myp5.windowHeight - 100);
}

myp5.draw = () => {
  myp5.background(pondLilyPadsBg);

  for (let i = 0; i < pepes.length; i++) {
    if (pepes[i]) {
      const pepe = pepes[i];
      const pepeImg = pepe.color === 'green' ? greenPepeImg : yellowPepeImg;

      if (i === currentIdx) {
        // if pepe.y + pepe.height < ground (if pepe is in the air)
        if (pepe.y + 134 <= groundY) {
          pepe.y += gravity;
        }

        pepe.y += yVel;
        yMoving = pepe.y;
        yVel /= 1.2;

        if (xVel > 0) {
          pepe.x += step;
          xVel -= step;
          if (xVel < 0) {
            xVel = 0;
          }
        }

        if (xVel < 0) {
          pepe.x += step;
          xVel -= step;
          if (xVel > 0) {
            xVel = 0;
          }
        }
      }

      myp5.image(pepeImg, pepe.x, pepe.y);
    }
  }

}

const slideRight = (index, diff) => {
  xVel = 196;
  if (diff == 2) {
    xVel *= 2;
  }
  step = xVel / 50;
  swap(pepes, index, index + diff);
  currentIdx = index + diff;
}

const slideLeft = (index, diff) => {
  xVel = -196;
  if (diff == 2) {
    xVel *= 2;
  }
  step = xVel / 50;
  swap(pepes, index - diff, index);
  currentIdx = index - diff;
}

const jumpRight = (index) => {
  yVel = -50;
  slideRight(index, 2);
}

const jumpLeft = (index) => {
  yVel = -50;
  slideLeft(index, 2);
}

myp5.mousePressed = () => {
  if (yMoving + 134 < groundY || xVel !== 0) return false;

  let idx = pepes.findIndex((e) => {
    if (!e) return false;
    const xT = e.x;
    const xB = e.x + 150;
    const yL = e.y;
    const yR = e.y + 134;
    return xT <= myp5.mouseX && myp5.mouseX <= xB
      && yL <= myp5.mouseY && myp5.mouseY <= yR;
  });

  if (pepes[idx]) {
    if (pepes[idx].color === 'green') {
      if (idx + 1 >= pepes.length) {
        return false;
      }
      if (!pepes[idx + 1]) {
        slideRight(idx, 1);
        return false;
      }

      if (idx + 2 >= pepes.length) {
        return false;
      }
      if (!pepes[idx + 2]) {
        jumpRight(idx);
      }
    }

    if (pepes[idx].color === 'yellow') {
      if (idx - 1 < 0) {
        return false;
      }
      if (!pepes[idx - 1]) {
        slideLeft(idx, 1);
        return false;
      }

      if (idx - 2 < 0) {
        return false;
      }
      if (!pepes[idx - 2]) {
        jumpLeft(idx);
      }
    }
  }

  return false;
}

