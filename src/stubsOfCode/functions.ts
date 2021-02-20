import { DIG_FOR_TREASURE_NAME, THASSAS_ORACLE_NAME } from '../constants/treasureHunt'
import { gameObjects } from '../gameLogListener';
//greToClientEvent.greToClientMessages[].type==GREMessageType_MulliganReq

export function getActiveGameState(body: any) {
    if (!body.greToClientEvent) { console.log('weird json', body); return; }
    return body.greToClientEvent?.greToClientMessages.filter((entry: any) => entry.type === 'GREMessageType_GameStateMessage')[0]
}

export function getActivePlayerId(activeState: any) {
    return activeState.systemSeatIds[0];
}
export const getGameObjects: (activeState: any) => any[] = (activeState) => { console.log(activeState); return activeState.gameStateMessage.gameObjects || [] }

export function getPlayerHand(playerId: number, activeState: any) {
    if (activeState.gameStateMessage.zones) {
        const handInstances = activeState.gameStateMessage.zones.find((zoneEntry: any) => {
            console.log('z', zoneEntry)
            return zoneEntry.ownerSeatId == playerId && zoneEntry.type === 'ZoneType_Hand'
        });
        console.log('hi', handInstances)
        const handCards = handInstances?.map((handCardId: number) => gameObjects[`${handCardId}`]);


        // console.log(gameObjects, 'logging hand', handCards)
        return handCards?.map(({ name }: { name: string }) => name);
    } else { console.log('no zones yet'); return []; }
}

export function doIMulligan(handCards: number[]) {
    return !handCards?.includes(DIG_FOR_TREASURE_NAME);
}
