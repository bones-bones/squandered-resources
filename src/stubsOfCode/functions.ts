import { gameObjects } from '../gameLogListener';
import { ActionType, CastAction, InstanceAction, Mana_Color } from '../types';
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


export function sortInHand(a: InstanceAction, b: InstanceAction): number {
    // Future note: we'll need to sort by color eventually. This code mostly works by virtue of people playing monocolor
    // oh god how do they sort cards with the same mana cost. RIP ME
    // holy shit i don't know how to typeguard
    if (a.actionType === ActionType.ActionType_Play) {
        // Lands to the beginning, baby
        return -1;
    }
    if (b.actionType === ActionType.ActionType_Play) {
        return 1;
    }
    const aAsCastable = a as CastAction;
    const bAsCastable = b as CastAction;
    const aManaCost = aAsCastable.manaCost;
    const bManaCost = bAsCastable.manaCost;

    //time to sort by CMC/ManaValue
    const aManaValue = aManaCost.map(({ count }) => count).reduce((newValue, total) => newValue + total, 0);
    const bManaValue = bManaCost.map(({ count }) => count).reduce((newValue, total) => newValue + total, 0);
    if (aManaValue < bManaValue) {
        return -1
    }
    if (aManaValue > bManaValue) {
        return 1
    }
    //Time to sort by color composition. ie {B}{B}{B} sorts before {2}{B}
    const aGenericManaCount = aManaCost.find(({ color: { 0: manaColor } }) => manaColor === Mana_Color.ManaColor_Generic)?.count || 0;
    const bGenericManaCount = bManaCost.find(({ color: { 0: manaColor } }) => manaColor === Mana_Color.ManaColor_Generic)?.count || 0;
    return aGenericManaCount < bGenericManaCount ? -1 : 1
}