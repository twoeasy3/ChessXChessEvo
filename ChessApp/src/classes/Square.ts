import {Piece} from './Piece';
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
            this.occupying.colPos = column;
            this.occupying.rowPos = row;
            this.occupying.hasMoved=true;
            boardState[column][row].occupying = this.occupying;
            this.clear();
        }
    }

}