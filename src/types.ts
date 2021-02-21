export interface GameObject {
  instanceId: number; // The UUID
  grpId: number; //No idea
  type: 'GameObjectType_Card'; // not sure of the other states
  zoneId: 31 | 35; //31 and 35 are p1 and p2's hands. i forget what the other zones are
  visibility: 'Visibility_Private' | 'Visibility_Public';
  ownerSeatId: 1 | 2;
  controllerSeatId: 1 | 1;
  cardTypes: CardType[]; // creature land etc
  subtypes: SubType[]; // creature type, maybe other things too?
  color: Card_Color[];
  power?: {value: number};
  toughness?: {value: number};
  viewers: number[]; // not sure????
  name: number; // the UUID of the card
  overlayGrpId: number; // not sure????
}

enum CardType {
  CardType_Creature = 'CardType_Creature',
}
enum SubType {
  SubType_Dinosaur = 'SubType_Dinosaur',
}
enum Card_Color {
  CardColor_White = 'CardColor_White',
  CardColor_Black = 'CardColor_Black',
  CardColor_Blue = 'CardColor_Blue',
  CardColor_Red = 'CardColor_Red',
  CardColor_Green = 'CardColor_Green',
}

export interface Action {
  actionType: ActionType;
}
export enum ActionType {
  ActionType_Cast = 'ActionType_Cast',
  ActionType_Play = 'ActionType_Play',
  ActionType_Activate_Mana = 'ActionType_Activate_Mana',
  ActionType_Pass = 'ActionType_Pass',
  ActionType_FloatMana = 'ActionType_FloatMana',
}

export interface PassAction extends Action {
  actionType: ActionType.ActionType_Pass;
}

export interface FloatMana extends Action {
  actionType: ActionType.ActionType_FloatMana;
}

export interface ActivateMana extends Action {
  actionType: ActionType.ActionType_Activate_Mana;
  grpId: number;
  instanceId: number;
  abilityGrpId: number;
  manaPaymentOptions: ManaPaymentOption[];
  maxActivations: number;
  isBatchable: boolean;
}

//I think playaction is mostly just for lands
export interface PlayAction extends Action {
  actionType: ActionType.ActionType_Play;
  grpId: number; // no idea still
  instanceId: number;
  shouldStop: boolean;
}
//I think playaction is mostly just for lands
export interface CastAction extends Action {
  actionType: ActionType.ActionType_Cast;
  grpId: number; // no idea still
  instanceId: number;
  shouldStop: boolean;
  manaCost: CostComponent[];
  autoTapSolution?: {autoTapActions: AutoTapAction[]}; //If this is present it means you can cast the spell
}
interface CostComponent {
  color: Mana_Color[];
  count: number;
}

enum Mana_Color {
  Mana_Color_White = 'Mana_Color_White',
  Mana_Color_Black = 'Mana_Color_Black',
  Mana_Color_Blue = 'Mana_Color_Blue',
  Mana_Color_Red = 'CMana_Color_Red',
  Mana_Color_Green = 'Mana_Color_Green',
}

interface AutoTapAction {
  instanceId: number; // iid of mana source
  abilityGrpId: number; // the 100xs are basic land tapping
  manaPaymentOption: ManaPaymentOption;
  costCategory: 'CostCategory_Automatic';
}
interface ManaPaymentOption {
  mana: Mana[];
}
interface Mana {
  manaId: number; //this is probably an enum
  color: Mana_Color;
  srcInstanceId: number; //typically the same as the AutoTapAction instanceId
  specs: {type: ManaSpecType}[];
  abilityGrpId: number; //should be the same as the AutoTapAction abilityGrpId
}
enum ManaSpecType {
  ManaSpecType_Predictive = 'ManaSpecType_Predictive',
  ManaSpecType_FromSnow = 'ManaSpecType_FromSnow',
}

export interface DeclareAttackersReqMessage {
  type: 'GREMessageType_DeclareAttackersReq';
  systemSeatIds: [1 | 2];
  msgId: number; //unsure
  gameStateId: number; //who knows
  prompt: {promptId: number}; //  might just be 6???
  declareAttackersReq: {
    attackers: DeclaredAttacker[];
    qualifiedAttackers: PossibleAttacker[];
  };
  allowUndo: boolean;
}

// aka this creature could attack
interface PossibleAttacker {
  attackerInstanceId: number; //iid of the game object
  legalDamageRecipients: LegalDamageRecipient[];
}
interface LegalDamageRecipient {
  type: 'DamageRecType_Player'; // planeswalker is probably an option too
  playerSystemSeatId: [1 | 2];
}
interface DeclaredAttacker extends PossibleAttacker {
  selectedDamageRecipient: LegalDamageRecipient;
}

export interface PayCostPrompt {
  type: 'GREMessageType_PayCostsReq';
  systemSeatIds: [1 | 2];
  msgId: number;
  gameStateId: number;
  prompt: {promptId: number; parameters: PromptParameter[]};
  payCostsReq: {
    manaCost: {
      color: Mana_Color[];
      count: number;
      objectId: number; // I feel like objectId is important but I don't know why
    }[];
    paymentActions: {
      actions: PaymentAction[];
    };
    paymentSelection: {
      //This is a big mystery
      context: 'SelectionContext_ManaPool';
      optionType: 'OptionType_Select';
      optionContext: 'OptionContext_Payment';
      listType: 'SelectionListType_Dynamic';
      idx: number;
      validationType: 'SelectionValidationType_NonRepeatable';
    };
    autoTapActionsReq: {
      autoTapSolutions: AutoTapSolution[];
    };
  };
  nonDecisionPlayerPrompt: {
    promptId: number;
    parameters: {
      parameterName: 'PlayerId';
      type: 'ParameterType_Number';
      numberValue: 1;
    }[];
  };
  allowCancel: 'AllowCancel_Abort';
  allowUndo: boolean;
}

interface PromptParameter {
  parameterName: 'Cost' | 'PlayerId';
  type:
    | 'ParameterType_NonLocalizedString'
    | 'ParameterType_Reference'
    | 'ParameterType_Number';
  stringValue?: 'oGoGoGoGoG'; // this bit baffles me
  numberValue?: number;
  reference?: {
    type: string;
    id: number;
  };
}

interface PaymentAction extends Action {
  actionType: ActionType.ActionType_Activate_Mana;
  grpId: number;
  instanceId: number; //unsure what this refers to
  abilityGrpId: number; //the ability that produces mana
  manaPaymentOptions: ManaPaymentOption[];
  maxActivations: number;
  isBatchable: boolean;
}

interface AutoTapSolution {
  autoTapActions: {
    instanceId: number;
    abilityGrpId: number; // the mana source
    manaPaymentOption: ManaPaymentOption;
    costCategory: 'CostCategory_Automatic';
  }[];

  manaPaymentConditions: ManaPaymentCondition[];
}
interface ManaPaymentCondition {
  colors: Mana_Color[];
  specs?: ManaSpecType[]; // okay there is some weirdness here. Technically Predictive mana counts as a spec
  abilityGrpId: number;
  type: 'ManaPaymentConditionType_Threshold';
}

export interface DeclareBlockersRequest {
  type: 'GREMessageType_DeclareBlockersReq';
  systemSeatIds: [1 | 2];
  msgId: number;
  gameStateId: number; // never seen this before...
  prompt: {
    promptId: 7;
  };
  declareBlockersReq: {blockers: Blocker[]};
}

interface Blocker {
  blockerInstanceId: number; // id of the creature that could possibly block
  attackerInstanceIds: number[]; //iids of all attacking creatures that this could block
  maxAttackers: number; // I assume the number of creatures this can block?
}

export interface DieRollResultResp {
  type: 'GREMessageType_DieRollResultsResp';
  systemSeatIds: [1, 2];
  msgId: number; //This seems to be close to the transaction id
  dieRollResultsResp: {
    playerDieRolls: DieRoll[];
  };
}
interface DieRoll {
  systemSeatId: 1 | 2;
  rollValue: number;
}

export interface GenericPrompt {
  type: 'GREMessageType_PromptReq';
  systemSeatIds: [1, 2];
  msgId: number;
  gameStateId: number;
  prompt: {promptId: number; parameters: PromptParameter[]};
}

export interface MulliganRequest {
  type: 'GREMessageType_MulliganReq';
  systemSeatIds: [1 | 2];
  msgId: number;
  gameStateId: number;
  prompt: {
    promptId: 34;
    parameters: {
      parameterName: 'NumberOfCards';
      type: 'ParameterType_Number';
      numberValue: number;
    };
  };
  mulliganReq: {mulliganType: 'MulliganType_London'};
}
