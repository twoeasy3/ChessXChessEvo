import {Piece} from './Piece';
import * as Logic from "./Logic";
import {keyToCoord} from "./Logic";
export class Square{
    occupying:Piece|null;
    row: number;
    column: number;
    constructor(column:number, row:number, piece: Piece | null = null) {
        this.occupying = piece;
        this.row = row;
        this.column = column;
    }
    clear(){
        this.occupying = null;
    }
    occupy(piece: Piece|null){

        this.occupying = piece;
    }
    getPiece():Piece|null{
        return this.occupying;
    }
    moveTo(column:number,row:number,boardState: Square[][]){
        if(this.occupying!=null){
            this.occupying.updatePosition(column,row);
            this.occupying.hasMoved=true;
            if(boardState[column][row].occupying?.hasDeathTrigger){
                console.log("Checking death", boardState[column][row].occupying)
                boardState[column][row].occupying!.onDeath(boardState)
            }
            boardState[column][row].occupying = this.occupying;
            this.clear();
        }
    }

    castleWith(clickedSquare:Square, boardState:Square[][], castleDict:{[key:string]: {[key:string]: number[][]}}){
        let tempDict:{[key:string]: number[][]} = castleDict[Logic.coordToKey([this.column,this.row])]
        for(const key of Object.keys(tempDict)){
            if(Logic.isSubArray([clickedSquare.column,clickedSquare.row],tempDict[key])){
                let coord = keyToCoord(key)
                this.moveTo(clickedSquare.column,clickedSquare.row,boardState)
                if(coord[0] < this.column){
                    boardState[coord[0]][coord[1]].moveTo(clickedSquare.column+1,clickedSquare.row,boardState)
                }
                else(
                    boardState[coord[0]][coord[1]].moveTo(clickedSquare.column-1,clickedSquare.row,boardState)
                )

            }
        }

    }

}