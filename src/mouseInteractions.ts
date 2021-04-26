import robotjs from 'robotjs';
import { activeHoveredCard, getActiveHoveredCard, getTick, setActiveHoveredCard } from './gameLogListener';
import {
  ArenaWindowInfo,
  getArenaSizeAndPosition,
} from './stubsOfCode/macSystemInterface';
import { GameObjects, InstanceAndLocation } from './types';

let windowInfo: ArenaWindowInfo;

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

const ASSIGN_DAMAGE = { x: 0.5, y: 0.81 };

const CENTER_FIELD = {
  x: 0.51,
  y: 0.58,
};

const PLAY_BUTTON = {
  x: 0.91,
  y: 0.93,
};



const ORDER_BLOCKERS_BUTTON = { x: 0.5, y: 0.81 };
const buttonClickConstructor = (
  button: { x: number; y: number },
  sleepTime = 100
) => {
  return async () => {
    robotjs.moveMouse(
      windowInfo.width * button.x + windowInfo.x,
      windowInfo.height * button.y + windowInfo.y
    );
    await sleep(sleepTime);
    robotjs.mouseClick();
  };
};
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
export const clickPass = buttonClickConstructor(PASS_BUTTON);

export const clickInstanceInLocation = async (
  instanceAndLocation: InstanceAndLocation,
  gameObjects: GameObjects
): Promise<void> => {
  console.log('I have been told to clikc something');
  console.log(JSON.stringify(instanceAndLocation));
  console.log(JSON.stringify(gameObjects));
  setActiveHoveredCard(undefined);

  let i = 0;
  //let tick = getTick()
  let localActivHoveredCard = undefined;
  while (localActivHoveredCard != instanceAndLocation.instanceId && robotjs.getMousePos().x > 330) {
    robotjs.moveMouseSmooth(730 - i * 9, 630);
    await sleep(1500)
    localActivHoveredCard = getActiveHoveredCard();
    i++
  }

  robotjs.mouseClick();
  robotjs.moveMouseSmooth(robotjs.getMousePos().x, robotjs.getMousePos().y - 70);
  robotjs.mouseClick();

  return;
};

export const clickAttack = async (): Promise<void> => {
  robotjs.moveMouse(
    windowInfo.width * ATTACK_AND_ALL_ATTACK_BUTTON.x +
    windowInfo.x +
    0.0013 * windowInfo.width, // This is a slight offset because arena won't let you stupidclick into combat
    windowInfo.height * ATTACK_AND_ALL_ATTACK_BUTTON.y + windowInfo.y
  );
  robotjs.moveMouse(
    windowInfo.width * ATTACK_AND_ALL_ATTACK_BUTTON.x + windowInfo.x,
    windowInfo.height * ATTACK_AND_ALL_ATTACK_BUTTON.y + windowInfo.y
  );
  await sleep();
  robotjs.mouseClick();
};

export const clickOrderBlockers = buttonClickConstructor(
  ORDER_BLOCKERS_BUTTON,
  1000
);

export const clickConfirmAssignDamage = async (): Promise<void> =>
  await buttonClickConstructor(ASSIGN_DAMAGE)();

export const clickKeep = buttonClickConstructor(KEEP_BUTTON, 1000);

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
