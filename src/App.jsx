import { useEffect, useMemo, useState,useRef } from "react"
import "./App.css"
import Confetti from "react-confetti"

const gameIcons = [
  "🍇",
  "🪅",
  "🃏",
  "🪄",
  "🍄",
  "🪰",
  "🗿",
  "🍕",
  "🕷️",
];

function App() {
  const [pieces, setPieces] = useState([])
  let timeOut = useRef()

  const isGameComplete = useMemo(() => {
    if (pieces.every((piece) => piece.solved)) {
      return true
    }
    return false
  }, [pieces])

  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons]
    const newGameIcons = []
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length)
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1)
    }
    setPieces(newGameIcons)
  };

  useEffect(() => {
    startGame()
  }, [])

  const handleActive = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return

    const newPiece = pieces.map((piece) => {
      if (pieces.length > 0 && piece.position === data.position) {
        piece.flipped = !piece.flipped
      }
      return piece
    })
    setPieces(newPiece)
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) {
     timeOut.current = setTimeout(() => {
        setPieces((currentPieces) =>
          currentPieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true
              } else {
                piece.flipped = false
              }
            }
            return piece
          })
        )
      }, 800)
    }
  }

  useEffect(() => {
    gameLogicForFlipped();
    return () => clearTimeout(timeOut.current);
  }, [pieces])

  return (
    <main className="home-page">
      <h1>"Memorize It"</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${
              data.flipped || data.solved ? "active" : ""
            }`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameComplete && (
        <div className="game-finished">
          <h1>YOU WIN!!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </main>
  )
}

export default App