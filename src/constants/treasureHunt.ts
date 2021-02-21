/**
 * Extra idiot mode.
 * Could use cycling lands but that would require more decision points.
 */
export const SNOW_ISLAND = 11605; // 52x I'm too poor to afford the pokemon lands
export const DIG_FOR_TREASURE_NAME = 24877; // 3x
export const MYSTIC_SANCTUARY_NAME = 414466; // 4x
export const THASSAS_ORACLE_NAME = 419870; // 1x

export const treasureHunt: {[key: string]: string} = {
  '11605': 'Snow-Covered Island',
  '414466': 'Mystic Sanctuary',
  '419870': "Lil' mermaid",
  '24877': 'Dig for treasure',
};

// const hand = getPlayerHand(userPlayerId, states[k]);
// console.log(`your hand: `, hand?.map((entry: number) => treasureHunt[`${entry}`]));
// console.log(doIMulligan(hand) ? 'mully' : 'keeper');

export function doIMulligan(handCards: number[]) {
  return !handCards?.includes(DIG_FOR_TREASURE_NAME);
}
