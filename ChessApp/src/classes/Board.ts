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
                row.push(new Square(i, j));
            }
            this.squares.push(row);
        }
        for (let i = 0; i < width; i++) {
            this.squares[i][1].occupy(new Pieces.Pawn(true, i, 1))
            this.squares[i][width - 2].occupy(new Pieces.Pawn(false, i, width - 2))
        }
        this.squares[2][1].occupy(new Pieces.Mann(true, 2, 1))
        this.squares[width - 3][1].occupy(new Pieces.Mann(true, width - 3, 1))
        this.squares[2][8].occupy(new Pieces.Mann(false, 2, 8))
        this.squares[width - 3][8].occupy(new Pieces.Mann(false, width - 3, 8))
        this.squares[0][0].occupy(new Pieces.Rook(true, 0, 0))
        this.squares[1][0].occupy(new Pieces.Knight(true, 1, 0))
        this.squares[2][0].occupy(new Pieces.Unicorn(true, 2, 0))
        this.squares[3][0].occupy(new Pieces.Bishop(true, 3, 0))
        this.squares[4][0].occupy(new Pieces.Queen(true, 4, 0))
        this.squares[5][0].occupy(new Pieces.King(true, 5, 0))
        this.squares[6][0].occupy(new Pieces.Bishop(true, 6, 0))
        this.squares[7][0].occupy(new Pieces.Unicorn(true,7, 0))
        this.squares[8][0].occupy(new Pieces.Knight(true, 8, 0))
        this.squares[9][0].occupy(new Pieces.Rook(true, 9, 0))

        this.squares[0][9].occupy(new Pieces.Rook(false, 0, 9))
        this.squares[1][9].occupy(new Pieces.Knight(false, 1, 9))
        this.squares[2][9].occupy(new Pieces.Unicorn(false, 2, 9))
        this.squares[3][9].occupy(new Pieces.Bishop(false, 3, 9))
        this.squares[4][9].occupy(new Pieces.Queen(false, 4, 9))
        this.squares[5][9].occupy(new Pieces.King(false, 5, 9))
        this.squares[6][9].occupy(new Pieces.Bishop(false, 6, 9))
        this.squares[7][9].occupy(new Pieces.Unicorn(false,7, 9))
        this.squares[8][9].occupy(new Pieces.Knight(false, 8, 9))
        this.squares[9][9].occupy(new Pieces.Rook(false, 9, 9))

    }
    getBoardState():Square[][]{
        return this.squares;
    }


}