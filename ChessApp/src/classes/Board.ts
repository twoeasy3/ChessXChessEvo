import * as Pieces from './Piece';
import {Square} from './Square';
import * as headers from './Piece';

export class Board{
    squares: Square[][];
    constructor(width:number) {
        this.squares = [];
        for (let i = 0; i < width; i++) {
            let row: Square[] = []
            for (let j = 0; j < width; j++) {
                row.push(new Square(i,j));
            }
            this.squares.push(row);
        }
        for(let i = 0; i<width; i++) {
            this.squares[i][1].occupy(new Pieces.Pawn(true, i, 1))
            this.squares[i][width-2].occupy(new Pieces.Pawn(false,i,width-2))
        }
        this.squares[0][2].occupy(new Pieces.Rook(true, 0, 2))
        this.squares[1][3].occupy(new Pieces.Bishop(true, 1, 3))
        this.squares[3][3].occupy(new Pieces.Queen(true, 3, 3))
        this.squares[3][4].occupy(new Pieces.Knight(true, 3, 4))
        this.squares[6][4].occupy(new Pieces.King(false, 6, 4))
        this.squares[7][4].occupy(new Pieces.Unicorn(false, 7, 4))
    }

    getBoardState():Square[][]{
        return this.squares;
    }


}