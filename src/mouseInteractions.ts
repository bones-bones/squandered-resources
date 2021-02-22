import robotjs from 'robotjs';
import {
  ArenaWindowInfo,
  getArenaSizeAndPosition,
} from './stubsOfCode/macSystemInterface';

let windowInfo: ArenaWindowInfo;

export function setWindowInfo(): Promise<void> {
  return new Promise<void>(resolve => {
    getArenaSizeAndPosition().then(mtgaWindowInfo => {
      console.log(
        `the window is ${mtgaWindowInfo.width} wide, ${mtgaWindowInfo.height} tall and at the position ${mtgaWindowInfo.x},${mtgaWindowInfo.y}`
      );
      windowInfo = mtgaWindowInfo;
      resolve();
    });
  });
}

export function clickPlay(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * PLAY_BUTTON.x + windowInfo.x,
      windowInfo.height * PLAY_BUTTON.y + windowInfo.y
    );
    robotjs.mouseClick();
    setTimeout(() => {
      robotjs.mouseClick();
    }, 1000);
    resolve();
  });
}

export function clickKeep(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * KEEP_BUTTON.x + windowInfo.x,
      windowInfo.height * KEEP_BUTTON.y + windowInfo.y
    );
    setTimeout(() => {
      robotjs.mouseClick();
      resolve();
    }, 1000);
  });
}

export function clickMulligan(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * MULLIGAN_BUTTON.x + windowInfo.x,
      windowInfo.height * MULLIGAN_BUTTON.y + windowInfo.y
    );
    setTimeout(() => {
      robotjs.mouseClick();
      resolve();
    }, 4000);
  });
}

const MULLIGAN_BUTTON = {
  x: 0.4,
  y: 0.81,
};
const KEEP_BUTTON = {
  x: 0.59,
  y: 0.81,
};

// const PASS_BUTTON = {
//   x: 0.94,
//   y: 0.88,
// };

// const LEFTMOST_CARD = {x: 0.14, y: 0.98};

// const CENTER_FIELD = {
//   x: 0.51,
//   y: 0.58,
// };

const PLAY_BUTTON = {
  x: 0.91,
  y: 0.93,
};
