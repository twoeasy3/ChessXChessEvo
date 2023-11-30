import {Piece} from './Piece';
import {Square} from './Square';
class Board{
    squares: Square[][];
    constructor() {
        this.squares = [];
        for (let i = 0; i < 8; i++) {
            let row: Square[] = []
            for (let j = 0; j < 8; j++) {
                row.push(new Square(i,j));
            }
            this.squares.push(row);
        }
    }


}