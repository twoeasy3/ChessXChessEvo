// Chessboard.tsx
import React from 'react';
import {Square} from '../classes/Square'; // Import your Square class
import SquareComponent from './SquareComponent'; // Import the React component
import {Board} from '../classes/Board';

interface ChessboardProps {
    size: number;
}

const Chessboard: React.FC<ChessboardProps> = ({ size }) => {
    const generateChessboard = () => {

        // Create instances of the Square class for each cell
        const chessboard: Board = new Board(size);
        const boardState: Square[][] = chessboard.getBoardState()

        return boardState.map((row, rowIndex) => (
            <div key={rowIndex} className="chess-row">
                {row.map((square, colIndex) => (
                    <SquareComponent key={`${rowIndex}-${colIndex}`} square={square} />
                ))}
            </div>
        ));
    };
    return (
        <div className="chessboard" style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 100px)` }}>
            {generateChessboard()}
        </div>
    );
};

export default Chessboard;