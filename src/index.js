import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import Cell from "./cell";
import { sampleSize, diff } from "./utils";

class Game extends React.PureComponent {
  constructor(props) {
    super(props);
    const { gridSize, challengeSize } = props;
    const grid = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    const cellWidth = 100 / gridSize;
    const messages = {
      new: "Click the Start button to play",
      challenge: "Memorize these blue cells",
      playing: "Recall the cells that were blue",
      won: "You Win!",
      lost: "Game Over!"
    };

    this.state = {
      challengeSize,
      gridSize,
      grid,
      cellWidth,
      gameStatus: "new",
      messages,
      challengeCells: [],
      selectedCells: [],
      score: 0,
      wrongsLeft: props.wrongsAllowed
    };
  }

  onCellClick = cell => {
    this.setState(prevState => {
      if (prevState.gameStatus !== "playing") {
        return null;
      }

      if (prevState.selectedCells.indexOf(cell) >= 0) {
        return null;
      }

      const newSelectedCells = [...prevState.selectedCells, cell];
      const { score, wrongsLeft } = prevState;
      const gameStatus = this.calcNewGameStatus(newSelectedCells);
      let newScore;
      let newWrongsLeft;

      if (this.state.challengeCells.indexOf(cell) < 0) {
        newWrongsLeft = wrongsLeft - 1;
      }

      if (gameStatus === "won") {
        newScore = wrongsLeft;
      }

      return {
        selectedCells: newSelectedCells,
        gameStatus,
        score: newScore ? newScore + score : score,
        wrongsLeft: newWrongsLeft || wrongsLeft
      };
    });
  };
  startGame = () => {
    clearTimeout(this.state.timerID);

    const timerID = setTimeout(() => {
      this.setState({ gameStatus: "playing" });
    }, 3000);

    this.setState(prevState => {
      const { score, gridSize, challengeSize } = prevState;
      const newGridSize = score > 0 ? gridSize + 1 : gridSize;
      const grid = Array.from({ length: newGridSize * newGridSize }, (_, i) => i);
      const newChallengeSize = score > 0 ? challengeSize + 1 : challengeSize;
      const challengeCells = sampleSize(grid, newChallengeSize);
      const cellWidth = 100 / newGridSize;

      return {
        grid,
        cellWidth,
        gameStatus: "challenge",
        selectedCells: [],
        timerID,
        challengeCells,
        wrongsLeft: 3,
        gridSize: newGridSize,
        challengeSize: newChallengeSize
      };
    });
  };
  gameIsIdle = () => ["new", "won", "lost"].includes(this.state.gameStatus);
  showChallengeCells = () => ["challenge", "lost"].includes(this.state.gameStatus);
  showSelectedCells = () => ["playing", "won", "lost"].includes(this.state.gameStatus);
  calcNewGameStatus = newSelectedCells => {
    if (diff(this.state.challengeCells, newSelectedCells).length === 0) {
      return "won";
    }

    if (diff(newSelectedCells, this.state.challengeCells).length === this.props.wrongsAllowed) {
      return "lost";
    }

    return "playing";
  };
  render() {
    return (
      <div className="game">
        <div className="help">
          You will have 3 seconds to memorize{" "}
          {this.state.challengeCells.length === 0 ? "X" : this.state.challengeCells.length} blue random cells
        </div>
        <p className="score">Score: {this.state.score}</p>
        <div className="grid">
          {this.state.grid.map(cell => {
            const cellIsChallenge = this.state.challengeCells.indexOf(cell) >= 0;
            const cellIsSelected = this.state.selectedCells.indexOf(cell) >= 0;

            return (
              <Cell
                id={cell}
                onClick={this.onCellClick}
                key={cell}
                showAsSelected={this.showSelectedCells() && cellIsSelected}
                showAsChallenge={this.showChallengeCells() && cellIsChallenge}
                cellIsChallenge={cellIsChallenge}
                cellWidth={this.state.cellWidth}
              />
            );
          })}
        </div>
        {this.gameIsIdle() && (
          <button onClick={this.startGame}>{this.state.gameStatus === "new" ? "Start" : "Play Again"}</button>
        )}
        <div className="message">{this.state.messages[this.state.gameStatus]}</div>
      </div>
    );
  }
}

ReactDOM.render(<Game gridSize={5} challengeSize={6} wrongsAllowed={3} />, document.getElementById("root"));
