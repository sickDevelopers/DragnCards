import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Constants } from "../../game_constants";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chat from "../chat/Chat";
import Group from "./Group";
import { reorderGroups } from "./Reorder";
import Card from "./Card";
import uuid from "uuid/v4";
import cx from "classnames";
import styled from "@emotion/styled";

const WidthContainer = styled.div`
  padding: 2px 2px 2px 2px;
  float: left;
  height: 100%;
`;

const onDragEnd = (result, groups, setGroups, broadcast) => {
  console.log(result);
  if (!result.destination) return;
  const { source, destination } = result;
  var newGroups = {};
  if (source.droppableId !== destination.droppableId) {
    const sourceGroup = groups[source.droppableId];
    const destGroup = groups[destination.droppableId];
    const sourceStacks = [...sourceGroup.stacks];
    const destStacks = [...destGroup.stacks];
    const [removed] = sourceStacks.splice(source.index, 1);
    destStacks.splice(destination.index, 0, removed);
    newGroups = {
      ...groups,
      [source.droppableId]: {
        ...sourceGroup,
        stacks: sourceStacks
      },
      [destination.droppableId]: {
        ...destGroup,
        stacks: destStacks
      }
    }
  } else {
    const group = groups[source.droppableId];
    const copiedStacks = [...group.stacks];
    const [removed] = copiedStacks.splice(source.index, 1);
    copiedStacks.splice(destination.index, 0, removed);
    newGroups = {
      ...groups,
      [source.droppableId]: {
        ...group,
        stacks: copiedStacks
      }
    }
  }
  setGroups(newGroups);
  broadcast("update_groups",{groups: newGroups});
};

export const Groups = ({
  gameUIView,
  broadcast,
}) => {
  const [groups, setGroups] = useState(gameUIView.game_ui.game.groups);
  const [showScratch, setShowScratch] = useState(false);
  const [phase, setPhase] = useState(1);
  const [activeCard, setActiveCard] = useState(null);

  function toggleScratch() {
    if (showScratch) setShowScratch(false);
    else setShowScratch(true);
  }

  function changePhase(num) {
    if (num!=phase) setPhase(num);
  }

  useEffect(() => {    
    setGroups(gameUIView.game_ui.game.groups);
  }, [gameUIView.game_ui.game.groups]);



  const onDragEnd = (result) => {
    if (result.combine) {
      return;
      // const column = state.columns[result.source.droppableId];
      // const withQuoteRemoved = [...column];
      // withQuoteRemoved.splice(result.source.index, 1);
      // const columns = {
      //   ...state.columns,
      //   [result.source.droppableId]: withQuoteRemoved
      // };
      // setState({ columns, ordered: state.ordered });
      // return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }
    console.log(result);
    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log('here');
    const data = reorderGroups({
      groups: groups,
      source,
      destination
    });

    setGroups(data.groups);
    // setState({
    //   columns: data.quoteMap,
    //   ordered: state.ordered
    // });
  };



  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >

    <div className="flex flex-1 h-full">
      {/* Right panel */}
      <div className="flex flex-col w-8">
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==7) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(7)}>Refresh</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==6) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(6)}>Combat</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==5) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(5)}>Encounter</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==4) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(4)}>Travel</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==3) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(3)}>Quest</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==2) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(2)}>Planning</div>
        <div 
          className={`flex flex-col flex-1 text-center p-1 select-none ${(phase==1) ? "bg-gray-600" : "bg-gray-400"}`}
          style={{writingMode:"vertical-rl"}} 
          onClick={() => changePhase(1)}>Resource</div>
      </div>



      {/* Middle panel */}
      <div className="flex w-4/5">
        <div className="flex flex-col w-full h-full">
          <div className="bg-gray-200" style={{height: "3%"}}>
            <select name="num_players" id="num_players">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            player(s)
          </div>
          <div className="f"  style={{height: "94%"}}>

            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gSharedEncounterDiscard']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gSharedEncounterDeck']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "55%"}}>                
                <Group group={groups['gSharedStaging']} key={'gSharedStaging'} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gSharedActive']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "15%"}}>
                <Group group={groups['gSharedMainQuest']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              
            </div> 
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "100%"}}>
                <Group group={groups['gPlayer1Engaged']} key={'gPlayer1Engaged'} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
            </div>
              
            <div className="w-full" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "100%"}}>
                <Group group={groups['gPlayer1Play1']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
            </div>
            <div className="flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%"}}>
              <WidthContainer style={{width: "90%"}}>
                <Group group={groups['gPlayer1Play2']} showTitle="false" broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gPlayer1Event']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
            </div>
            <div className=" flex flex-1" style={{minHeight: "20%", height: "20%", maxHeight: "20%", background: "rgba(0, 0, 0, 0.5)"}}>
              <WidthContainer style={{width: "80%"}}>
                <Group group={groups['gPlayer1Hand']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gPlayer1Deck']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
              <WidthContainer style={{width: "10%"}}>
                <Group group={groups['gPlayer1Discard']} broadcast={broadcast} activeCard={activeCard} setActiveCard={setActiveCard}></Group>
              </WidthContainer>
            </div>
          </div>
          <div className="bg-gray-300" style={{height: "3%"}}>
            Social links
          </div>
        </div>
      </div>
      
      {/* Right panel */}
      <div className="flex w-1/5" >
        <div className="flex flex-col w-full h-full">
          {/* Hovercard */}
          <div className="" 
            style={{
              height: "45%",
              backgroundImage: `url(${activeCard?.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
          </div>
          {/* Chat */}
          <div 
            className="overflow-hidden" 
            style={{height: showScratch ? "12%" : "57%", opacity: 0.7}}
          >
            {gameUIView != null && (
              <Chat roomName={gameUIView.game_ui.game_name} />
            )}
          </div>
          {/* Extra */}
          <div 
            className="bg-gray-800" 
            style={{
              height: "40%", 
              display: showScratch ? "block" : "none"
            }}
          >        
            <div className="bg-gray-300" style={{height: "33.3%"}}>
              <Group group={groups['gSharedExtra1']} showTitle="false" activeCard={activeCard} setActiveCard={setActiveCard}></Group>
            </div>
            <div className="bg-gray-400" style={{height: "33.3%"}}>
              <Group group={groups['gSharedExtra2']} showTitle="false" activeCard={activeCard} setActiveCard={setActiveCard}></Group></div>
            <div className="" style={{height: "33.4%"}}>
              <Group group={groups['gSharedExtra3']} showTitle="false" activeCard={activeCard} setActiveCard={setActiveCard}></Group></div>
          </div>
          <div className="text-center" onClick={() => toggleScratch()} style={{height: "3%"}}>
            <FontAwesomeIcon className="text-white" icon={showScratch ? faChevronDown : faChevronUp}/>
          </div>
        </div>
      </div>
    </div>

    </DragDropContext>

  );
}

export default Groups;












// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import { generateQuoteMap } from "./data";
// import styled from "@emotion/styled";
// import Group from "./Group";
// import Reorder, { reorderGroups } from "./Reorder";
// import { DragDropContext } from "react-beautiful-dnd";

// const data = {
//   small: generateQuoteMap(10),
//   medium: generateQuoteMap(100),
//   large: generateQuoteMap(250)
// };

// const WidthContainer = styled.div`
//   min-height: 100vh;
//   /* like display:flex but will allow bleeding over the window width */
//   min-width: 100vw;
//   /* display: inline-flex; */
// `;

// export const Groups = ({
//   gameUIView,
//   broadcast,
// }) => {

//   const [groups, setGroups] = useState(gameUIView.game_ui.game.groups);
//   const [showScratch, setShowScratch] = useState(false);
//   const [phase, setPhase] = useState(1);
//   const [activeCard, setActiveCard] = useState(null);

//   function toggleScratch() {
//     if (showScratch) setShowScratch(false);
//     else setShowScratch(true);
//   }

//   function changePhase(num) {
//     if (num!=phase) setPhase(num);
//   }

//   useEffect(() => {    
//     setGroups(gameUIView.game_ui.game.groups);
//   }, [gameUIView.game_ui.game.groups]);

//   const [state,setState] = useState({
//     columns: data.large,
//     ordered: Object.keys(data.medium)
//   });

//   // const onDragEnd = (result) => {
//   //   console.log(result);
//   //   if (!result.destination) return;
//   //   const { source, destination } = result;
//   //   var newGroups = {};
//   //   if (source.droppableId !== destination.droppableId) {
//   //     const sourceGroup = groups[source.droppableId];
//   //     const destGroup = groups[destination.droppableId];
//   //     const sourceStacks = [...sourceGroup.stacks];
//   //     const destStacks = [...destGroup.stacks];
//   //     const [removed] = sourceStacks.splice(source.index, 1);
//   //     destStacks.splice(destination.index, 0, removed);
//   //     newGroups = {
//   //       ...groups,
//   //       [source.droppableId]: {
//   //         ...sourceGroup,
//   //         stacks: sourceStacks
//   //       },
//   //       [destination.droppableId]: {
//   //         ...destGroup,
//   //         stacks: destStacks
//   //       }
//   //     }
//   //   } else {
//   //     const group = groups[source.droppableId];
//   //     const copiedStacks = [...group.stacks];
//   //     const [removed] = copiedStacks.splice(source.index, 1);
//   //     copiedStacks.splice(destination.index, 0, removed);
//   //     newGroups = {
//   //       ...groups,
//   //       [source.droppableId]: {
//   //         ...group,
//   //         stacks: copiedStacks
//   //       }
//   //     }
//   //   }
//   //   setGroups(newGroups);
//   //   broadcast("update_groups",{groups: newGroups});
//   // };

//   const onDragEnd = (result) => {
//     if (result.combine) {
//       return;
//       const column = state.columns[result.source.droppableId];
//       const withQuoteRemoved = [...column];
//       withQuoteRemoved.splice(result.source.index, 1);
//       const columns = {
//         ...state.columns,
//         [result.source.droppableId]: withQuoteRemoved
//       };
//       setState({ columns, ordered: state.ordered });
//       return;
//     }

//     // dropped nowhere
//     if (!result.destination) {
//       return;
//     }
//     console.log(result);
//     const source = result.source;
//     const destination = result.destination;

//     // did not move anywhere - can bail early
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     console.log('here');
//     const data = reorderGroups({
//       groups: groups,
//       source,
//       destination
//     });

//     setGroups(data.groups);
//     // setState({
//     //   columns: data.quoteMap,
//     //   ordered: state.ordered
//     // });
//   };

//   const columns = state.columns;
//   const ordered = state.ordered;
//   console.log('ordered');
//   console.log(ordered);
//   // const {
//   //   containerHeight,
//   //   useClone,
//   //   isCombineEnabled,
//   //   withScrollableColumns
//   // } = props;

//   const board = (

//     <WidthContainer>
//       <Group
//         broadcast={broadcast}
//         group={groups['gSharedQuestDeck']}
//         key={'gSharedQuestDeck'}
//         title={groups['gSharedQuestDeck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />
//       <Group
//         broadcast={broadcast}
//         group={groups['gSharedEncounterDeck']}
//         key={'gSharedEncounterDeck'}
//         title={groups['gSharedEncounterDeck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />      
//       <Group
//         broadcast={broadcast}
//         group={groups['gPlayer1Deck']}
//         key={'gPlayer1Deck'}
//         title={groups['gPlayer1Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />  
//       <Group
//         broadcast={broadcast}
//         group={groups['gPlayer2Deck']}
//         key={'gPlayer2Deck'}
//         title={groups['gPlayer2Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />  
//       <Group
//         broadcast={broadcast}
//         group={groups['gPlayer3Deck']}
//         key={'gPlayer3Deck'}
//         title={groups['gPlayer3Deck'].id}
//         isCombineEnabled={true}
//         activeCard={activeCard}
//         setActiveCard={setActiveCard}
//       />
      
//     </WidthContainer>
//   );

//   return (
//     <React.Fragment>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {board}
//       </DragDropContext>
//     </React.Fragment>
//   );
// }
