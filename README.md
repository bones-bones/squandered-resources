Notes
// Each mulligan returns a gamestate object

## GREMessageType_GameStateMessage

Is one of the most helpful things, it is essentially a full sync of game state EXCEPT if a card has been introduced as a gameObject and the state has not changed, it which case it will just be referenced by the instanceId again. It's probably worth keeping track of our known objects

## actionsAvailableReq

These are things a user _actually_ can do

## Window position info

the window is 1152 wide, 676 tall

Mulligan 462x550 - 0.4 x 0.81
Accept 682x550 - 0.59 x 0.81

Pass 1082x595 - 0.94 x 0.88

leftmostcard 162x665 - 0.14 x 0.98

centerfield 582x395 - 0.51 x 0.58

Play 1049x 630 - 0.91 x 0.93

## Hand Logic

If hand has not been instantiated, then sort it according to the CMC logic (not sure how to sort lands yet).
If the hand has been instantiated, then newly drawn cards will be put at the righthand side and the front of the hand array.
