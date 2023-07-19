import { useState } from 'react'
import minesweeperLogo from '/Minesweeper.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    window.open('/src/Minesweeper/Minesweeper.html', '_self');
  };

  return (
    <>
      <div>
        <img src={minesweeperLogo} className="logo" alt="Minesweeper Logo" onClick={handleClick}/>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Increment
        </button>
        <button onClick={() => setCount((count) => count - 1)}>
          Decrement
        </button>
        <p className='counter'>Count: {count}</p>
      </div>
    </>
  )
}

export default App
