import * as Pieces from  '../classes/Piece';
import React from 'react';
interface PromotionDialogProps {
    onSelect: (selectedPiece: Pieces.Piece) => void; // Assuming Pieces.Piece is the correct type
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ onSelect }) => {
    const handlePromotion = (selectedPiece:Pieces.Piece) => {
        onSelect(selectedPiece);
    };

    return (
        <div className="promotion-options">
            <button onClick={() => handlePromotion(new Pieces.Queen(true,-1,-1))}>Queen</button>
            <button onClick={() => handlePromotion(new Pieces.Rook(true,-1,-1))}>Rook</button>
            <button onClick={() => handlePromotion(new Pieces.Bishop(true,-1,-1))}>Bishop</button>
            <button onClick={() => handlePromotion(new Pieces.Knight(true,-1,-1))}>Knight</button>
        </div>
    );
};

