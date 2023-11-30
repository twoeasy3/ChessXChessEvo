import {Piece} from './Piece';
export class Square{
    occupying:Piece|null;
    row: number;
    column: number;
    constructor(row:number, column:number, piece: Piece | null = null) {
        this.occupying = piece;
        this.row = row;
        this.column = column;
    }
    clear(){
        this.occupying = null;
    }
    occupy(piece: Piece){
        this.occupying = piece;
    }
    getPiece():Piece|null{
        return this.occupying;
    }

}