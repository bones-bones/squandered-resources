import { THASSAS_ORACLE_NAME } from '../constants/treasureHunt'
//greToClientEvent.greToClientMessages[].type==GREMessageType_MulliganReq

function getActiveGameState(body) {
    return body.greToClientEvent.greToClientMessages.filter(entry => entry.type === 'GREMessageType_GameStateMessage')[0]
}

function getActivePlayerId(activeState) {
    return activeState.systemSeatIds[0];
}

function getPlayerHand(playerId: number, activeState) {
    const handInstances = activeState.gameStateMessage.zones.find(zoneEntry => {
        return zoneEntry.ownerSeatId == playerId && zoneEntry.type === 'ZoneType_Hand'
    }).objectInstanceIds;
    const handCards = handInstances.map(handCardId => {
        return activeState.gameStateMessage.gameObjects.find(gameObject => gameObject.instanceId == handCardId);
    })
    return handCards.map(({ name }) => name);
}

function doIMulligan(handCards) {
    return !handCards.includes(THASSAS_ORACLE_NAME);
}