import { gameObjects } from '../gameLogListener';
//greToClientEvent.greToClientMessages[].type==GREMessageType_MulliganReq

export function getActiveGameStates(body: any): any[] {
    if (!body.greToClientEvent) {
        console.log('weird json', body);
        return [];
    }
    return body.greToClientEvent?.greToClientMessages.filter((entry: any) => entry.type === 'GREMessageType_GameStateMessage')
}

export function getActivePlayerId(activeState: any) {
    return activeState.systemSeatIds[0];
}
export const getGameObjects: (activeState: any) => any[] = (activeState) => { return activeState.gameStateMessage.gameObjects || [] }

export function getPlayerHand(playerId: number, activeState: any): number[] | null { // the return type here is probably just number[]
    if (activeState && activeState.gameStateMessage && activeState.gameStateMessage.zones) {
        const handInstances = activeState.gameStateMessage.zones.find((zoneEntry: any) => {
            return zoneEntry.ownerSeatId ==
                playerId && zoneEntry.type === 'ZoneType_Hand'
        })?.objectInstanceIds;

        if (!handInstances) { return [] }

        //const handCards = handInstances?.map((handCardId: number) => gameObjects[`${handCardId}`]);
        return handInstances
        // console.log(handInstances, 'logging hand', handCards)
        // return handCards?.map(({ name }: { name: string }) => name);
    } else { return null; }
}

