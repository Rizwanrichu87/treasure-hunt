// ==========================================
// TREASURE HUNT CONFIGURATION FILE
// Edit this file to change passcodes, clues, and images.
// ==========================================

const GAME_CONFIG = {
  // Number of stages
  totalStages: 10,

  // Universal clues for each location
  locationClues: {
    "Library": "A silent world filled with endless stories,\nWhere knowledge sleeps on dusty shelves.\nSeek the place where readers explore.",
    "Staircase": "Step by step you climb or fall,\nConnecting every floor and hall.",
    "ATM": "Cash flows where cards are swiped,\nA machine that serves both day and night.\nFind the place where money speaks.",
    "Fountain": "Water dances in a gentle flow,\nA peaceful spot where cool winds blow.\nFind the place where droplets rise and fall.",
    "Mechanical Workshop": "Metal, gears and machines that roar,\nEngineers shaping ideas at the core.",
    "Football Turf": "Green ground where goals are scored,\nCheers rise high with every reward.",
    "Security Cabin": "Eyes that watch both day and night,\nGuarding the campus with silent might.\nFind the place where safety stands.",
    "Parking Area": "Rows of wheels patiently stay,\nWaiting for journeys at the end of the day.",
    "Main Gate": "Every story begins right here,\nThe gateway that welcomes all.",
    "Notice Boards": "Messages pinned for all to see,\nNews and updates for you and me.\nFind the place where announcements live."
  },

  // Team routing tables (Stage -> Location)
  routes: {
    "red": {
      1: "Library", 2: "Staircase", 3: "ATM", 4: "Fountain", 5: "Mechanical Workshop",
      6: "Football Turf", 7: "Security Cabin", 8: "Parking Area", 9: "Main Gate", 10: "Notice Boards"
    },
    "blue": {
      1: "Staircase", 2: "ATM", 3: "Fountain", 4: "Mechanical Workshop", 5: "Football Turf",
      6: "Library", 7: "Parking Area", 8: "Main Gate", 9: "Notice Boards", 10: "Security Cabin"
    },
    "green": {
      1: "ATM", 2: "Fountain", 3: "Mechanical Workshop", 4: "Football Turf", 5: "Library",
      6: "Staircase", 7: "Main Gate", 8: "Notice Boards", 9: "Security Cabin", 10: "Parking Area"
    },
    "yellow": {
      1: "Fountain", 2: "Mechanical Workshop", 3: "Football Turf", 4: "Library", 5: "Staircase",
      6: "ATM", 7: "Notice Boards", 8: "Security Cabin", 9: "Parking Area", 10: "Main Gate"
    },
    "purple": {
      1: "Mechanical Workshop", 2: "Football Turf", 3: "Library", 4: "Staircase", 5: "ATM",
      6: "Fountain", 7: "Security Cabin", 8: "Parking Area", 9: "Main Gate", 10: "Notice Boards"
    },
    "orange": {
      1: "Football Turf", 2: "Library", 3: "Staircase", 4: "ATM", 5: "Fountain",
      6: "Mechanical Workshop", 7: "Parking Area", 8: "Main Gate", 9: "Notice Boards", 10: "Security Cabin"
    }
  },

  // Passcodes for each team at each stage
  passcodes: {
    "red": { 1: "R71K", 2: "R34P", 3: "R89X", 4: "R56M", 5: "R12Q", 6: "R77L", 7: "R91F", 8: "R63T", 9: "R48A", 10: "R25Z" },
    "blue": { 1: "B64K", 2: "B72Q", 3: "B19X", 4: "B53L", 5: "B87A", 6: "B21P", 7: "B92T", 8: "B35M", 9: "B46Z", 10: "B70F" },
    "green": { 1: "G22K", 2: "G51M", 3: "G84Q", 4: "G33P", 5: "G96L", 6: "G12A", 7: "G68F", 8: "G77X", 9: "G43T", 10: "G90Z" },
    "yellow": { 1: "Y91P", 2: "Y73A", 3: "Y42M", 4: "Y88K", 5: "Y15F", 6: "Y67T", 7: "Y30Q", 8: "Y55L", 9: "Y79Z", 10: "Y24X" },
    "purple": { 1: "P37K", 2: "P66Q", 3: "P28M", 4: "P91T", 5: "P73L", 6: "P15X", 7: "P49A", 8: "P62F", 9: "P80Z", 10: "P24R" },
    "orange": { 1: "O44K", 2: "O75M", 3: "O18Q", 4: "O63A", 5: "O29L", 6: "O81T", 7: "O54P", 8: "O37X", 9: "O90F", 10: "O16Z" }
  },

  // Helper to get clue for a given team and stage
  getClue: function(stage, team) {
    const nextStage = stage + 1;
    if (nextStage > this.totalStages) {
      return "Congratulations! You have completed the treasure hunt! Return to the starting point to claim your prize.";
    }
    if (this.routes[team] && this.routes[team][nextStage]) {
      const nextLocation = this.routes[team][nextStage];
      return this.locationClues[nextLocation];
    }
    return "No clue available.";
  },

  // Path to puzzle images. For each stage and team, you can specify an image.
  getPuzzleImage: function(stage, team) {
    return `images/puzzles/stage${stage}-${team}.jpg`;
  }
};
