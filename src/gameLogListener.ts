import fs from 'fs';
import { treasureHunt } from './constants/treasureHunt';
import { doIMulligan, getActiveGameState, getActivePlayerId, getGameObjects, getPlayerHand } from './stubsOfCode/functions';

export let gameObjects: { [key: string]: any } = {};
let userPlayerId: number;


export const constructLogEventHandler = (activeLogFile: string) => {
    let currentIndex = 0;

    return async () => {
        const newValue = await new Promise<string>(((resolve) => {
            let readData = ''
            fs.createReadStream(activeLogFile, {
                encoding: 'utf-8',
                start: currentIndex
            }).on('data', (data) => {
                readData += data;
                console.log(data.length, 'is data')
            }).on('error', (err) => {
                console.error(err)
            }).on("end", () => { resolve(readData); })
        }));
        currentIndex += newValue.length;

        if (newValue.includes('Event.MatchCreated')) {
            console.log("Match has been created!");
            gameObjects = {};
        }
        if (newValue.includes('GREMessageType_GameStateMessage')) {
            console.log("Game State Event!");
            const ingestedLogs = (newValue.split('\n'));
            const entriesThatICareAbout = ingestedLogs.filter(entry => entry[0] == '{' && entry[entry.length - 1] == '}')
            //console.log(entriesThatICareAbout);
            for (let i = 0; i < entriesThatICareAbout.length; i++) {
                const ohJson = JSON.parse(entriesThatICareAbout[i]);

                if (ohJson.error) {
                    console.error(`Error Entry: `, ohJson.error.errorCode);
                } else if (ohJson.authenticateResponse) {
                    console.log('Authed');
                } else if (ohJson.matchGameRoomStateChangedEvent) {
                    console.log('game room change event');
                } else {
                    console.log('entryJSON', ohJson)
                    const state = getActiveGameState(ohJson);
                    if (!userPlayerId) {
                        userPlayerId = getActivePlayerId(state);
                        console.log(`you are player: ${userPlayerId}`);
                    }
                    if (state) {
                        const gameObs = (getGameObjects(state))
                        console.log(gameObs)
                        gameObs.forEach((element: { instanceId: number }) => {
                            gameObjects[`${element.instanceId}`] = element;
                        });
                        console.log('known game objects', gameObjects)

                        const hand = getPlayerHand(userPlayerId, state);
                        console.log(`your hand: `, hand?.map((entry: number) => treasureHunt[`${entry}`]));
                        console.log(doIMulligan(hand) ? 'mully' : 'keeper');
                    }
                }

            }

        }
    }
}
// cool events