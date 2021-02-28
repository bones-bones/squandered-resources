import {Deck, GameObject} from './types';

export const getHandAsText = ({
  hand,
  gameObjects,
  deck,
}: {
  hand: number[];
  gameObjects: {[key: string]: GameObject};
  deck: Deck;
}): string =>
  hand
    .map(
      (iid: number) =>
        deck.cardMappings[`${gameObjects[iid].name}`] || gameObjects[iid].name
    )
    .join(', ');
