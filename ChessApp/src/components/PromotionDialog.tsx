import * as Pieces from  '../classes/Piece';
import React from 'react';


interface PromotionDialogProps {
    onSelect: (selectedPiece: Pieces.Piece) => void;
    teamIsBlack:boolean
}


export const PromotionDialog: React.FC<PromotionDialogProps> = ({ onSelect,teamIsBlack }) => {
    const handlePromotion = (selectedPiece:Pieces.Piece) => {
        onSelect(selectedPiece);
    };

    let pieceArray:Pieces.Piece[] = [
        new Pieces.Mann(teamIsBlack,-1,-1),
        new Pieces.Knight(teamIsBlack,-1,-1),
        new Pieces.Bishop(teamIsBlack,-1,-1),
        new Pieces.Cannon(teamIsBlack,-1,-1),
        new Pieces.Rook(teamIsBlack,-1,-1),
        new Pieces.Unicorn(teamIsBlack,-1,-1),
        new Pieces.Queen(teamIsBlack,-1,-1)    ]

    const buildPromotionDialog = () =>{

        return(
            <div>
            <div className="promotion-title">{"Choose piece to promote to:"}</div>
            <div className="promotion-options">
                {pieceArray.map((piece:Pieces.Piece, index: number) => (
                    <img src={piece.image} alt={"piece image"} className={`icon-container`} draggable="false" onClick={() => handlePromotion(piece)}/>)
                )} </div>\
            </div>
        )
    }

    return (
        buildPromotionDialog()
    );
};

/*<button onClick={() => handlePromotion(new Pieces.Queen(teamIsBlack,-1,-1))}>Queen</button>
<button onClick={() => handlePromotion(new Pieces.Rook(teamIsBlack,-1,-1))}>Rook</button>
<button onClick={() => handlePromotion(new Pieces.Bishop(teamIsBlack,-1,-1))}>Bishop</button>
<button onClick={() => handlePromotion(new Pieces.Knight(teamIsBlack,-1,-1))}>Knight</button>*/