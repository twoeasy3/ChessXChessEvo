import {Piece} from './Piece';
import {Square} from './Square';
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
    }

    getBoardState():Square[][]{
        return this.squares;
    }


}