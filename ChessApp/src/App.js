import {React, useState} from 'react';
import Chessboard from './components/Chessboard';
const App = () => {
    const [winner,setWinner] = useState("None");

    function handleWinState(team){
        setWinner(team);
    }

    return (
        <div>
            <h1>{winner === "None" ? "Chess Example" : winner === "Draw" ? "Stalemate!" : `${winner} has won!`}</h1>
            <Chessboard size={10} onGameEnd={handleWinState}/>
        </div>
    );
};

export default App;