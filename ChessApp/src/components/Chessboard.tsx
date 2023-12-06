// Chessboard.tsx
import React, {useState, useEffect} from 'react';
import {Square} from '../classes/Square'; // Import your Square class
import SquareComponent from './SquareComponent'; // Import the React component
import {PromotionDialog} from "./PromotionDialog";
import {Board} from '../classes/Board';
import {Piece}  from '../classes/Piece';
import './PromotionDialog.css';
import {
    coordToKey,
    createCaptureDictionary,
    createMoveDictionary,
    disqualifyMovesForCheck, getPossibleCastles, pawnInPromotionZone,
    Teams, updateAllStatuses
} from "../classes/Logic";

import * as Logic from "../classes/Logic";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;


interface ChessboardProps {
    passedBoardState: Square[][]
    onGameEnd: Function
    flipTurn: Function
    updateState: boolean
    gameStarted: boolean
}

const Chessboard: React.FC<ChessboardProps> = ({ passedBoardState,onGameEnd, flipTurn, updateState,gameStarted}) => {

    const [boardState, setBoardState] = useState<Square[][]>(passedBoardState)
    updateAllStatuses(boardState); /*Check status afflictions immediately*/
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<number[][]>([])
    const [legalCaptures ,setLegalCaptures] = useState<number[][]>([])
    const [teamInCheck, setCheck] = useState<Teams>(Teams.NONE)
    const [teamTurn,setTeamTurn] = useState<boolean>(false)
    const [moveDict,setMoveDict] = useState<{[key:string]: number[][]}>(disqualifyMovesForCheck(createMoveDictionary(boardState,teamTurn),boardState,teamTurn))
    const [captureDict,setCaptureDict] = useState<{[key:string]: number[][]}>(disqualifyMovesForCheck(createCaptureDictionary(boardState,teamTurn),boardState,teamTurn))
    const [showPromotionDialog,setShowPromotion] = useState<boolean>(false)
    const [promotionSquare,setPromotionSquare] = useState<Square|null>(null)
    const [canClickBoard,setCanClick] = useState<boolean>(false)
    const [castleDict, setCastleDict] = useState<{[key:string]: {[key:string]: number[][]}}>(Logic.createCastleDictionary(boardState,teamTurn))
    const [arrayOfCastles, setArrayCastle] = useState<number[][]>([])
    useEffect(() => {
        updateStateOnly()
    }, [updateState]);
    useEffect(() => {
        console.log("Game Started")
        setCanClick(gameStarted)
    }, [gameStarted]);
    const updateStateOnly = () =>{
        updateAllStatuses(boardState);
        setBoardState(boardState)
        setCheck(Logic.lookForCheck(boardState, teamTurn))
        setMoveDict(disqualifyMovesForCheck(createMoveDictionary(boardState, teamTurn), boardState, teamTurn))
        setCaptureDict(disqualifyMovesForCheck(createCaptureDictionary(boardState, teamTurn), boardState, teamTurn))
        setCastleDict(Logic.createCastleDictionary(boardState,teamTurn))


    }
    const handleSquareClick = (key:any, clickedSquare:Square, boardState:Square[][]) => {
        /*TODO Consider using temp values so don't have to recalculate all this stuff multiple times*/
        console.log(clickedSquare.occupying)
        if(canClickBoard) {
            let previousSquare: Square | null = null
            if (selectedSquare != null) {
                const [col, row] = selectedSquare.split('-');
                previousSquare = boardState[parseInt(col, 10)][parseInt(row, 10)];
            } else {
                previousSquare = null;
            }
            const allLegalPlays = legalMoves.concat(legalCaptures);
            if ((previousSquare !== null && isSubArray([clickedSquare.column, clickedSquare.row], allLegalPlays))
            || previousSquare !== null && isSubArray([clickedSquare.column, clickedSquare.row], arrayOfCastles)) {
                if (previousSquare !== null && isSubArray([clickedSquare.column, clickedSquare.row], allLegalPlays)){
                    previousSquare.moveTo(clickedSquare.column, clickedSquare.row, boardState)}
                else if(previousSquare !== null && isSubArray([clickedSquare.column, clickedSquare.row], arrayOfCastles)){
                    previousSquare.castleWith(clickedSquare,boardState,castleDict)
                    setArrayCastle([])
                }
                if (pawnInPromotionZone(clickedSquare, boardState[0].length - 1)) {
                    setShowPromotion(true)
                    setPromotionSquare(clickedSquare)
                    setCanClick(false)
                } else {
                    setShowPromotion(false)
                }
                updateAllStatuses(boardState);
                setBoardState(boardState)
                setCheck(Logic.lookForCheck(boardState, !clickedSquare.occupying!.isBlack))
                setTeamTurn(!teamTurn)
                flipTurn();

                setMoveDict(disqualifyMovesForCheck(createMoveDictionary(boardState, !teamTurn), boardState, !teamTurn))
                /*I don't know why it is !teamTurn, doesnt seem right*/
                setCaptureDict(disqualifyMovesForCheck(createCaptureDictionary(boardState, !teamTurn), boardState, !teamTurn))
                /*All of these is because react setState is async, something to change*/
                setCastleDict(Logic.createCastleDictionary(boardState,!teamTurn))

                setSelectedSquare(null);
                setLegalMoves([]);
                setLegalCaptures([]);


                let checkWinner: string = Logic.checkForMate(disqualifyMovesForCheck(createMoveDictionary(boardState, !teamTurn), boardState, !teamTurn)
                    , disqualifyMovesForCheck(createCaptureDictionary(boardState, !teamTurn), boardState, !teamTurn)
                    , Logic.lookForCheck(boardState, !teamTurn), !teamTurn);
                if (checkWinner !== "None") {
                    onGameEnd(checkWinner)
                }

            } else {

                if (selectedSquare !== key) { /*If selectedSquare isn't the one already selected*/
                    setSelectedSquare(key);
                } else { /*If selectedSquare is the one already selected, reset everything*/
                    setSelectedSquare(null);
                    setLegalMoves([]);
                    setLegalCaptures([])
                }
                if (clickedSquare.occupying != null && selectedSquare !== key && clickedSquare.occupying!.isBlack == teamTurn) {
                    setLegalMoves(moveDict[coordToKey([clickedSquare.column, clickedSquare.row])])
                    setLegalCaptures(captureDict[coordToKey([clickedSquare.column, clickedSquare.row])])
                    setArrayCastle(Logic.getPossibleCastles(castleDict,clickedSquare,teamTurn))
                } else {
                    setLegalMoves([])
                    setLegalCaptures([])
                    setArrayCastle([])
                }
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
    function boardHandlePromotion(selectedPiece:Piece){
        let teamIsBlack:boolean = promotionSquare!.occupying!.isBlack
        selectedPiece.updatePosition(promotionSquare!.column,promotionSquare!.row)
        promotionSquare!.occupy(selectedPiece)
        handleSquareClick(Logic.coordToKey([promotionSquare!.column,promotionSquare!.row]), promotionSquare!, boardState)
        setShowPromotion(false)
        setCanClick(true)
        setCheck(Logic.lookForCheck(boardState,teamTurn))
        setMoveDict(disqualifyMovesForCheck(createMoveDictionary(boardState, teamTurn), boardState, teamTurn))
        setCaptureDict(disqualifyMovesForCheck(createCaptureDictionary(boardState, teamTurn), boardState, teamTurn))
        setCastleDict(Logic.createCastleDictionary(boardState,teamTurn))
        let checkWinner: string = Logic.checkForMate(disqualifyMovesForCheck(createMoveDictionary(boardState, !teamTurn), boardState, !teamTurn)
            , disqualifyMovesForCheck(createCaptureDictionary(boardState, !teamTurn), boardState, !teamTurn)
            , teamInCheck, !teamTurn);
        if (checkWinner !== "None") {
            onGameEnd(checkWinner)
        }


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
                        isCastleMove = {isSubArray([colIndex,rowIndex],arrayOfCastles)}
                    />
                ))}

            </div>
        ));
    };
    return (
        <div className="chessboard-container">
            <div className="chessboard" style={{ display: 'grid', gridTemplateColumns: `repeat(${8}, 100px)` }}>
                {generateChessboard()}
            </div>
            {showPromotionDialog && (
                <div className="promotion-overlay">
                    <PromotionDialog onSelect={(selectedPiece: Piece) => boardHandlePromotion(selectedPiece)} teamIsBlack={promotionSquare!.occupying!.isBlack}/>
                </div>
            )}
        </div>
    );
};

export default Chessboard;