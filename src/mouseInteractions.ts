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
  return new Promise<void>(async (resolve) => {
    robotjs.moveMouse(
      windowInfo.width * PLAY_BUTTON.x + windowInfo.x,
      windowInfo.height * PLAY_BUTTON.y + windowInfo.y
    );
    await sleep(1000);
    robotjs.mouseClick();
    await sleep(1000);
    robotjs.mouseClick();
    resolve();
  });
}
export function clickPass(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * PASS_BUTTON.x + windowInfo.x,
      windowInfo.height * PASS_BUTTON.y + windowInfo.y
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

export function playCardFromHand(
  cardIndex: number,
  cardsInHand: number
): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async resolve => {
    robotjs.moveMouse(
      1 +
        windowInfo.width / 2 +
        windowInfo.x -
        cardsInHand * (0.04 * windowInfo.width) +
        cardIndex * (0.09 * windowInfo.width),
      windowInfo.height + windowInfo.y - 1
    );
    await sleep();
    robotjs.mouseClick();
    await sleep();

    robotjs.moveMouse(
      windowInfo.width * CENTER_FIELD.x + windowInfo.x,
      windowInfo.height * CENTER_FIELD.y + windowInfo.y
    );
    await sleep();

    robotjs.mouseClick();
    await sleep();

    resolve();
  });
}

const sleep = (time = 1000) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
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

const PASS_BUTTON = {
  x: 0.94,
  y: 0.88,
};

// const LEFTMOST_CARD = {x: 0.14, y: 0.98};

const CENTER_FIELD = {
  x: 0.51,
  y: 0.58,
};

const PLAY_BUTTON = {
  x: 0.91,
  y: 0.93,
};
