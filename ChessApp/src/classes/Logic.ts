import {King, Piece} from './Piece';
import {Square} from './Square';
// @ts-ignore
import _ from 'lodash';

export enum Teams{
    WHITE = 'white',
    BLACK = 'black',
    NONE = 'none'
}
function isSubArray(subArray: number[], array: number[][]) {
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


export function coordToKey(array:number[]): string {
    return `${array[0]}-${array[1]}`;
}

export function keyToCoord(str: string): number[] {
    const [x, y] = str.split('-').map(Number);
    return [x, y];
}

export function lookForCheck(boardState: Square[][],teamIsBlack:boolean){ /*team to check if their king is in check*/
    console.log("team looking for isBlack:", teamIsBlack)
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
                console.log("KING IN CHECK")
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
                console.log(legalMoves[i])
                console.log("CHECKING:", lookForCheck(copiedBoard,teamIsBlack))
                copiedBoard[col][row].moveTo(legalMoves[i][0],legalMoves[i][1],copiedBoard);
                if(lookForCheck(copiedBoard,teamIsBlack) == Teams.NONE){
                    okayMoves = okayMoves.concat([legalMoves[i]])
                    console.log("okay'ed:" , okayMoves)
                }
        }
        moveDict[key] = okayMoves;
    }
    console.log("MOVEDICT", moveDict)
    return moveDict;
}