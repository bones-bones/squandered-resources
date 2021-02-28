import {
  Action,
  ActionType,
  ActivateMana,
  CastAction,
  PlayAction,
} from './types';

export const getLandToPlayDefault = (playableLands: PlayAction[]): number =>
  playableLands[0].instanceId;

export const getCastOptimizingManaUsage = (
  availaibleActions: Action[]
): number | undefined => {
  const playActions = actionsFilterByType<CastAction>(
    availaibleActions,
    ActionType.ActionType_Cast
  );
  const manaActions = actionsFilterByType<ActivateMana>(
    availaibleActions,
    ActionType.ActionType_Activate_Mana
  );
  // Assumptions: we're playing monocolor and we only need to worry about CMC
  const manaToWorkWith = manaActions.length;

  const playables: {instanceId: number; manaValue: number}[] = playActions.map(
    ({instanceId, manaCost}) => {
      return {
        instanceId,
        manaValue: manaCost
          .map(({count}) => count)
          .reduce((newValue, total) => newValue + total, 0),
      };
    }
  );
  console.log(JSON.stringify(playables));

  // Exact mana usage
  for (let i = 0; i < playables.length; i++) {
    if (playables[i].manaValue == manaToWorkWith) {
      return playables[i].instanceId;
    }
  }
  //things that would allow for another play
  for (let i = 0; i < playables.length; i++) {
    const tempMana = manaToWorkWith - playables[i].manaValue;
    for (let j = 0; j < playables.length; j++) {
      if (j != i && playables[j].manaValue <= tempMana) {
        return playables[i].instanceId;
      }
    }
  }
  const sortedPlayablesDescending = playables.sort(
    ({manaValue: manaValueA}, {manaValue: manaValueB}) =>
      manaValueA - manaValueB
  );

  return sortedPlayablesDescending[0].instanceId;
};

function actionsFilterByType<T extends Action>(
  actions: Action[],
  type: ActionType
): T[] {
  // wow i'm really bad at TS. I'm sorry, austin
  return (actions as any).filter(({actionType}: any) => actionType == type);
}
