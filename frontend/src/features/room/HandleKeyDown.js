import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GROUPSINFO } from "./Constants";
import { useActiveCard, useSetActiveCard } from "../../contexts/ActiveCardContext";
import { setValues, incrementRound } from "./gameUiSlice";
import { 
    getDisplayName, 
    getDisplayNameFlipped, 
    getNextPlayerN, 
    leftmostNonEliminatedPlayerN, 
    functionOnMatchingCards, 
    getGroupIdStackIndexCardIndex,
    getStackByCardId,
    getCardWillpower,
    getCurrentFace,
    processTokenType,
    tokenPrintName,
} from "./Helpers";
import { get } from "https";

// const keyTokenMap: { [id: string] : Array<string | number>; } = {
const keyTokenMap = {
  "1": ["resource",1],
  "2": ["progress",1],
  "3": ["damage",1],
  "4": ["time",1],
  "5": ["willpowerThreat",1],
  "6": ["attack",1],
  "7": ["defense",1],
  "8": ["hitPoints",1],
}

export const HandleKeyDown = ({
    playerN,
    typing, 
    keypress,
    setKeypress, 
    gameBroadcast, 
    chatBroadcast
}) => {
    const gameUiStore = state => state?.gameUi;
    const gameUi = useSelector(gameUiStore);
    const dispatch = useDispatch();
    const [drawingArrowFrom, setDrawingArrowFrom] = useState(null);

    const activeCardAndLoc = useActiveCard();
    const setActiveCardAndLoc = useSetActiveCard();

    useEffect(() => {
        const onKeyDown = (event) => {
            handleKeyDown(
                event, 
                playerN,
                typing, 
                keypress, 
                setKeypress,
                gameBroadcast, 
                chatBroadcast,
            )
        }

        const onKeyUp = (event) => {
            if (event.key === "Shift") setKeypress({"Shift": false});
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameUi, typing, keypress, activeCardAndLoc]);

    const handleKeyDown = (
        event, 
        playerN,
        typing, 
        keypress, 
        setKeypress,
        gameBroadcast, 
        chatBroadcast,
    ) => {

        if (typing) return;
        if (!playerN) {
            alert("Please sit down to do that.")
            return;
        }
        const k = event.key;
        console.log(k);
        // Keep track of last pressed key
        if (k === "Shift") setKeypress({"Shift": true});
        else if (k === "Control") setKeypress({"Control": true});
        else setKeypress({"Shift": false, "Control": false});

        // General hotkeys
        if (k === "e" || k === "E") {
            // Check remaining cards in encounter deck
            const encounterStackIds = gameUi.game.groupById.sharedEncounterDeck.stackIds;
            const encounterDiscardStackIds = gameUi.game.groupById.sharedEncounterDiscard.stackIds;
            const stacksLeft = encounterStackIds.length;
            // If no cards, check phase of game
            if (stacksLeft === 0) {
                // If quest phase, shuffle encounter discard pile into deck
                if (gameUi.game.phase === "Quest") {
                    gameBroadcast("game_action",{action:"move_stacks", options:{orig_group_id: "sharedEncounterDiscard", dest_group_id: "sharedEncounterDeck", top_n: encounterDiscardStackIds.length, position: "s"}});
                    chatBroadcast("game_update",{message: " shuffles "+GROUPSINFO["sharedEncounterDiscard"].name+" into "+GROUPSINFO["sharedEncounterDeck"].name+"."});
                    return;
                } else {
                    // If not quest phase, give error message and break
                    chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty and it's not the quest phase."});
                    return;
                }
            }
            // Reveal card
            const topStackId = encounterStackIds[0];
            if (!topStackId) {
                chatBroadcast("game_update",{message: " tried to reveal a card, but the encounter deck is empty."});
                return;
            }
            const topStack = gameUi.game.stackById[topStackId];
            const topCardId = topStack["cardIds"][0];
            const topCard = gameUi.game.cardById[topCardId];
            // Was shift held down? (Deal card facedown)
            const shiftHeld = (k === "E"); // keypress[0] === "Shift";
            const message = shiftHeld ? "added facedown "+getDisplayName(topCard)+" to the staging area." : "revealed "+getDisplayNameFlipped(topCard)+"."
            chatBroadcast("game_update",{message: message});
            gameBroadcast("move_stack",{
                stack_id: topStackId, 
                dest_group_id: "sharedStaging", 
                dest_stack_index: -1,
                combine: false,
                preserve_state: shiftHeld,
            });
        } else if (k === "y") {
            dispatch(incrementRound());
        } else if (k === "d") {
            // Check remaining cards in deck
            const player1Deck = gameUi.game.groupById.player1Deck;
            const deckStackIds = player1Deck["stackIds"];
            const stacksLeft = deckStackIds.length;
            // If no cards, give error message and break
            if (stacksLeft === 0) {
                chatBroadcast("game_update",{message: " tried to draw a card, but their deck is empty."});
                return;
            }
            // Draw card
            chatBroadcast("game_update",{message: "drew a card."});
            gameBroadcast("game_action",{action: "draw_card", options: {player_n: playerN}})
            // gameBroadcast("move_stack",{
            //     stack_id: topStackId, 
            //     dest_group_id: "player1Hand", 
            //     dest_stack_index: -1,
            //     combine: false,
            //     preserve_state: false,
            // });
        } else if (k === "R") {
            if (gameUi.game.roundStep !== "7.R") {
                //gameBroadcast("set_round_step", {phase: "Refresh", round_step: "7.R"}) 
                gameBroadcast("game_action", {action: "update_values", options: {updates: [["game","roundStep", "7.R"], ["game", "phase", "Refresh"]]}});
                chatBroadcast("game_update", {message: "set the round step to 7.2-7.4: Ready cards, raise threat, pass P1 token."})
            }
            // Refresh all cards you control
            chatBroadcast("game_update",{message: "refreshes."});
            //gameBroadcast("refresh",{player_n: playerN});
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["controller", playerN]], 
                    action: "update_card_values", 
                    options: {updates: [["exhausted", false], ["rotation", 0]]}
                }
            });
            // Raise your threat
            const newThreat = gameUi.game.playerData[playerN].threat+1;
            chatBroadcast("game_update", {message: "raises threat by 1 ("+newThreat+")."});
            gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "playerData", playerN, "threat", newThreat]]}});
            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the token moving multiple times if players refresh at different times.
            if (playerN == leftmostNonEliminatedPlayerN(gameUi)) {
                const firstPlayerN = gameUi.game.firstPlayer;
                const nextPlayerN = getNextPlayerN(gameUi, firstPlayerN);
                // If nextPlayerN is null then it's a solo game, so don't pass the token
                console.log("moving token");
                console.log(firstPlayerN);
                console.log(nextPlayerN);
                if (nextPlayerN) {
                    gameBroadcast("update_values",{paths: [["game","firstPlayer", nextPlayerN]]});    
                    chatBroadcast("game_update",{message: "moved first player token to "+nextPlayerN+"."})
                }
            }
        } else if (k === "N") {
            if (gameUi["game"]["roundStep"] !== "1.R") {
                gameBroadcast("game_action", {action: "update_values", options: {updates: [["game", "phase", "Resource"], ["game", "roundStep", "1.R"]]}})
                chatBroadcast("game_update", {message: "set the round step to 1.2 & 1.3: Gain resources and draw cards."})
            }
            // The player in the leftmost non-eliminated seat is the only one that does the framework game actions.
            // This prevents, for example, the round number increasing multiple times.
            if (playerN == leftmostNonEliminatedPlayerN(gameUi)) {
                // Update round number
                const roundNumber = gameUi["game"]["roundNumber"];
                const newRoundNumber = parseInt(roundNumber) + 1;
                gameBroadcast("game_action", {action: "update_values", options:{updates:[["game", "roundNumber", newRoundNumber]]}})
                chatBroadcast("game_update",{message: "increased the round number to "+newRoundNumber+"."})
            }
            // Add a resource to each hero
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["sides","sideUp","type","Hero"],["controller",playerN], ["groupType","play"]], 
                    action: "increment_token", 
                    options: {token_type: "resource", increment: 1}
                }
            });
            // Draw a card
            gameBroadcast("game_action", {action: "draw_card", options: {player_n: playerN}})
            chatBroadcast("game_update",{message: "drew a card."});
            // Add custom set tokens per round
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["controller",playerN], ["groupType","play"]], 
                    action: "apply_tokens_per_round", 
                    options: {}
                }
            });
        } else if (k === "M") {
            if (window.confirm('Shuffle hand in deck and redraw equal number?')) {
                const hand = gameUi.game.groupById[playerN+"Hand"];
                const handSize = hand.stackIds.length;
                gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Hand", dest_group_id: playerN+"Deck", top_n: handSize, position: "s"}})
                gameBroadcast("game_action", {action: "move_stacks", options: {orig_group_id: playerN+"Deck", dest_group_id: playerN+"Hand", top_n: handSize, position: "t"}})
                chatBroadcast("game_update", {message: "shuffled "+handSize+" cards into their deck and redrew an equal number."})
            }
        } else if (k == "Escape") {
            // Remove targets from all cards you targeted
            chatBroadcast("game_update",{message: "removes all targets."});
            //gameBroadcast("refresh",{player_n: playerN});
            gameBroadcast("game_action", {
                action: "action_on_matching_cards", 
                options: {
                    criteria:[["targeting", playerN, true]], 
                    action: "update_card_values", 
                    options: {updates: [["targeting", playerN, false]]}
                }
            });
            gameBroadcast("game_action", {
                action: "update_values", 
                options: {
                    updates:[["game", "playerData", playerN, "arrows", []]], 
                }
            });
        }

        // Card specific hotkeys
        if (activeCardAndLoc != null) {  
            const activeCardId = activeCardAndLoc.card.id; 
            const activeCard = gameUi.game.cardById[activeCardId]
            const activeCardFace = getCurrentFace(activeCard);
            const displayName = getDisplayName(activeCard);
            const tokens = activeCard.tokens;
            const gsc = getGroupIdStackIndexCardIndex(gameUi.game, activeCardId);
            const groupId = gsc.groupId;
            const stackIndex = gsc.stackIndex;
            const cardIndex = gsc.cardIndex;
            const groupType = gameUi.game.groupById[groupId].type;
            // Increment token 
            if (keyTokenMap[k] !== undefined && groupType === "play") {
                var tokenType = keyTokenMap[k][0];
                tokenType = processTokenType(tokenType, activeCardFace.type);
                const printName = tokenPrintName(tokenType);
                // Check if mouse is hoving over top half or bottom half of card
                // Top half will increase tokens, bottom half will decrease
                const mousePosition = activeCardAndLoc.mousePosition;
                var delta;
                if (mousePosition === "top") delta = keyTokenMap[k][1];
                else if (mousePosition === "bottom") delta = -keyTokenMap[k][1];
                else delta = 0;
                const newVal = tokens[tokenType]+delta;
                if (newVal < 0 && ['resource','damage','progress','time'].includes(tokenType)) return;
                gameBroadcast("game_action", {action:"update_values", options: {updates: [["game","cardById",activeCard.id,"tokens",tokenType, newVal]]}});
                if (delta > 0) {
                    if (delta === 1) {
                        chatBroadcast("game_update",{message: "added "+delta+" "+printName+" token to "+displayName+"."});
                    } else {
                        chatBroadcast("game_update",{message: "added "+delta+" "+printName+" tokens to "+displayName+"."});
                    }
                } else {
                    if (delta === -1) {
                        chatBroadcast("game_update",{message: "removed "+(-delta)+" "+printName+" token from "+displayName+"."});
                    } else {
                        chatBroadcast("game_update",{message: "removed "+(-delta)+" "+printName+" tokens from "+displayName+"."});
                    }                
                }
            }
            // Set tokens to 0
            else if (k === "0" && groupType === "play") {
                var newTokens = tokens;
                for (var tokenType in newTokens) {
                    if (newTokens.hasOwnProperty(tokenType)) {
                        newTokens = {...newTokens, [tokenType]: 0};
                        //newTokens[tokenType] = 0; 
                    }
                }
                const updates = [["game","cardById",activeCardId,"tokens", newTokens]];
                dispatch(setValues({updates: updates}))
                gameBroadcast("game_action", {action:"update_values", options:{updates: updates}});
                chatBroadcast("game_update", {message: "cleared all tokens from "+displayName+"."});
            }
            // Flip card
            else if (k === "f") {
                var newSide = "A";
                if (activeCard["currentSide"] === "A") newSide = "B";
                const updates = [["game","cardById",activeCardId,"currentSide", newSide]]
                dispatch(setValues({updates: updates}))
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                if (displayName==="player card" || displayName==="encounter card") {
                    chatBroadcast("game_update", {message: "flipped "+getDisplayName(activeCard)+" faceup."});
                } else {
                    chatBroadcast("game_update", {message: "flipped "+displayName+" over."});
                }
                // Force refresh of GiantCard
                setActiveCardAndLoc({
                    ...activeCardAndLoc,
                    card: {
                        ...activeCardAndLoc.card,
                        currentSide: newSide
                    }
                });
            }
            // Exhaust card
            else if (k === "a" && groupType === "play") {
                console.log("toggle exhaust")
                var values = [true, 90];
                if (activeCard.exhausted) {
                    values = [false, 0];
                    chatBroadcast("game_update", {message: "readied "+displayName+"."});
                } else {
                    chatBroadcast("game_update", {message: "exhausted "+displayName+"."});
                }
                const updates = [["game", "cardById", activeCardId, "exhausted", values[0]], ["game", "cardById", activeCardId, "rotation", values[1]]];
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Commit to quest and exhaust
            else if (k === "q" && groupType === "play" && !activeCard["committed"] && !activeCard["exhausted"] && !keypress["Control"]) {
                console.log("commit to quest")
                // const currentWillpower = gameUi.game.playerData[playerN].willpower;
                // const newWillpower = currentWillpower + getCardWillpower(activeCard);
                const willpowerIncrement = activeCardFace.willpower + activeCard.tokens.willpower;
                const currentWillpower = gameUi.game.playerData[playerN].willpower;
                const newWillpower = currentWillpower + willpowerIncrement;
                const updates = [
                    ["game", "cardById", activeCardId, "committed", true], 
                    ["game", "cardById", activeCardId, "exhausted", true], 
                    ["game", "cardById", activeCardId, "rotation", 90],
                    ["game", "playerData", playerN, "willpower", newWillpower],
                ];
                chatBroadcast("game_update", {message: "committed "+displayName+" to the quest."});
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Commit to quest without exhausting
            else if (k === "Q" && groupType === "play" && !activeCard["committed"] && !activeCard["exhausted"] && !keypress["Control"]) {
                console.log("commit to quest")
                const willpowerIncrement = activeCardFace.willpower + activeCard.tokens.willpower;
                const currentWillpower = gameUi.game.playerData[playerN].willpower;
                const newWillpower = currentWillpower + willpowerIncrement;
                const updates = [["game", "cardById", activeCardId, "committed", true], ["game", "playerData", playerN, "willpower", newWillpower]];
                chatBroadcast("game_update", {message: "committed "+displayName+" to the quest without exhausting."});
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Uncommit to quest and ready
            else if (k === "q" && groupType === "play" && activeCard["committed"]) {
                console.log("uncommit to quest")
                const willpowerIncrement = activeCardFace.willpower + activeCard.tokens.willpower;
                const currentWillpower = gameUi.game.playerData[playerN].willpower;
                const newWillpower = currentWillpower - willpowerIncrement;
                const updates = [
                    ["game", "cardById", activeCardId, "committed", false], 
                    ["game", "cardById", activeCardId, "exhausted", false], 
                    ["game", "cardById", activeCardId, "rotation", 0],
                    ["game", "playerData", playerN, "willpower", newWillpower]
                ];
                chatBroadcast("game_update", {message: "uncommitted "+displayName+" to the quest."});
                if (activeCard["exhausted"]) chatBroadcast("game_update", {message: "readied "+displayName+"."});
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Uncommit to quest without readying
            else if (k === "Q" && groupType === "play" && activeCard["committed"]) {
                console.log("uncommit to quest")
                const willpowerIncrement = activeCardFace.willpower + activeCard.tokens.willpower;
                const currentWillpower = gameUi.game.playerData[playerN].willpower;
                const newWillpower = currentWillpower - willpowerIncrement;
                const updates = [["game", "cardById", activeCardId, "committed", false], ["game", "playerData", playerN, "willpower", newWillpower]];
                chatBroadcast("game_update", {message: "uncommitted "+displayName+" to the quest."});
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Deal shadow card
            else if (k === "s" && groupType == "play") {
                const encounterStackIds = gameUi.game.groupById.sharedEncounterDeck.stackIds;
                const stacksLeft = encounterStackIds.length;
                // If no cards, check phase of game
                if (stacksLeft === 0) {
                    chatBroadcast("game_update",{message: " tried to deal a shadow card, but the encounter deck is empty."});
                } else {
                    gameBroadcast("game_action", {action: "deal_shadow", options:{card_id: activeCardId}});
                    chatBroadcast("game_update", {message: "dealt a shadow card to "+displayName+"."});
                }
            }
            // Add target to card
            else if (k === "t") {
                const targetingPlayerN = activeCard.targeting[playerN];
                var values = [true];
                if (targetingPlayerN) {
                    values = [false]
                    chatBroadcast("game_update", {message: "removed target from "+displayName+"."});
                } else {
                    values = [true]
                    chatBroadcast("game_update", {message: "targeted "+displayName+"."});
                }
                const updates = [["game", "cardById", activeCardId, "targeting", playerN, values[0]]];
                dispatch(setValues({updates: updates}));
                gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
            }
            // Send to victory display
            else if (k === "v") {
                chatBroadcast("game_update", {message: "added "+displayName+" to the victory display."});
                gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: "sharedVictory", dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
            }
            // Send to appropriate discard pile
            else if (k === "x") {
                // If card is the parent card of a stack, discard the whole stack
                if (cardIndex == 0) {
                    const stack = getStackByCardId(gameUi.game.stackById, activeCardId);
                    if (!stack) return;
                    const cardIds = stack.cardIds;
                    for (var cardId of cardIds) {
                        const cardi = gameUi.game.cardById[cardId];
                        console.log("discarding ", cardi);
                        const discardGroupId = cardi["discardGroupId"];
                        chatBroadcast("game_update", {message: "discarded "+getDisplayName(cardi)+" to "+GROUPSINFO[discardGroupId].name+"."});
                        gameBroadcast("game_action", {action: "move_card", options: {card_id: cardId, dest_group_id: discardGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                    }
                // If the card is a child card in a stack, just discard that card
                } else {
                    const discardGroupId = activeCard["discardGroupId"]
                    chatBroadcast("game_update", {message: "discarded "+displayName+" to "+GROUPSINFO[discardGroupId].name+"."});
                    gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: discardGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                }
                // If the card was a quest card, load the next quest card
                if (activeCardFace.type == "Quest") {
                    const questDeckStackIds = gameUi.game.groupById[activeCard.loadGroupId].stackIds;
                    if (questDeckStackIds.length > 0) {
                        chatBroadcast("game_update", {message: "advanced the quest."});
                        gameBroadcast("game_action", {action: "move_stack", options: {stack_id: questDeckStackIds[0], dest_group_id: groupId, dest_stack_index: stackIndex, dest_card_index: 0, combine: false, preserve_state: false}})
                    }
                }
                //dispatch(setGame(gameUi.game));
            }
            // Shufle card into owner's deck
            else if (k === "h") {
                // determine destination groupId
                var destGroupId = "sharedEncounterDeck";
                if (activeCard.owner === "player1") destGroupId = "player1Deck";
                else if (activeCard.owner === "player2") destGroupId = "gPlayer2Deck";
                else if (activeCard.owner === "player3") destGroupId = "gPlayer3Deck";
                else if (activeCard.owner === "player4") destGroupId = "gPlayer4Deck";
                gameBroadcast("game_action", {action: "move_card", options: {card_id: activeCardId, dest_group_id: destGroupId, dest_stack_index: 0, dest_card_index: 0, combine: false, preserve_state: false}})
                // gameBroadcast("move_card", {orig_group_id: groupId, orig_stack_index: stackIndex, orig_card_index: cardIndex, dest_group_id: destGroupId, dest_stack_index: 0, dest_card_index: 0, create_new_stack: true})
                gameBroadcast("game_action", {action: "shuffle_group", options: {group_id: destGroupId}})
                // gameBroadcast("shuffle_group", {group_id: destGroupId})
                chatBroadcast("game_update",{message: "shuffled "+displayName+" from "+GROUPSINFO[groupId].name+" into "+GROUPSINFO[destGroupId].name+"."})
            }
            // Draw an arrow
            else if (k === "w") {
                // Determine if this is the start or end of the arrow
                if (drawingArrowFrom) {
                    const drawingArrowTo = activeCardId;
                    const oldArrows = gameUi.game.playerData[playerN].arrows;
                    const newArrows = oldArrows.concat([[drawingArrowFrom, drawingArrowTo]]);
                    //const updates = [["game", "cardById", drawingArrowFrom, "arrowIds", newArrowIds]];
                    const updates = [["game", "playerData", playerN, "arrows", newArrows]];
                    dispatch(setValues({updates: updates}));
                    gameBroadcast("game_action", {action: "update_values", options:{updates: updates}});
                    setDrawingArrowFrom(null);
                } else {
                    setDrawingArrowFrom(activeCardId);
                }
            }
        }
    }
    return (null);
}