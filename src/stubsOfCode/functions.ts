import { DIG_FOR_TREASURE_NAME, THASSAS_ORACLE_NAME } from '../constants/treasureHunt'
//greToClientEvent.greToClientMessages[].type==GREMessageType_MulliganReq

export function getActiveGameState(body: any) {
    return body.greToClientEvent.greToClientMessages.filter((entry: any) => entry.type === 'GREMessageType_GameStateMessage')[0]
}

export function getActivePlayerId(activeState: any) {
    return activeState.systemSeatIds[0];
}
export const getGameObjects: (activeState: any) => any = (activeState) => activeState.gameStateMessage.gameObjects

export function getPlayerHand(playerId: number, activeState: any) {
    const handInstances = activeState.gameStateMessage.zones.find((zoneEntry: any) => {
        return zoneEntry.ownerSeatId == playerId && zoneEntry.type === 'ZoneType_Hand'
    }).objectInstanceIds;
    const handCards = handInstances.map((handCardId: number) => {
        return activeState.gameStateMessage.gameObjects.find((gameObject: any) => gameObject.instanceId == handCardId);
    })
    console.log(handCards)
    return handCards.map(({ name }: { name: string }) => name);
}

export function doIMulligan(handCards: number[]) {
    return !handCards.includes(DIG_FOR_TREASURE_NAME);
}