import {React, useState} from 'react';
import Chessboard from './components/Chessboard';
import {PieceSelector} from "./components/PieceSelector";
import "./components/PieceSelector.css";
import "./App.css";
import {Board} from "./classes/Board";
const App = () => {
    const [winner,setWinner] = useState("None");
    const [turnIsBlack,setTurn] = useState(false)
    const [builderTeam, setBuildTeam] = useState(false)
    const [boardState, setBoardState] = useState(new Board(8).getBoardState())
    const [updateState, setUpdateState] = useState(true)
    const [gameStart,setGameStart] = useState(false)

    function handleWinState(team){
        setWinner(team);
    }
    function flipTurn(){
        setTurn(!turnIsBlack);
    }
    function flipBuildTeam(){
        setBuildTeam(!builderTeam)
    }
    function setAppBoardState(boardState){
        setBoardState(boardState)
    }

    function setAppUpdateState(){
        setUpdateState(!updateState)
    }
    function setAppGameStart(){
        console.log("THE GAME IS STARTING",gameStart)
        setGameStart(true)
    }


    return (
        <div class= "app-parent">
            <div class = "app-child">
                <h1>{gameStart == false ? "Setting up board " : winner === "None" ? turnIsBlack ? "Black's turn" : "White's turn" : winner === "Draw" ? "Stalemate!" : `${winner} has won!`}</h1>
                <Chessboard passedBoardState={boardState} onGameEnd={handleWinState} flipTurn={flipTurn} updateState = {updateState} gameStarted = {gameStart} />
            </div>
            {!gameStart && (
            <div class = "app-child">
                <PieceSelector teamIsBlack={builderTeam} flipBuildTeam = {flipBuildTeam} boardState ={boardState} callForUpdate = {setAppUpdateState}
                setGameStart = {setAppGameStart}></PieceSelector>
            </div>
                )}
        </div>
    );
};

export default App;