import * as Pieces from '../classes/Piece';
import React from "react";
import {Square} from '../classes/Square'
import {Board} from "../classes/Board";

interface PieceSelectorProps {
    teamIsBlack:boolean
    flipBuildTeam: () => void;
    boardState: Square[][];
    callForUpdate: Function;
    setGameStart: () => void;
}
export const PieceSelector: React.FC<PieceSelectorProps> = ({ teamIsBlack,flipBuildTeam , boardState,callForUpdate, setGameStart}) => {
    let pawnArray:string[] = [
        "Pawn","Roach","Berolina","Soldier"]
    let minorArray:string[] = [
        "Bishop", "Knight", "Mann","EmpoweredBishop","EmpoweredKnight","Ghost"]
    let castleArray:string[] = [
        "Rook", "Cannon","EmpoweredRook"]
    let majorArray:string[] = [
        "Queen", "Unicorn","Gorgon", "Reaper"]

    function buildFIDE() {
        console.log("building FIDE")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            boardState[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
            }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Rook(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Knight(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Knight(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Rook(teamIsBlack, 7, j))
        callForUpdate()
    }

    function buildEmpowered() {
        console.log("building Empowered")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            boardState[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.EmpoweredRook(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.EmpoweredKnight(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.EmpoweredBishop(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Mann(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.EmpoweredBishop(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.EmpoweredKnight(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.EmpoweredRook(teamIsBlack, 7, j))
        callForUpdate()
    }
    function buildInfestation() {
        console.log("building Infestation")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            boardState[i][j].occupy(new Pieces.Roach(teamIsBlack, i, j))
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Rook(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Knight(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Unicorn(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Unicorn(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Knight(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Rook(teamIsBlack, 7, j))
        callForUpdate()
    }

    function buildMidfield() {
        console.log("building Midfield")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            if(i == 3 || i == 4){
                boardState[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
            }
            else {
                boardState[i][j].occupy(new Pieces.Berolina(teamIsBlack, i, j))
            }
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Rook(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Cannon(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Cannon(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Rook(teamIsBlack, 7, j))
        callForUpdate()
    }

    function buildMythic() {
        console.log("building Mythic")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            if(i == 2 || i == 6){
                boardState[i][j].occupy(new Pieces.Mann(teamIsBlack, i, j))
            }
            else {
                boardState[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
            }
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Cannon(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Unicorn(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Gorgon(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Unicorn(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Cannon(teamIsBlack, 7, j))
        callForUpdate()
    }

    function buildSpooky() {
        console.log("building Spooky")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            if(i == 3 || i == 4){
                boardState[i][j].occupy(new Pieces.Berolina(teamIsBlack, i, j))
            }else{
                boardState[i][j].occupy(new Pieces.Roach(teamIsBlack, i, j))
            }
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Ghost(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Knight(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Reaper(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Knight(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Ghost(teamIsBlack, 7, j))
        callForUpdate()
    }

    function buildXiangqi() {
        console.log("building Xiangqi")
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= boardState.length -1 ; i++){
            {
                boardState[i][j].occupy(new Pieces.Soldier(teamIsBlack, i, j))
            }
        }
        j = (teamIsBlack? j-1 : j+1)
        boardState[0][j].occupy(new Pieces.Cannon(teamIsBlack, 0, j))
        boardState[1][j].occupy(new Pieces.Rook(teamIsBlack, 1, j))
        boardState[2][j].occupy(new Pieces.Knight(teamIsBlack, 2, j))
        boardState[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        boardState[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        boardState[5][j].occupy(new Pieces.Knight(teamIsBlack, 5, j))
        boardState[6][j].occupy(new Pieces.Rook(teamIsBlack, 6, j))
        boardState[7][j].occupy(new Pieces.Cannon(teamIsBlack, 7, j))
        callForUpdate()
    }

    const buildPieceSelector = () =>{

        return(
            <div>
                <div className="piece-title">{"Piece Selector"}</div>
                <button className="preset-button" onClick={flipBuildTeam}>Change Team</button>
                <div className="piece-title">{"Pawns"}</div>
                    <hr />
                        <div className="piece-options">
                            {pawnArray.map((name:string, index: number) => (
                                <img src={(teamIsBlack ? `/pieces/${name.toLowerCase()}_black.png` : `/pieces/${name.toLowerCase()}_white.png`)} alt={"piece image"}
                                     className={`icon-container`} draggable="false" id="selectImage"/>)
                            )} </div>
                <div className="piece-title">{"Minor Pieces"}</div>
                    <hr />
                        <div className="piece-options">
                            {minorArray.map((name:string, index: number) => (
                                <img src={(teamIsBlack ? `/pieces/${name.toLowerCase()}_black.png` : `/pieces/${name.toLowerCase()}_white.png`)} alt={"piece image"}
                                     className={`icon-container`} draggable="false" id="selectImage"/>)
                            )} </div>
                <div className="piece-title">{"Castle Pieces"}</div>
                    <hr />
                        <div className="piece-options">
                            {castleArray.map((name:string, index: number) => (
                                <img src={(teamIsBlack ? `/pieces/${name.toLowerCase()}_black.png` : `/pieces/${name.toLowerCase()}_white.png`)} alt={"piece image"}
                                     className={`icon-container`} draggable="false" id="selectImage"/>)
                            )} </div>
                <div className="piece-title">{"Major Pieces"}</div>
                    <hr />
                        <div className="piece-options">
                            {majorArray.map((name:string, index: number) => (
                                <img src={(teamIsBlack ? `/pieces/${name.toLowerCase()}_black.png` : `/pieces/${name.toLowerCase()}_white.png`)} alt={"piece image"}
                                     className={`icon-container`} draggable="false" id="selectImage"/>)
                            )} </div>
                <div className="piece-title">{"Royal Pieces"}</div>
                    <hr />
                    <h3>Different Kings not implemented yet</h3>
                <div className="piece-title">{"Presets"}</div>
                    <hr />
                <button className="preset-button" onClick={buildFIDE}>FIDE Army</button>
                <button className="preset-button" onClick={buildEmpowered}>The Empowered</button>
                <button className="preset-button" onClick={buildInfestation}>Infestation</button>
                <button className="preset-button" onClick={buildMidfield}>Midfield Control</button>
                <button className="preset-button" onClick={buildMythic}>Mystic Myths</button>
                <button className="preset-button" onClick={buildSpooky}>Catacomb Crawlers</button>
                <button className="preset-button" onClick={buildXiangqi}>Xiangqi Warriors</button>
                <hr />
                <button className="start-game" onClick={setGameStart}>Start Game</button>
            </div>
        )
    }

    return (
        buildPieceSelector()
    );
};