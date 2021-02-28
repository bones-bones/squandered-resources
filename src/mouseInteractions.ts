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

export async function clickPlayMatch(): Promise<void> {
  robotjs.moveMouse(
    windowInfo.width * PLAY_BUTTON.x + windowInfo.x,
    windowInfo.height * PLAY_BUTTON.y + windowInfo.y
  );
  await sleep(500);
  robotjs.mouseClick();
  await sleep(1000);
  robotjs.mouseClick();
}

export function clickConfirmButton(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * PASS_BUTTON.x + windowInfo.x,
      windowInfo.height * PASS_BUTTON.y + windowInfo.y
    );
    robotjs.mouseClick();
    resolve();
  });
}
export async function clickPass(): Promise<void> {
  await buttonClickConstructor(PASS_BUTTON)();
}

function buttonClickConstructor(button: {x: number; y: number}) {
  return async () => {
    robotjs.moveMouse(
      windowInfo.width * button.x + windowInfo.x,
      windowInfo.height * button.y + windowInfo.y
    );
    await sleep(100);
    robotjs.mouseClick();
  };
}
export const clickAttack=async():Promise<void>=>await buttonClickConstructor(ATTACK_AND_ALL_ATTACK_BUTTON)();

export function clickOrderBlockers(): Promise<void> {
  return new Promise<void>(resolve => {
    robotjs.moveMouse(
      windowInfo.width * ORDER_BLOCKERS_BUTTON.x + windowInfo.x,
      windowInfo.height * ORDER_BLOCKERS_BUTTON.y + windowInfo.y
    );
    setTimeout(() => {
      robotjs.mouseClick();
      resolve();
    }, 1000);
  });
}

export const clickConfirmAssignDamage = async (): Promise<void> =>
  await buttonClickConstructor(ASSIGN_DAMAGE)();

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
  console.log(
    `playing card @ index ${cardIndex} of ${cardsInHand} total cards`
  );
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
    await sleep(300);
    robotjs.mouseClick();
    await sleep(300);
    robotjs.moveMouse(
      windowInfo.width * CENTER_FIELD.x + windowInfo.x,
      windowInfo.height * CENTER_FIELD.y + windowInfo.y
    );
    await sleep(300);
    robotjs.mouseClick();
    // await sleep();

    resolve();
  });
}

export const sleep = (time = 1000): Promise<void> => {
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

const ATTACK_AND_ALL_ATTACK_BUTTON = {
  x: 0.94,
  y: 0.88,
};

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

const ASSIGN_DAMAGE = {x: 0.5, y: 0.81};

// const LEFTMOST_CARD = {x: 0.14, y: 0.98};

const CENTER_FIELD = {
  x: 0.51,
  y: 0.58,
};

const PLAY_BUTTON = {
  x: 0.91,
  y: 0.93,
};

const ORDER_BLOCKERS_BUTTON = {x: 0.5, y: 0.81};
