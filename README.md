Notes
// Each mulligan returns a gamestate object

## GREMessageType_GameStateMessage

Is one of the most helpful things, it is essentially a full sync of game state EXCEPT if a card has been introduced as a gameObject and the state has not changed, it which case it will just be referenced by the instanceId again. It's probably worth keeping track of our known objects

## actionsAvailableReq

These are things a user _actually_ can do
