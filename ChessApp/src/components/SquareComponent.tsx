import React, {useState} from 'react';
import {useEffect} from "react";
import { Square } from '../classes/Square';
import './SquareComponent.css';
import {Board} from '../classes/Board';
import {Piece} from '../classes/Piece';

interface SquareComponentProps {
    square: Square; // Pass an instance of the Square class as a prop
    isSelected: boolean;
    isLegalMove: boolean;
    isLegalCapture: boolean
    onClick: () => void;
    piece: Piece|null;
    teamInCheck: boolean;
    isCastleMove: boolean;



}

const SquareComponent: React.FC<SquareComponentProps> = ({ square,isSelected,isLegalMove,isLegalCapture,
                                                             onClick, piece:Piece , teamInCheck, isCastleMove}) => {
    // Use the game logic methods/properties from the Square class

    // Determine the background color based on the position of the square
    const isLightCell = (square.row + square.column) % 2 === 0;
    const cellColor = isLightCell ? 'light' : 'dark';
    // Render the visual representation of the square
    return (
        <div className={`chess-cell ${cellColor}-cell ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            {square.getPiece()!=null ? <img src={square.getPiece()?.image} alt={"piece image"} className={`icon-container`} draggable="false"/> : <div></div>}
            {isLegalMove ? <img src={"./pieces/move_dot.png"} alt={"move target"} draggable="false"/> : <div></div>}
            {isLegalCapture ? <img src={"./pieces/target.png"} alt={"capture target"} className={`overlay-target`} draggable="false"/> : <div></div>}
            {isCastleMove ? <img src={"./pieces/castle.png"} alt={"castle indicator"} className={`overlay-target`} draggable="false"/> : <div></div>}
            {(teamInCheck && square.getPiece()?.royalty) ? <img src={"./pieces/check.png"} alt={"capture target"} className={`overlay-target`} draggable="false"/> : <div></div>}
        </div>
    );
};

export default SquareComponent;