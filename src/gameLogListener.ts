import fs from 'fs';
import { subHumanMonoGreen } from './constants/subHumanMonoGreen';
import { getActiveGameStates, getActivePlayerId, getGameObjects, getPlayerHand } from './stubsOfCode/functions';

export let gameObjects: { [key: string]: any } = {};
let userPlayerId: number;
let trackedHand = [];


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
                console.log(data.length, 'bytes? of data')
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
            if (!entriesThatICareAbout || entriesThatICareAbout.length == 0) {
                console.log('NEW LOGS', ingestedLogs)
            }
            for (let i = 0; i < entriesThatICareAbout.length; i++) {
                const ohJson = JSON.parse(entriesThatICareAbout[i]);

                if (ohJson.error) {
                    console.error(`Error Entry: `, ohJson.error.errorCode);
                } else if (ohJson.authenticateResponse) {
                    console.log('Authed');
                } else if (ohJson.matchGameRoomStateChangedEvent) {
                    console.log('game room change event');
                } else if (ohJson.greToClientEvent) {
                    console.log('Generic Client Event Time', ohJson.greToClientEvent.greToClientMessages);

                    for (let l = 0; l < ohJson.greToClientEvent.greToClientMessages.length; l++) {
                        if (ohJson.greToClientEvent.greToClientMessages[l].type == 'GREMessageType_ConnectResp') {
                            // we probably don't care about this
                            console.log('connected');
                        } else {
                            const states = getActiveGameStates(ohJson);
                            if (!userPlayerId) {
                                userPlayerId = getActivePlayerId(states[0]);
                                console.log(`you are player: ${userPlayerId}`);
                            }
                            if (states) {
                                for (let k = 0; k < states.length; k++) {
                                    const gameObs = (getGameObjects(states[k]))
                                    gameObs.forEach((element: { instanceId: number }) => {
                                        gameObjects[`${element.instanceId}`] = element;
                                    });
                                    // console.log('known game objects', gameObjects)


                                }
                            }
                            console.log(getPlayerHand(userPlayerId, ohJson.greToClientEvent.greToClientMessages[l]))
                        }
                    }
                } else {
                    console.log('this is new...', ohJson)
                }
            }
        }
    }
}
// cool events
