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
        let teamIsBlack = true
        let j:number = (teamIsBlack? 1 : 6)
        for(let i = 0; i <= this.squares.length -1 ; i++){
            this.squares[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
        }
        j = (teamIsBlack? j-1 : j+1)
        this.squares[0][j].occupy(new Pieces.Rook(teamIsBlack, 0, j))
        this.squares[1][j].occupy(new Pieces.Knight(teamIsBlack, 1, j))
        this.squares[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        this.squares[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        this.squares[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        this.squares[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        this.squares[6][j].occupy(new Pieces.Knight(teamIsBlack, 6, j))
        this.squares[7][j].occupy(new Pieces.Rook(teamIsBlack, 7, j))
        teamIsBlack = false
        j = 6
        for(let i = 0; i <= this.squares.length -1 ; i++){
            this.squares[i][j].occupy(new Pieces.Pawn(teamIsBlack, i, j))
        }
        j = (teamIsBlack? j-1 : j+1)
        this.squares[0][j].occupy(new Pieces.Rook(teamIsBlack, 0, j))
        this.squares[1][j].occupy(new Pieces.Knight(teamIsBlack, 1, j))
        this.squares[2][j].occupy(new Pieces.Bishop(teamIsBlack, 2, j))
        this.squares[3][j].occupy(new Pieces.Queen(teamIsBlack, 3, j))
        this.squares[4][j].occupy(new Pieces.King(teamIsBlack, 4, j))
        this.squares[5][j].occupy(new Pieces.Bishop(teamIsBlack, 5, j))
        this.squares[6][j].occupy(new Pieces.Knight(teamIsBlack, 6, j))
        this.squares[7][j].occupy(new Pieces.Rook(teamIsBlack, 7, j))
    }

    getBoardState():Square[][]{
        return this.squares;
    }



}
