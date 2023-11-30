import {Piece} from './Piece';
export class Square{
    occupying:Piece|null;
    row: number;
    column: number;
    constructor(row:number, column:number, piece: Piece | null = null) {
        this.occupying = piece;
        this.row = row;
        this.column = row;
    }
    clear(){
        this.occupying = null;
    }
    occupy(piece: Piece){
        this.occupying = piece;
    }

}