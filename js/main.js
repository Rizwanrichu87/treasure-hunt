document.addEventListener('DOMContentLoaded', () => {
  // Parsing Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const team = urlParams.get('team') || 'red';
  
  // Set team color
  const colors = {
    red: '#ff4b4b',
    blue: '#4b8bff',
    green: '#2ecc71',
    yellow: '#f1c40f',
    purple: '#9b59b6',
    orange: '#e67e22'
  };
  
  if (colors[team]) {
    document.documentElement.style.setProperty('--active-color', colors[team]);
  }

  // Get stage from URL
  const path = window.location.pathname;
  let stage = 1; // default fallback
  const match = path.match(/stage(\d+)\.html/i);
  if (match) {
    stage = parseInt(match[1]);
  }

  const stageTitleEl = document.getElementById('stage-title');
  if (!stageTitleEl) return; // Not a stage page (e.g., index)
  
  stageTitleEl.textContent = `Stage ${stage} - Team ${team.charAt(0).toUpperCase() + team.slice(1)}`;

  // PUZZLE LOGIC
  const puzzleContainer = document.getElementById('puzzle-container');
  const gridSize = 4;
  let tiles = [];
  const imageUrl = GAME_CONFIG.getPuzzleImage(stage, team);
  let isSolved = false;
  
  function initPuzzle() {
    tiles = [];
    // 0-14 are tiles, 15 is empty
    for (let i = 0; i < 16; i++) {
        tiles.push(i);
    }
    
    // We shuffle exactly x moves to ensure solvability, and keep track
    shuffleByMoving(120);
    renderPuzzle();
  }

  function shuffleByMoving(moves) {
    let emptyIdx = 15;
    let prevIdx = -1;
    
    for (let i = 0; i < moves; i++) {
      const neighbors = getNeighbors(emptyIdx);
      // Try not to immediately undo previous move
      const validNeighbors = neighbors.length > 1 ? neighbors.filter(n => n !== prevIdx) : neighbors;
      
      const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      
      // Swap
      [tiles[emptyIdx], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIdx]];
      prevIdx = emptyIdx;
      emptyIdx = randomNeighbor;
    }
  }

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    if (row > 0) neighbors.push(index - gridSize); // Top
    if (row < gridSize - 1) neighbors.push(index + gridSize); // Bottom
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < gridSize - 1) neighbors.push(index + 1); // Right
    
    return neighbors;
  }

  function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    tiles.forEach((value, index) => {
      const tile = document.createElement('div');
      tile.classList.add('puzzle-tile');
      
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Translate % based on size of tile itself (25%) -> 100% of tile size shifts it 1 grid block
      tile.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
      
      if (value === 15) {
        tile.classList.add('empty');
      } else {
        const bgRow = Math.floor(value / gridSize);
        const bgCol = value % gridSize;
        
        // Background setup
        tile.style.backgroundColor = 'var(--active-color)';
        // Set actual image
        tile.style.backgroundImage = `url('${imageUrl}')`;
        tile.style.backgroundPosition = `${bgCol * 33.333}% ${bgRow * 33.333}%`;
        
        // Add number hint (can be styled or pseudo-element in CSS, we use inline span)
        tile.innerHTML = `<span>${value + 1}</span>`;
        
        // Click and touch handlers
        tile.addEventListener('click', () => handleTileClick(index));
      }
      
      puzzleContainer.appendChild(tile);
    });
  }

  function handleTileClick(index) {
    if (isSolved) return;
    
    const emptyIndex = tiles.indexOf(15);
    const neighbors = getNeighbors(emptyIndex);
    
    if (neighbors.includes(index)) {
      // Swap
      [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
      renderPuzzle(); // Re-render updates translation
      checkWin();
    }
  }

  function checkWin() {
    const isWin = tiles.every((val, index) => val === index);
    if (isWin) {
      isSolved = true;
      setTimeout(() => {
        puzzleContainer.classList.add('hidden');
        document.getElementById('passcode-section').classList.remove('hidden');
        document.getElementById('instruction-text').innerHTML = "<strong>Puzzle Solved!</strong><br>Enter the location passcode.";
        document.getElementById('instruction-text').style.color = "var(--team-green)";
      }, 600);
    }
  }

  initPuzzle();

  // PASSCODE LOGIC
  const submitBtn = document.getElementById('submit-passcode');
  const errorMsg = document.getElementById('passcode-error');
  
  submitBtn.addEventListener('click', () => {
    const input = document.getElementById('passcode-input').value.trim().toUpperCase();
    const teamPasscodes = GAME_CONFIG.passcodes[team] || {};
    const correctPasscode = teamPasscodes[stage] ? teamPasscodes[stage].toUpperCase() : null;
    
    if (!correctPasscode) {
      alert("Error: Passcode not configured for this team/stage!");
      return;
    }

    if (input === correctPasscode) {
      document.getElementById('passcode-section').classList.add('hidden');
      const clueSection = document.getElementById('clue-section');
      clueSection.classList.remove('hidden');
      
      let finalClueText = GAME_CONFIG.getClue(stage, team);
      const nextPasscode = teamPasscodes[stage + 1];
      if (nextPasscode) {
        finalClueText += `\n\nNext Stage Passcode: ${nextPasscode}`;
      }
      document.getElementById('clue-text').innerText = finalClueText;
      
      document.getElementById('instruction-text').textContent = "Success! Next Clue Unlocked.";
      // Set background border to green on success
      document.documentElement.style.setProperty('--active-color', 'var(--team-green)');
    } else {
      errorMsg.classList.remove('hidden');
      // Shake animation effect for input
      document.getElementById('passcode-input').style.borderColor = "var(--team-red)";
      setTimeout(() => { 
        errorMsg.classList.add('hidden'); 
        document.getElementById('passcode-input').style.borderColor = "#333";
      }, 2000);
    }
  });

  // Also support "Enter" key for passcode
  document.getElementById('passcode-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });
});
