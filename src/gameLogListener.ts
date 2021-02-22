import fs from 'fs';
import * as theActiveDeck from './constants/subHumanMonoGreen';
import {
  getActiveGameStates,
  getActivePlayerId,
  getGameObjects,
  getPlayerHand,
  sortInHand,
} from './stubsOfCode/functions';
import {
  Action,
  ActionType,
  CastAction,
  GameObject,
  InstanceAction,
} from './types';
import {clickKeep, clickMulligan} from './mouseInteractions';

export let gameObjects: {[key: string]: GameObject} = {};
let userPlayerId: number;
let trackedHand: number[] | undefined;
let availaibleActions: Action[] = [];
let handIsSorted = false;

function getValidPlays() {
  const spellsToCast = availaibleActions.filter(action => {
    return (
      action.actionType == ActionType.ActionType_Cast &&
      (action as CastAction).autoTapSolution
    );
  });
  return spellsToCast;
  //console.log(availaibleActions);
}

export const constructLogEventHandler = (
  activeLogFile: string
): (() => Promise<void>) => {
  let currentIndex = 0;

  return async () => {
    const newValue = await new Promise<string>(resolve => {
      let readData = '';
      fs.createReadStream(activeLogFile, {
        encoding: 'utf-8',
        start: currentIndex,
      })
        .on('data', data => {
          readData += data;
          console.log(data.length, 'bytes? of data');
        })
        .on('error', err => {
          console.error(err);
        })
        .on('end', () => {
          resolve(readData);
        });
    });
    currentIndex += newValue.length;

    if (newValue.includes('Event.MatchCreated')) {
      console.log('Match has been created!');
      gameObjects = {};
    }
    if (newValue.includes('GREMessageType_GameStateMessage')) {
      console.log('Game State Event!');
      const ingestedLogs = newValue.split('\n');
      const entriesThatICareAbout = ingestedLogs.filter(
        entry => entry[0] == '{' && entry[entry.length - 1] == '}'
      );
      //console.log(entriesThatICareAbout);
      if (!entriesThatICareAbout || entriesThatICareAbout.length == 0) {
        console.log('NEW LOGS', ingestedLogs);
      }
      for (let i = 0; i < entriesThatICareAbout.length; i++) {
        const responseJSON = JSON.parse(entriesThatICareAbout[i]);

        if (responseJSON.error) {
          console.error(`Error Entry: `, responseJSON.error.errorCode);
        } else if (responseJSON.authenticateResponse) {
          console.log('Authed');
        } else if (responseJSON.matchGameRoomStateChangedEvent) {
          console.log('game room change event');
        } else if (
          responseJSON.type == 'GREMessageType_OrderDamageConfirmation'
        ) {
          console.log('Time to order damage');
        } else if (responseJSON.greToClientEvent) {
          const clientMessages =
            responseJSON.greToClientEvent.greToClientMessages;

          console.log(
            'Generic Client Event Time',
            clientMessages.map(({type}: {type: string}) => type)
          );

          for (let l = 0; l < clientMessages.length; l++) {
            switch (clientMessages[l].type) {
              case 'GREMessageType_MulliganReq': {
                console.log('Mulligan Time');
                console.log(`hand:`, trackedHand);
                const keeper = theActiveDeck.isThisHandAKeeper();
                if (keeper) {
                  clickKeep();
                } else {
                  clickMulligan();
                }

                break;
              }
              case 'GREMessageType_GetSettingsResp': {
                console.log('Get settings response');
                //I'm not going to type this because it looks boring, but it contains user settings
                break;
              }
              case 'GREMessageType_PromptReq': {
                console.log('Generic Prompt');
                // This is gonna be weird. Probably need to doc all the prompt cases
                break;
              }
              case 'GREMessageType_DieRollResultsResp': {
                console.log('Die was rolled');
                //Die was rolled
                //This might not actually be called here
                break;
              }
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
                console.log('creatures are attacking, time to not block');
                // const declareBlockersRequest: DeclareBlockersRequest =
                //   clientMessages[l];
                break;
              }
              case 'GREMessageType_PayCostsReq': {
                console.log('Payment Prompt');
                //  console.log(JSON.stringify(clientMessages[l]))
                //const payCostPrompt: PayCostPrompt = clientMessages[l];
                break;
              }
              case 'GREMessageType_DeclareAttackersReq': {
                console.log('entering Turn Them Sideways step');
                // const attackerMessage: DeclareAttackersReqMessage =
                //   clientMessages[l];
                break;
              }
              case 'GREMessageType_ActionsAvailableReq': {
                console.log('Getting available actions');
                availaibleActions =
                  clientMessages[l].actionsAvailableReq.actions;
                if (availaibleActions.length > 0) {
                  if (!handIsSorted && trackedHand) {
                    const availableActionsThatArePlayableOrCastable = availaibleActions.filter(
                      aa => {
                        return (
                          (aa as InstanceAction).instanceId !== undefined &&
                          [
                            ActionType.ActionType_Play,
                            ActionType.ActionType_Cast,
                          ].includes(aa.actionType)
                        );
                      }
                    ) as InstanceAction[];

                    if (availableActionsThatArePlayableOrCastable.length > 0) {
                      const handToSort = trackedHand.map(instanceId => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        return availableActionsThatArePlayableOrCastable.find(
                          action => {
                            return action.instanceId === instanceId;
                          }
                        )!;
                      });
                      console.log(handToSort,'hand to sort')
                      const sortedHand = handToSort.sort(sortInHand);
                      trackedHand = sortedHand.map(
                        ({instanceId}) => instanceId
                      );
                      handIsSorted = true;
                    }
                  }
                }

                // let's fuckin goooo
                console.log('aa',availaibleActions);

                break;
              }
              case undefined: {
                console.log('game state with no type!', responseJSON);
                break;
              }
              case 'GREMessageType_SubmitAttackersResp': {
                //TODO handle prompts
                break;
              }
              // case 'GREMessageType_GameStateMessage': {
              //   // This seems to be the big one
              // commenting out because no fallthroughs are allowed
              //   break;
              // }

              default: {
                console.log('Default Case');
                getValidPlays();

                const states = getActiveGameStates(responseJSON);
                if (!userPlayerId) {
                  userPlayerId = getActivePlayerId(states[0]);
                  console.log(`you are player: ${userPlayerId}`);
                }
                if (states) {
                  for (let k = 0; k < states.length; k++) {
                    // console.log(
                    //   'state',
                    //   states[k]?.gameStateMessage?.turnInfo?.step
                    // );
                    if (
                      states[k]?.gameStateMessage?.turnInfo?.step == 'Step_Draw'
                    ) {
                      // In the future we shouldn't filter by draw step and instead track all card transitions
                      // Hmm we might not need this, I'll try putting the logic in the hand sync event
                      // const drawTransitions =
                      //   states[k]?.gameStateMessage.annotations;
                    }

                    const gameObs = getGameObjects(states[k]);
                    gameObs.forEach((element: GameObject) => {
                      console.log(element.instanceId);
                      gameObjects[`${element.instanceId}`] = element;
                    });
                    // console.log('known game objects', gameObjects)
                  }
                }
                const newHand = getPlayerHand(userPlayerId, clientMessages[l]);
                console.log(newHand, 'is the new hand');
                if (newHand && newHand.length > 0) {
                  if (trackedHand === undefined) {
                    // const sortedNewHand = newHand.map(instanceId => gameObjects[instanceId]);
                    // console.log('hand', sortedNewHand)
                    trackedHand = newHand;
                  } else if (trackedHand !== undefined) {
                    console.log('previous hand is ',trackedHand.join(', '));
                    const trackedHandFilteredByNewHand = trackedHand.filter(
                      entry => newHand.includes(entry)
                    );

                    const newCardsInHand = newHand.filter(entry =>
                      // disablinig the line because trackedHand can't be undefined here and i don't know how to tell ts that
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      !trackedHand!.includes(entry)
                    );
                    const reversedNewCards=newCardsInHand.reverse()
                    trackedHand=trackedHandFilteredByNewHand.concat(reversedNewCards);
                    console.log('new hand is ', trackedHand.join(', '))
                  }
                }
              }
            }
          }
        } else if (responseJSON.gameStateMessage) {
          console.log(
            'i try and sync draws',
            responseJSON.gameStateMessage.turnInfo.step
          );
        } else {
          console.log('this is new...', responseJSON);
        }
      }
    }
  };
};
