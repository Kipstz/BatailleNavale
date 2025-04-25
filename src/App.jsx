import React, { useState, useEffect } from 'react';

function createTable() {
  return Array.from({ length: 8 }, () => Array(8).fill('~'));
}

function placeShip(table) {
  let placed = false;
  while (!placed) {
    const x = Math.floor(Math.random() * 8);
    const y = Math.floor(Math.random() * 8);
    const horizontal = Math.random() < 0.5;

    let canPlace = true;
    for (let i = 0; i < 3; i++) {
      const nx = horizontal ? x + i : x;
      const ny = horizontal ? y : y + i;
      if (nx >= 8 || ny >= 8 || table[ny][nx] !== '~') {
        canPlace = false;
        break;
      }
    }
    if (canPlace) {
      for (let i = 0; i < 3; i++) {
        const nx = horizontal ? x + i : x;
        const ny = horizontal ? y : y + i;
        table[ny][nx] = 'S';
      }
      placed = true;
    }
  }
}

function isGameOver(table) {
  return table.flat().every(cell => cell !== 'S');
}

function fire(table, x, y) {
  if (table[y][x] === 'S') {
    table[y][x] = 'X';
    return 'hit';
  } else if (table[y][x] === '~') {
    table[y][x] = 'O';
    return 'miss';
  }
  return 'retry';
}

function App() {
  const [playerTable, setPlayerTable] = useState(() => {
    const b = createTable();
    placeShip(b);
    return b;
  });
  const [computerTable, setComputerTable] = useState(() => {
    const b = createTable();
    placeShip(b);
    return b;
  });
  const [cheat, setCheat] = useState(false);
  const [status, setStatus] = useState('tour joueur !');
  const [gameOver, setGameOver] = useState(false);

  const handlePlayerFire = (x, y) => {
    if (gameOver) return;
    const table = computerTable.map(row => [...row]);
    const result = fire(table, x, y);
    if (result === 'retry') return;

    setComputerTable(table);
    if (isGameOver(table)) {
      setStatus("Gagner !");
      setGameOver(true);
      return;
    }

    const pTable = playerTable.map(row => [...row]);
    let cx, cy, res;
    do {
      cx = Math.floor(Math.random() * 8);
      cy = Math.floor(Math.random() * 8);
      res = fire(pTable, cx, cy);
    } while (res === 'retry');
    setPlayerTable(pTable);
    setStatus(`Ordi tire en (${cx}, ${cy}) : ${res}`);
    if (isGameOver(pTable)) {
      setStatus("Perdu !");
      setGameOver(true);
    }
  };
  
  const renderTable = (table, isComputer = false) => (
    <div className="tables__grid">
      {table.map((row, y) =>
        row.map((cell, x) => {
          const key = `${x}-${y}`;
          const classes = ['tables__grid__cell'];
          if (cell === 'X') classes.push('tables__grid__cell__hit');
          if (cell === 'O') classes.push('tables__grid__cell__miss');
          if (cell === 'S' && cheat && isComputer) classes.push('tables__grid__cell__ship', 'tables__grid__cell__ship__cheat');
          return (
            <div
              key={key}
              className={classes.join(' ')}
              onClick={() => isComputer && fire(cell, x, y) === 'retry' ? null : handlePlayerFire(x, y)}
            >{key}</div>
          );
        })
      )}
    </div>
  );

  return (
    <div>
      <h1>{status}</h1>
      <div className="tables">
        <div>
          <h2>Joueur</h2>
          {renderTable(playerTable)}
        </div>
        <div>
          <h2>Ordi</h2>
          {renderTable(computerTable, true)}
        </div>
      </div>
      <label><input type="checkbox" checked={cheat} onChange={() => setCheat(!cheat)} />Triche</label>
    </div>
  );
}

export default App;