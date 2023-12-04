// Chessboard.tsx
import React, {useState} from 'react';
import {Square} from '../classes/Square'; // Import your Square class
import SquareComponent from './SquareComponent'; // Import the React component
import {Board} from '../classes/Board';
import {
    coordToKey,
    createCaptureDictionary,
    createMoveDictionary,
    disqualifyMovesForCheck,
    Teams
} from "../classes/Logic";

import * as Logic from "../classes/Logic";


interface ChessboardProps {
    size: number;
    onGameEnd: Function
}

const Chessboard: React.FC<ChessboardProps> = ({ size,onGameEnd}) => {
    const [boardState, setBoardState] = useState<Square[][]>(new Board(size).getBoardState())
    const [selectedSquare, setSelectedSquare] = useState<any | null>(null);
    const [legalMoves, setLegalMoves] = useState<number[][]>([])
    const [legalCaptures ,setLegalCaptures] = useState<number[][]>([])
    const [teamInCheck, setCheck] = useState<Teams>(Teams.NONE)
    const [teamTurn,setTeamTurn] = useState<boolean>(false)
    const [moveDict,setMoveDict] = useState<{[key:string]: number[][]}>(disqualifyMovesForCheck(createMoveDictionary(boardState,teamTurn),boardState,teamTurn))
    const [captureDict,setCaptureDict] = useState<{[key:string]: number[][]}>(disqualifyMovesForCheck(createCaptureDictionary(boardState,teamTurn),boardState,teamTurn))
    const handleSquareClick = (key:any, clickedSquare:Square, boardState:Square[][]) => {
        let previousSquare:Square|null = null
        if(selectedSquare!=null){
            const [col, row] = selectedSquare.split('-');
            previousSquare = boardState[parseInt(col, 10)][parseInt(row, 10)];}
        else{
            previousSquare = null;
        }
        const allLegalPlays = legalMoves.concat(legalCaptures);
        if(previousSquare!== null && isSubArray([clickedSquare.column,clickedSquare.row],allLegalPlays)){
            previousSquare.moveTo(clickedSquare.column,clickedSquare.row,boardState)
            setBoardState(boardState)
            setCheck(Logic.lookForCheck(boardState,!clickedSquare.occupying!.isBlack))
            setTeamTurn(!teamTurn)
            setMoveDict(disqualifyMovesForCheck(createMoveDictionary(boardState,!teamTurn),boardState,!teamTurn))
            /*I don't know why it is !teamTurn, doesnt seem right*/
            setCaptureDict(disqualifyMovesForCheck(createCaptureDictionary(boardState,!teamTurn),boardState,!teamTurn))
            let checkWinner:string = Logic.checkForMate(moveDict,captureDict,teamInCheck,teamTurn);
            if(checkWinner !== "None"){
                onGameEnd(checkWinner)
            }
            setSelectedSquare(null);
            setLegalMoves([]);
            setLegalCaptures([]);
        }
        else {

            if (selectedSquare !== key) { /*If selectedSquare isn't the one already selected*/
                setSelectedSquare(key);
            } else { /*If selectedSquare is the one already selected, reset everything*/
                setSelectedSquare(null);
                setLegalMoves([]);
                setLegalCaptures([])
            }
            if (clickedSquare.occupying != null && selectedSquare !== key && clickedSquare.occupying!.isBlack == teamTurn) {
                setLegalMoves(moveDict[coordToKey([clickedSquare.column,clickedSquare.row])])
                setLegalCaptures(captureDict[coordToKey([clickedSquare.column,clickedSquare.row])])
            } else {
                setLegalMoves([])
                setLegalCaptures([])
            }
        }


    };

    function isSubArray(subArray: number[], array: number[][]) {
        if(array == undefined){return false}
        return array.some((arr) =>
            arr.length === subArray.length && arr.every((num, index) => num === subArray[index])
        );
    }
    function determineCheck(square:Square){
        if(teamInCheck == Teams.NONE){
            return false;
        }
        if(square.occupying == null){
            return false;
        }
        else{
            if(square.occupying.isBlack && teamInCheck == Teams.BLACK) {
                return true;
            }
            else if(!square.occupying.isBlack && teamInCheck == Teams.WHITE){
                return true;
            }
        }
        return false;
    }

    const generateChessboard = () => {
        // Create instances of the Square class for each cell

        return boardState.map((row, colIndex) => (
            <div key={colIndex} className="chess-row">
                {row.map((square, rowIndex) => (
                    <SquareComponent
                        key={`${colIndex}-${rowIndex}`}
                        square={square}
                        isSelected={selectedSquare == `${colIndex}-${rowIndex}`}
                        isLegalMove={isSubArray([colIndex,rowIndex],legalMoves)}
                        isLegalCapture={isSubArray([colIndex,rowIndex],legalCaptures)}
                        onClick={() => handleSquareClick(`${colIndex}-${rowIndex}`,boardState[colIndex][rowIndex],boardState)}
                        piece= {square.getPiece()}
                        teamInCheck = {determineCheck(square)}
                    />
                ))}
            </div>
        ));
    };
    return (
        <div className="chessboard" style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 100px)` }}>
            {generateChessboard()}
        </div>
    );
};

export default Chessboard;