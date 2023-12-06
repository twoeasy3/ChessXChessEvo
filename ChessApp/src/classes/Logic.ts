import {King, Piece} from './Piece';
import {Square} from './Square';
// @ts-ignore
import _ from 'lodash';
import exp from "constants";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;

export enum Teams{
    WHITE = 'White',
    BLACK = 'Black',
    NONE = 'None',
    DRAW = 'Draw',
}
export function isSubArray(subArray: number[], array: number[][]) {
    return array.some((arr) =>
        arr.length === subArray.length && arr.every((num, index) => num === subArray[index])
    );
}

export function createMoveDictionary(boardState: Square[][], teamIsBlack:boolean): {[key:string]: number[][]}{
    let moveDictionary:{[key:string]:number[][]} = {}
    for (let i=0; i<= boardState.length -1; i++){
        for(let j=0; j<=boardState[0].length -1; j++){
            if(boardState[i][j].occupying != null){
                if(boardState[i][j].occupying!.isBlack == teamIsBlack){
                    moveDictionary[coordToKey([i,j])] = boardState[i][j].occupying!.getMoves(boardState)
                }
            }
        }
    }
    return moveDictionary;
}

export function createCaptureDictionary(boardState: Square[][], teamIsBlack:boolean): {[key:string]: number[][]}{
    let captureDictionary:{[key:string]:number[][]} = {}
    for (let i=0; i<= boardState.length -1; i++){
        for(let j=0; j<=boardState[0].length -1; j++){
            if(boardState[i][j].occupying != null){
                if(boardState[i][j].occupying!.isBlack == teamIsBlack){
                    captureDictionary[coordToKey([i,j])] = boardState[i][j].occupying!.getCaptures(boardState)
                }
            }
        }
    }
    return captureDictionary;
}

export function createCastleDictionary(boardState: Square[][], teamIsBlack:boolean): {[key:string]: {[key:string]: number[][]}}{
    let castleDictionary:{[key:string]: {[key:string]: number[][]}} = {}
    for (let i=0; i<= boardState.length -1; i++){
        for(let j=0; j<=boardState[0].length -1; j++){
            if(boardState[i][j].occupying != null){
                if(boardState[i][j].occupying!.isBlack == teamIsBlack && boardState[i][j].occupying!.royalty && !boardState[i][j].occupying!.hasMoved){
                    let kingCastleDict = boardState[i][j].occupying!.getCastles(boardState)
                    /*Don't assert this, the check should be done*/
                    if(kingCastleDict !== null) {
                        castleDictionary[coordToKey([i, j])] = boardState[i][j].occupying!.getCastles(boardState)!
                    }
                }
            }
        }
    }
    return castleDictionary;
}

export function isInCastleDict(col: number, row: number, castleDict: {[key:string]: {[key:string]: number[][]}}){
    for (const key of Object.keys(castleDict)) {
        for (const key2 of Object.keys(castleDict[key])){
             if(isSubArray([col,row],castleDict[key][key2])){
                 return true
             }
        }
    }
    return false;
}
export function getPossibleCastles(castleDict: {[key:string]: {[key:string]: number[][]}}, clickedSquare:Square, teamTurn:boolean){
    let arrayOfSquares:number[][] = []
    let coord:string = coordToKey([clickedSquare.column,clickedSquare.row])
    if(clickedSquare.occupying?.royalty != true || clickedSquare.occupying.isBlack != teamTurn ){
        return []
    }
    if (castleDict[coord] == null){
        return []
    }
    for (const key of Object.keys(castleDict[coord])){
        arrayOfSquares = arrayOfSquares.concat(castleDict[coord][key])
    }
    return arrayOfSquares
}

export function coordToKey(array:number[]): string {
    return `${array[0]}-${array[1]}`;
}

export function keyToCoord(str: string): number[] {
    const [x, y] = str.split('-').map(Number);
    return [x, y];
}

export function lookForCheck(boardState: Square[][],teamIsBlack:boolean){ /*team to check if their king is in check*/
    let playerKings:number[][] = [];
    let legalCaptures:number[][] = [];
    for (let i=0; i<= boardState.length -1; i++){
        for(let j=0; j<=boardState[0].length -1; j++){
            if(boardState[i][j].occupying != null){
                if(boardState[i][j].occupying!.royalty && boardState[i][j].occupying!.isBlack == teamIsBlack){
                    playerKings = playerKings.concat([[i,j]])
                }
                else if(boardState[i][j].occupying!.isBlack !== teamIsBlack){
                    legalCaptures = legalCaptures.concat(boardState[i][j].occupying!.getCaptures(boardState));
                }
            }
        }
    }
    if(legalCaptures.length != 0) {
        for (let k = 0; k <= playerKings.length - 1; k++) {
            if (isSubArray(playerKings[k], legalCaptures)) {
                return((teamIsBlack ? Teams.BLACK : Teams.WHITE))

            }
        }
    }
    return Teams.NONE;
}

export function disqualifyMovesForCheck(moveDict:{[key:string]: number[][]},boardState:Square[][],teamIsBlack:boolean){
    for (const key of Object.keys(moveDict)) {
        let [col,row]:number[] = keyToCoord(key);
        let legalMoves:number[][] = moveDict[key];
        let okayMoves: number[][] = [];
        for(let i = 0; i<= legalMoves.length-1 ; i++){
            let copiedBoard: Square[][] = _.cloneDeep(boardState)
                copiedBoard[col][row].moveTo(legalMoves[i][0],legalMoves[i][1],copiedBoard);
                if(lookForCheck(copiedBoard,teamIsBlack) == Teams.NONE){
                    okayMoves = okayMoves.concat([legalMoves[i]])
                }
        }
        moveDict[key] = okayMoves;
    }
    return moveDict;
}

export function checkIfEveryDictEntryIsBlank(moveDict:{[key:string]: number[][]}) {
    for (const key of Object.keys(moveDict)) {
        if (moveDict[key].length !== 0) {
            return false
        }

    }
    return true
}

export function checkForMate(moveDict:{[key:string]: number[][]}, captDict:{[key:string]: number[][]}, teamInCheck:Teams, teamTurn:boolean ){
    /*or(const key of Object.keys(moveDict)){
        console.log("movedict check: ",moveDict[key])
        if(moveDict[key].length !== 0){
            return "None"
        }
        for(const key of Object.keys(captDict)){
            console.log("captdict check: ",captDict[key])
            if(captDict[key].length !== 0){
                return "None"
            }
    }*/
    if(teamInCheck == Teams.WHITE && !teamTurn && checkIfEveryDictEntryIsBlank(moveDict) && checkIfEveryDictEntryIsBlank(captDict)){
        return "Black"
    }
    else if(teamInCheck == Teams.BLACK && teamTurn && checkIfEveryDictEntryIsBlank(moveDict) && checkIfEveryDictEntryIsBlank(captDict)){

        return "White"
    }
    else if(teamInCheck == Teams.NONE && checkIfEveryDictEntryIsBlank(moveDict) && checkIfEveryDictEntryIsBlank(captDict)) {
        return "Draw"
    }
    return "None"
}

export function pawnInPromotionZone(square:Square, lastRow:number){
    if(!square.occupying?.canPromote){
        return false;
    }
    else{
        if(square.occupying?.isBlack && square.row == lastRow ){
            return true
        }
        else if(!square.occupying?.isBlack && square.row == 0){
            return true
        }
    }
    return false
}

export function updateAllStatuses(boardState:Square[][]){
    for(let i = 0; i<= boardState.length-1; i++){
        for(let j = 0; j<= boardState[i].length-1; j++){
            if(boardState[i][j].occupying!=null){
                boardState[i][j].occupying!.clearStatus()
            }
        }
    }
    for(let k = 0; k<= boardState.length-1; k++){
        for(let l = 0; l<= boardState[k].length-1; l++){
            if(boardState[k][l].occupying!=null){
                boardState[k][l].occupying!.inflictStatus(boardState)
            }
        }
    }
}