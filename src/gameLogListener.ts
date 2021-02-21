import fs from 'fs';
import { subHumanMonoGreen } from './constants/subHumanMonoGreen';
import { getActiveGameStates, getActivePlayerId, getGameObjects, getPlayerHand } from './stubsOfCode/functions';
import { Action, DeclareAttackersReqMessage, GameObject, PayCostPrompt } from './types';

export let gameObjects: { [key: string]: GameObject } = {};
let userPlayerId: number;
let trackedHand = [];
let availaibleActions: Action[] = [];


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
                    const clientMessages = ohJson.greToClientEvent.greToClientMessages;

                    console.log('Generic Client Event Time', clientMessages.map(({ type }: { type: string }) => type));


                    for (let l = 0; l < clientMessages.length; l++) {

                        switch (clientMessages[l].type) {
                            case 'GREMessageType_ConnectResp': {
                                console.log('Game Connected');
                                break;
                            }
                            case 'GREMessageType_ChooseStartingPlayerReq': {
                                console.log('Starting player being determined');
                                break;
                            }
                            case 'GREMessageType_SetSettingsResp': {
                                // probably does nothing
                                break;
                            }
                            case 'GREMessageType_DeclareBlockersReq': {
                                // no blocks
                            }
                            case 'GREMessageType_PayCostsReq': {
                                console.log('Payment Prompt')
                                //  console.log(JSON.stringify(clientMessages[l]))
                                const payCostPrompt: PayCostPrompt = clientMessages[l]
                                break;
                            }
                            case 'GREMessageType_DeclareAttackersReq': {
                                console.log('entering Turn Them Sideways step');
                                const attackerMessage: DeclareAttackersReqMessage = clientMessages[l];
                                break;
                            }
                            case 'GREMessageType_ActionsAvailableReq': {
                                console.log('Getting available actions');
                                availaibleActions = (clientMessages[l].actionsAvailableReq.actions);
                                console.log('AA', availaibleActions.map(entry => { return entry.actionType }));
                                break;
                            }
                            case undefined: {
                                console.log('game state with no type!', ohJson);
                                break;
                            }
                            case 'GREMessageType_SubmitAttackersResp': {
                                //TODO handle prompts
                            }
                            case 'GREMessageType_GameStateMessage': {
                                // This seems to be the big one
                            }

                            default: {
                                console.log('Default Case');
                                const states = getActiveGameStates(ohJson);
                                if (!userPlayerId) {
                                    userPlayerId = getActivePlayerId(states[0]);
                                    console.log(`you are player: ${userPlayerId}`);
                                }
                                if (states) {
                                    for (let k = 0; k < states.length; k++) {
                                        const gameObs = (getGameObjects(states[k]))
                                        gameObs.forEach((element: GameObject) => {
                                            gameObjects[`${element.instanceId}`] = element;
                                        });
                                        // console.log('known game objects', gameObjects)


                                    }
                                }
                                trackedHand = (getPlayerHand(userPlayerId, clientMessages[l]));
                            }
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



