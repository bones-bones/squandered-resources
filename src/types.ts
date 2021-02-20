export interface GameObject {
    instanceId: number // The UUID
    grpId: number    //No idea
    type: 'GameObjectType_Card' // not sure of the other states
    zoneId: 31 | 35;//31 and 35 are p1 and p2's hands. i forget what the other zones are
    visibility: 'Visibility_Private' | 'Visibility_Public'
    ownerSeatId: 1 | 2
    controllerSeatId: 1 | 1
    cardTypes: CardType[] // creature land etc
    subtypes: SubType[] // creature type, maybe other things too?
    color: Card_Color[]
    power?: { value: number }
    toughness?: { value: number }
    viewers: number[] // not sure????
    name: number // the UUID of the card
    overlayGrpId: number// not sure????
}

enum CardType {
    CardType_Creature = 'CardType_Creature'
}
enum SubType {
    SubType_Dinosaur = 'SubType_Dinosaur'
}
enum Card_Color {
    CardColor_White = 'CardColor_White',
    CardColor_Black = 'CardColor_Black',
    CardColor_Blue = 'CardColor_Blue',
    CardColor_Red = 'CardColor_Red',
    CardColor_Green = 'CardColor_Green'
}

export interface Action {
    actionType: ActionType
}
export enum ActionType {
    ActionType_Cast = 'ActionType_Cast',
    ActionType_Play = 'ActionType_Play',
    ActionType_Activate_Mana = 'ActionType_Activate_Mana',
    ActionType_Pass = 'ActionType_Pass',
    ActionType_FloatMana = 'ActionType_FloatMana'
}

export interface PassAction extends Action {
    actionType: ActionType.ActionType_Pass
}

export interface FloatMana extends Action {
    actionType: ActionType.ActionType_FloatMana
}

export interface ActivateMana extends Action {
    actionType: ActionType.ActionType_Activate_Mana
    grpId: number
    instanceId: number
    abilityGrpId: number
    manaPaymentOptions: ManaPaymentOption[]
    maxActivations: number
    isBatchable: boolean
}

//I think playaction is mostly just for lands
export interface PlayAction extends Action {
    actionType: ActionType.ActionType_Play
    grpId: number// no idea still
    instanceId: number
    shouldStop: boolean
}
//I think playaction is mostly just for lands
export interface CastAction extends Action {
    actionType: ActionType.ActionType_Cast
    grpId: number// no idea still
    instanceId: number
    shouldStop: boolean
    manaCost: CostComponent[]
    autoTapSolution?: { autoTapActions: AutoTapAction[] } //If this is present it means you can cast the spell
}
interface CostComponent {
    color: Mana_Color[]
    count: number
}

enum Mana_Color {
    Mana_Color_White = 'Mana_Color_White',
    Mana_Color_Black = 'Mana_Color_Black',
    Mana_Color_Blue = 'Mana_Color_Blue',
    Mana_Color_Red = 'CMana_Color_Red',
    Mana_Color_Green = 'Mana_Color_Green'
}

interface AutoTapAction {
    instanceId: number // iid of mana source
    abilityGrpId: number // the 100xs are basic land tapping
    manaPaymentOption: ManaPaymentOption
    costCategory: 'CostCategory_Automatic'
}
interface ManaPaymentOption {
    mana: Mana[]
}
interface Mana {
    manaId: number//this is probably an enum
    color: Mana_Color,
    srcInstanceId: number//typically the same as the AutoTapAction instanceId
    specs: { type: ManaSpecType }[]
    abilityGrpId: number//should be the same as the AutoTapAction abilityGrpId

}
enum ManaSpecType {
    ManaSpecType_Predictive = 'ManaSpecType_Predictive',
    ManaSpecType_FromSnow = 'ManaSpecType_FromSnow'
}