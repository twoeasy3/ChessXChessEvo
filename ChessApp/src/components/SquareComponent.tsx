import React from 'react';
import { Square } from '../classes/Square';
import './SquareComponent.css';

interface SquareComponentProps {
    square: Square; // Pass an instance of the Square class as a prop
}

const SquareComponent: React.FC<SquareComponentProps> = ({ square }) => {
    // Use the game logic methods/properties from the Square class
    const piece = square.getPiece();

    // Determine the background color based on the position of the square
    const isLightCell = ((square.row + square.column) % 2) == 0;

    const cellColor = isLightCell ? 'light' : 'dark';

    // Render the visual representation of the square
    return (
        <div className={`${cellColor}-cell`}>
            {<img src={`/pieces/king_black.png`} alt={"temp piece"} />}
        </div>
    );
};

export default SquareComponent;