import {React, useState} from 'react';
import Chessboard from './components/Chessboard';
const App = () => {
    const [winner,setWinner] = useState("None");
    const [turnIsBlack,setTurn] = useState(false)

    function handleWinState(team){
        setWinner(team);
    }
    function flipTurn(){
        setTurn(!turnIsBlack);
    }

    return (
        <div>
            <h1>{winner === "None" ? turnIsBlack ? "Black's turn" : "White's turn" : winner === "Draw" ? "Stalemate!" : `${winner} has won!`}</h1>
            <Chessboard size={10} onGameEnd={handleWinState} flipTurn = {flipTurn}/>
        </div>
    );
};

export default App;