//export const CARDSCALE = 3.;
export const CARDSCALE = 26;
export const GROUPSINFO = {
    "sharedEncounterDeck": {name: "Encounter Deck", tablename: "Encounter"},
    "sharedEncounterDiscard": {name: "Encounter Discard", tablename: "Discard"},
    "sharedQuestDeck": {name: "Quest Deck", tablename: "Quest Deck"},
    "sharedQuestDiscard": {name: "Quest Discard", tablename: "Quest Discard"},
    "sharedQuestDeck2": {name: "Second Quest Deck", tablename: "Second Quest Deck"},
    "sharedQuestDiscard2": {name: "Second Quest Discard", tablename: "Second Quest Discard"},
    "sharedEncounterDeck2": {name: "Second Encounter Deck", tablename: "Second Encounter Deck"},
    "sharedEncounterDiscard2": {name: "Second Encounter Discard", tablename: "Second Encounter Discard"},
    "sharedEncounterDeck3": {name: "Third Encounter Deck", tablename: "Third Encounter Deck"},
    "sharedEncounterDiscard3": {name: "Third Encounter Discard", tablename: "Third Encounter Discard"},
    "sharedOther": {name: "Other", tablename: "Other"},
    "sharedSetAside": {name: "Set Aside", tablename: "Set Aside"},
    "sharedVictory": {name: "Victory Display", tablename: "Victory Display"},
    "sharedStaging": {name: "Staging Area", tablename: "Staging"},
    "sharedActive": {name: "Active Location", tablename: "Active"},
    "sharedMainQuest": {name: "Main Quest", tablename: "Main Quest"},
    "sharedExtra1": {name: "Extra 1", tablename: "Extra 1"},
    "sharedExtra2": {name: "Extra 2", tablename: "Extra 2"},
    "sharedExtra3": {name: "Extra 3", tablename: "Extra 3"},
    "player1Hand": {name: "Player 1 Hand", tablename: "Player 1 Hand"},
    "player1Deck": {name: "Player 1 Deck", tablename: "Deck"},
    "player1Discard": {name: "Player 1 Discard", tablename: "Discard"},
    "player1Sideboard": {name: "Player 1 Sideboard", tablename: "Player 1 Sideboard"},
    "player1Play1": {name: "Player 1 Play Area", tablename: "Play Area"},
    "player1Play2": {name: "Player 1 Play Area", tablename: "Play Area"},
    "player1Play3": {name: "Player 1 Play Area", tablename: "Play Area"},
    "player1Play4": {name: "Player 1 Play Area", tablename: "Play Area"},
    "player1Engaged": {name: "Player 1 Engaged Area", tablename: "Engaged"},
    "player1Event": {name: "Player 1 Current Event", tablename: "Event"},
    "player2Hand": {name: "Player 2 Hand", tablename: "Player 2 Hand"},
    "player2Deck": {name: "Player 2 Deck", tablename: "Deck"},
    "player2Discard": {name: "Player 2 Discard", tablename: "Discard"},
    "player2Sideboard": {name: "Player 2 Sideboard", tablename: "Player 2 Sideboard"},
    "player2Play1": {name: "Player 2 Play Area", tablename: "Play Area"},
    "player2Play2": {name: "Player 2 Play Area", tablename: "Play Area"},
    "player2Play3": {name: "Player 2 Play Area", tablename: "Play Area"},
    "player2Play4": {name: "Player 2 Play Area", tablename: "Play Area"},
    "player2Engaged": {name: "Player 2 Engaged Area", tablename: "Engaged"},
    "player2Event": {name: "Player 2 Current Event", tablename: "Event"},
    "player3Hand": {name: "Player 3 Hand", tablename: "Player 3 Hand"},
    "player3Deck": {name: "Player 3 Deck", tablename: "Deck"},
    "player3Discard": {name: "Player 3 Discard", tablename: "Discard"},
    "player3Sideboard": {name: "Player 3 Sideboard", tablename: "Player 3 Sideboard"},
    "player3Play1": {name: "Player 3 Play Area", tablename: "Play Area"},
    "player3Play2": {name: "Player 3 Play Area", tablename: "Play Area"},
    "player3Play3": {name: "Player 3 Play Area", tablename: "Play Area"},
    "player3Play4": {name: "Player 3 Play Area", tablename: "Play Area"},
    "player3Engaged": {name: "Player 3 Engaged Area", tablename: "Engaged"},
    "player3Event": {name: "Player 3 Current Event", tablename: "Event"},
    "player4Hand": {name: "Player 4 Hand", tablename: "Player 4 Hand"},
    "player4Deck": {name: "Player 4 Deck", tablename: "Deck"},
    "player4Discard": {name: "Player 4 Discard", tablename: "Discard"},
    "player4Sideboard": {name: "Player 4 Sideboard", tablename: "Player 4 Sideboard"},
    "player4Play1": {name: "Player 4 Play Area", tablename: "Play Area"},
    "player4Play2": {name: "Player 4 Play Area", tablename: "Play Area"},
    "player4Play3": {name: "Player 4 Play Area", tablename: "Play Area"},
    "player4Play4": {name: "Player 4 Play Area", tablename: "Play Area"},
    "player4Engaged": {name: "Player 4 Engaged Area", tablename: "Engaged"},
    "player4Event": {name: "Player 4 Current Event", tablename: "Event"}
}

export const playerNum = (playerN) => {
  switch(playerN) {
    case 'player1':
      return 1;
    case 'player2':
      return 2;
    case 'player3':
      return 3;
    case 'player4':
      return 4;
  }
  return null;
} 

export const sectionToLoadGroupId = (section, playerN) => {
  switch(section) {
    case 'Hero':
      return playerN+'Play1';
    case 'Ally':
      return playerN+'Deck';
    case 'Attachment':
      return playerN+'Deck';
    case 'Event':
      return playerN+'Deck';
    case 'Side Quest':
      return playerN+'Deck';
    case 'Sideboard':
      return playerN+'Sideboard';
    case 'Quest':
      return 'sharedQuestDeck';
    case 'Encounter':
      return 'sharedEncounterDeck';
    case 'Special':
      return 'sharedEncounterDeck2';
    case 'Second Special':
      return 'sharedEncounterDeck3';
    case 'Setup':
      return 'sharedSetAside';
    case 'Staging Setup':
      return 'sharedStaging';
    case 'Active Setup':
      return 'sharedActive';
    case 'Second Quest Deck':
      return 'sharedQuestDeck2';
  }
  return 'sharedOther';
}

export const sectionToDiscardGroupId = (section, playerN) => {
  switch(section) {
    case 'Hero':
      return playerN+'Discard';
    case 'Ally':
      return playerN+'Discard';
    case 'Attachment':
      return playerN+'Discard';
    case 'Event':
      return playerN+'Discard';
    case 'Side Quest':
      return playerN+'Discard';
    case 'Sideboard':
      return playerN+'Discard';
    case 'Quest':
      return 'sharedQuestDiscard';
    case 'Encounter':
      return 'sharedEncounterDiscard';
    case 'Special':
      return 'sharedEncounterDiscard2';
    case 'Second Special':
      return 'sharedEncounterDiscard3';
    case 'Setup':
      return 'sharedEncounterDiscard';
    case 'Staging Setup':
      return 'sharedEncounterDiscard';
    case 'Active Setup':
      return 'sharedEncounterDiscard';
    case 'Second Quest Deck':
      return 'sharedQuestDiscard2';
  }
  return 'sharedOther';
}

export const LAYOUTINFO = {
  "layout1standard": [
    {
      regions: [
        {id: "sharedMainQuest", width: "12%"},
        {id: "sharedActive", width: "9%"},
        {id: "sharedStaging", width: "61%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "9%"},
        {id: "sharedEncounterDiscard", width: "9%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "100%"},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "100%"},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "90%"},
        {id: "player1Event", width: "10%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "57%", style: "shaded"},
        {id: "Deck", width: "9%", style: "shaded"},
        {id: "Discard", width: "9%", style: "shaded"},
      ]
    },
  ],
  "layout1extra": [
    {
      regions: [
        {id: "sharedMainQuest", width: "12%"},
        {id: "sharedActive", width: "9%"},
        {id: "sharedStaging", width: "61%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "9%"},
        {id: "sharedEncounterDiscard", width: "9%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "100%"},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "100%"},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "90%"},
        {id: "player1Event", width: "10%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "57%", style: "shaded"},
        {id: "Deck", width: "9%", style: "shaded"},
        {id: "Discard", width: "9%", style: "shaded"},
      ]
    },
  ],
  "layout2standard": [
    {
      regions: [
        {id: "sharedMainQuest", width: "9%"},
        {id: "sharedActive", width: "8%"},
        {id: "sharedStaging", width: "67%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "8%"},
        {id: "sharedEncounterDiscard", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "50%"},
        {id: "player2Engaged", width: "50%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "50%"},
        {id: "player2Play1", width: "50%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "50%"},
        {id: "player2Play2", width: "50%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play3", width: "42%"},
        {id: "player1Event", width: "8%"},
        {id: "player2Play3", width: "42%", hideTitle: true},
        {id: "player2Event", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "59%", style: "shaded"},
        {id: "Deck", width: "8%", style: "shaded"},
        {id: "Discard", width: "8%", style: "shaded"},
      ]
    },
  ],
  "layout2extra": [
    {
      regions: [
        {id: "sharedMainQuest", width: "9%"},
        {id: "sharedActive", width: "8%"},
        {id: "sharedStaging", width: "67%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "8%"},
        {id: "sharedEncounterDiscard", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "37%"},
        {id: "player2Engaged", width: "36%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "37%"},
        {id: "player2Play1", width: "36%"},
        {id: "sharedExtra1", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "37%"},
        {id: "player2Play2", width: "36%"},
        {id: "sharedExtra2", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "player1Play3", width: "29%"},
        {id: "player1Event", width: "8%"},
        {id: "player2Play3", width: "28%"},
        {id: "player2Event", width: "8%"},
        {id: "sharedExtra3", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "59%", style: "shaded"},
        {id: "Deck", width: "8%", style: "shaded"},
        {id: "Discard", width: "8%", style: "shaded"},
      ]
    },
  ],
  "layout3standard": [
    {
      regions: [
        {id: "sharedMainQuest", width: "9%"},
        {id: "sharedActive", width: "8%"},
        {id: "sharedStaging", width: "67%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "8%"},
        {id: "sharedEncounterDiscard", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "34%"},
        {id: "player2Engaged", width: "33%", hideTitle: true},
        {id: "player3Engaged", width: "33%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "34%"},
        {id: "player2Play1", width: "33%", hideTitle: true},
        {id: "player3Play1", width: "33%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "34%"},
        {id: "player2Play2", width: "33%", hideTitle: true},
        {id: "player3Play2", width: "33%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play3", width: "26%"},
        {id: "player1Event", width: "8%"},
        {id: "player2Play3", width: "25%", hideTitle: true},
        {id: "player2Event", width: "8%"},
        {id: "player3Play3", width: "25%", hideTitle: true},
        {id: "player3Event", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "59%", style: "shaded"},
        {id: "Deck", width: "8%", style: "shaded"},
        {id: "Discard", width: "8%", style: "shaded"},
      ]
    },
  ],
  "layout3extra": [
    {
      regions: [
        {id: "sharedMainQuest", width: "9%"},
        {id: "sharedActive", width: "8%"},
        {id: "sharedStaging", width: "67%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "8%"},
        {id: "sharedEncounterDiscard", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "34%"},
        {id: "player2Engaged", width: "33%", hideTitle: true},
        {id: "player3Engaged", width: "33%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "65%"},
        {id: "player1Event", width: "8%"},
        {id: "sharedExtra1", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "player2Play1", width: "65%"},
        {id: "player2Event", width: "8%"},
        {id: "sharedExtra2", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "player3Play1", width: "65%"},
        {id: "player3Event", width: "8%"},
        {id: "sharedExtra3", width: "27%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "59%", style: "shaded"},
        {id: "Deck", width: "8%", style: "shaded"},
        {id: "Discard", width: "8%", style: "shaded"},
      ]
    },
  ],
  "layout4standard": [
    {
      regions: [
        {id: "sharedMainQuest", width: "8%"},
        {id: "sharedActive", width: "9%"},
        {id: "sharedStaging", width: "68%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "7.5%"},
        {id: "sharedEncounterDiscard", width: "7.5%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "25%"},
        {id: "player2Engaged", width: "25%", hideTitle: true},
        {id: "player3Engaged", width: "25%", hideTitle: true},
        {id: "player4Engaged", width: "25%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "25%"},
        {id: "player2Play1", width: "25%", hideTitle: true},
        {id: "player3Play1", width: "25%", hideTitle: true},
        {id: "player4Play1", width: "25%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play2", width: "25%"},
        {id: "player2Play2", width: "25%", hideTitle: true},
        {id: "player3Play2", width: "25%", hideTitle: true},
        {id: "player4Play2", width: "25%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play3", width: "25%"},
        {id: "player2Play3", width: "25%", hideTitle: true},
        {id: "player3Play3", width: "25%", hideTitle: true},
        {id: "player4Play3", width: "25%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play4", width: "17%"},
        {id: "player1Event", width: "8%"},
        {id: "player2Play4", width: "17%", hideTitle: true},
        {id: "player2Event", width: "8%"},
        {id: "player3Play4", width: "17%", hideTitle: true},
        {id: "player3Event", width: "8%"},
        {id: "player4Play4", width: "17%", hideTitle: true},
        {id: "player4Event", width: "8%"},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "60%", style: "shaded"},
        {id: "Deck", width: "7.5%", style: "shaded"},
        {id: "Discard", width: "7.5%", style: "shaded"},
      ]
    },
  ],
  "layout4extra": [
    {
      regions: [
        {id: "sharedMainQuest", width: "8%"},
        {id: "sharedActive", width: "9%"},
        {id: "sharedStaging", width: "68%", style: "shaded", boxShadow: "true"},
        {id: "sharedEncounterDeck", width: "7.5%"},
        {id: "sharedEncounterDiscard", width: "7.5%"},
      ]
    },
    {
      regions: [
        {id: "player1Engaged", width: "25%"},
        {id: "player2Engaged", width: "25%", hideTitle: true},
        {id: "player3Engaged", width: "25%", hideTitle: true},
        {id: "player4Engaged", width: "25%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "player1Play1", width: "75%"},
        {id: "sharedExtra1", width: "25%"},
      ]
    },
    {
      regions: [
        {id: "player2Play1", width: "75%"},
        {id: "sharedExtra2", width: "25%"},
      ]
    },
    {
      regions: [
        {id: "player3Play1", width: "75%"},
        {id: "sharedExtra3", width: "25%"},
      ]
    },
    {
      regions: [
        {id: "player4Play1", width: "72%"},
        {id: "player1Event", width: "7%"},
        {id: "player2Event", width: "7%", hideTitle: true},
        {id: "player3Event", width: "7%", hideTitle: true},
        {id: "player4Event", width: "7%", hideTitle: true},
      ]
    },
    {
      regions: [
        {id: "Hand", width: "60%", style: "shaded"},
        {id: "Deck", width: "7.5%", style: "shaded"},
        {id: "Discard", width: "7.5%", style: "shaded"},
      ]
    },
  ]

}