import {Square} from './Square';
import {Teams} from './Logic'
import {Board} from "./Board";

export{};

export class Piece{
    hasMoved: boolean;
    pointValue: number;
    movementBehaviours: MovementBehaviour[]
    captureBehaviours: MovementBehaviour[]
    royalty: boolean;
    isBlack: boolean;
    image: string;
    colPos: number;
    rowPos: number;
    canCastle: boolean;
    canPromote: boolean;
    hasDeathTrigger: boolean;


    constructor(pointValue: number, isBlack:boolean, imageString:string, colPos: number, rowPos: number ) {
        this.hasMoved = false;
        this.pointValue = pointValue;
        this.movementBehaviours = [];
        this.captureBehaviours = [];
        this.royalty = false;
        this.isBlack = isBlack;
        this.image = imageString;
        this.colPos = colPos;
        this.rowPos = rowPos;
        this.canCastle = false;
        this.canPromote = false;
        this.hasDeathTrigger = false;
    }
    getMoves(boardState: Square[][]):number[][]{
        let legalMoves: number[][] = [];
        for (const moveset of this.movementBehaviours){
            legalMoves = legalMoves.concat(moveset.getMoves(boardState,this));
        }
        return(legalMoves);
    }
    getCaptures(boardState: Square[][]):number[][]{
        let legalCaptures: number[][] = [];
        for (const moveset of this.captureBehaviours){
            legalCaptures = legalCaptures.concat(moveset.getCaptures(boardState,this));
        }
        return(legalCaptures);
    }

    onDeath(boardState:Square[][]){
        console.log("Piece has no death effects")
    }

    updatePosition(newColPos: number, newRowPos:number){
        this.colPos = newColPos;
        this.rowPos = newRowPos;
    }
    changeTeam(newTeam:boolean):void{
        this.isBlack = newTeam;
        this.image = this.image.split('_')[0] + (this.isBlack ? "_black.png" : "_white.png")
    }
}
interface MovementBehaviour{
    getMoves(boardState:Square[][],piece:Piece):number[][];
    getCaptures(boardState:Square[][],piece:Piece):number[][];
};

class BasicLinearMoves implements MovementBehaviour{
    limit:number;
    moveMatrix: number[][]
    constructor(limit:number = 16) {
        this.limit = limit;
        this.moveMatrix = [];
    }
    getMoves(boardState:Square[][],piece:Piece):number[][]{
        let i:number = 1;
        let legalMoves: number[][] = []
        for (const direction of this.moveMatrix){
            i = 1;
            while(i<=this.limit &&
            (piece.colPos + i*direction[0]) >= 0 && (piece.colPos + i*direction[0]) <= boardState[0].length -1 &&
            (piece.rowPos + i*direction[1]) >= 0 && (piece.rowPos + i*direction[1]) <= boardState.length -1 &&
            boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying == null){
                legalMoves.push([piece.colPos+i*direction[0],piece.rowPos+i*direction[1]]);
                i++
            }
        }
        return legalMoves;
    }
    getCaptures(boardState:Square[][],piece:Piece):number[][]{
        let i:number = 1;
        let legalCaptures: number[][] = []
        for (const direction of this.moveMatrix){
            i = 1;
            while(i<=this.limit &&
            (piece.colPos + i*direction[0]) >= 0 && (piece.colPos + i*direction[0]) <= boardState[0].length -1 &&
            (piece.rowPos + i*direction[1]) >= 0 && (piece.rowPos + i*direction[1]) <= boardState.length -1){
                if( boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying != null){
                    if(boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying?.isBlack != piece.isBlack) {
                        legalCaptures.push([piece.colPos + i * direction[0],piece.rowPos + i * direction[1]]);}
                    break;
                }
                i++
            }
        }
        return legalCaptures
    }
} /*Moves that require uninterrupted line of sight. Leapers fall under this category, they move along a different axis*/
class LeapingHippo extends BasicLinearMoves {
    axis1: number;
    axis2: number;
    moveMatrix: number[][]

    constructor(axis1: number, axis2: number, limit: number = 1) {
        super(limit);
        this.axis1 = axis1;
        this.axis2 = axis2;
        this.limit = limit;
        this.moveMatrix = [[this.axis1, this.axis2], [this.axis1, -this.axis2],
            [-this.axis1, this.axis2], [-this.axis1, -this.axis2],
            [this.axis2, this.axis1], [this.axis2, -this.axis1],
            [-this.axis2, this.axis1], [-this.axis2, -this.axis1]];
    }
}
class SlidingOrtho extends BasicLinearMoves {
    constructor(limit: number = 16) {
        super(limit)
        this.moveMatrix = [[1, 0], [0, 1],
            [-1, 0], [0, -1]]
    }
}
class SlidingDiag extends BasicLinearMoves {
    constructor(limit: number = 16) {
        super(limit)
        this.moveMatrix = [[1, 1], [1, -1],
            [-1, 1], [-1, - 1]]
    }
}
class MarchForward implements MovementBehaviour{
    limit:number;
    firstStep:number;
    constructor(limit:number,firstStep:number) {
        this.limit = limit;
        this.firstStep = firstStep
    }
    getMoves(boardState:Square[][], piece:Piece){
        let legalMoves:number[][] = [];
        let functionalLimit: number = this.limit;
        if(!piece.hasMoved){ functionalLimit = this.firstStep};
        let i:number = 1;
        if(piece.isBlack){
            while(piece.rowPos+i <= boardState.length-1 && boardState[piece.colPos][piece.rowPos+i].occupying == null && i<=functionalLimit){
                legalMoves.push([piece.colPos,piece.rowPos+i]);
                i++
                }
        }
        else{
            while(piece.rowPos-i >= 0 && boardState[piece.colPos][piece.rowPos-i].occupying == null && i<=functionalLimit){
                legalMoves.push([piece.colPos,piece.rowPos-i]);
                i++
                }

        }
        return legalMoves;
    }
    getCaptures(boardState: Square[][], piece: Piece): number[][]{
        return [];
    }
}
class PawnCapture extends BasicLinearMoves{
    constructor(isBlack:boolean) {
        super(1)
        this.moveMatrix = (isBlack ? [[1,1],[-1,1]] : [[1,-1],[-1,-1]])
    }
}
class CannonCapture implements MovementBehaviour{
    moveMatrix: number[][]
    constructor() {
        this.moveMatrix=[[1,0],[0,1],[-1,0],[0,-1]]
    }
    getMoves(boardState: Square[][], piece: Piece): number[][] {
        console.log("CannonCapture doesn't have movement defined!")
        return[];
    }
    getCaptures(boardState:Square[][],piece:Piece):number[][]{
        let i:number = 1;
        let legalCaptures: number[][] = []
        let screenFound = false;
        for (const direction of this.moveMatrix){
            i = 1;
            screenFound = false
            while(
            (piece.colPos + i*direction[0]) >= 0 && (piece.colPos + i*direction[0]) <= boardState[0].length -1 &&
            (piece.rowPos + i*direction[1]) >= 0 && (piece.rowPos + i*direction[1]) <= boardState.length -1){
                if( boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying != null){
                    if(screenFound === true) {
                        if (boardState[piece.colPos + i * direction[0]][piece.rowPos + i * direction[1]].occupying?.isBlack != piece.isBlack) {
                            legalCaptures.push([piece.colPos + i * direction[0], piece.rowPos + i * direction[1]]);
                            break;
                        }
                        else{break;}
                    }
                    if(boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying != null && screenFound === false){
                        screenFound = true
                    }
                }
                i++
            }
        }
        return legalCaptures
    }

}
export class Pawn extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(1, isBlack, isBlack ? '/pieces/pawn_black.png' : '/pieces/pawn_white.png', colPos, rowPos);
        this.canPromote = true;
        this.movementBehaviours.push(new MarchForward(1,2));
        this.captureBehaviours.push(new PawnCapture(this.isBlack));
    }
}
export class Bishop extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/bishop_black.png' : '/pieces/bishop_white.png', colPos, rowPos);
        this.movementBehaviours.push(new SlidingDiag(16));
        this.captureBehaviours.push(new SlidingDiag(16));
    }
}
export class Knight extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/knight_black.png' : '/pieces/knight_white.png', colPos, rowPos);
        this.movementBehaviours.push(new LeapingHippo(1,2));
        this.captureBehaviours.push(new LeapingHippo(1,2));

    }
}
export class Unicorn extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/unicorn_black.png' : '/pieces/unicorn_white.png', colPos, rowPos);
        this.movementBehaviours.push(new LeapingHippo(1,2,16));
        this.captureBehaviours.push(new LeapingHippo(1,2,16));

    }
}
export class Rook extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(5, isBlack, isBlack ? '/pieces/rook_black.png' : '/pieces/rook_white.png', colPos, rowPos);
        this.canCastle = true;
        this.movementBehaviours.push(new SlidingOrtho(16));
        this.captureBehaviours.push(new SlidingOrtho(16));
    }
}
export class Queen extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(9, isBlack, isBlack ? '/pieces/queen_black.png' : '/pieces/queen_white.png', colPos, rowPos);
        this.movementBehaviours.push(new SlidingDiag());
        this.captureBehaviours.push(new SlidingDiag());
        this.movementBehaviours.push(new SlidingOrtho());
        this.captureBehaviours.push(new SlidingOrtho());
    }

}
export class King extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/king_black.png' : '/pieces/king_white.png', colPos, rowPos);
        this.royalty = true;
        this.canCastle = true;
        this.movementBehaviours.push(new SlidingDiag(1));
        this.captureBehaviours.push(new SlidingDiag(1));
        this.movementBehaviours.push(new SlidingOrtho(1));
        this.captureBehaviours.push(new SlidingOrtho(1));
    }
}
export class Mann extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/mann_black.png' : '/pieces/mann_white.png', colPos, rowPos);
        this.movementBehaviours.push(new SlidingDiag(1));
        this.captureBehaviours.push(new SlidingDiag(1));
        this.movementBehaviours.push(new SlidingOrtho(1));
        this.captureBehaviours.push(new SlidingOrtho(1));
    }
}
export class Cannon extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(5, isBlack, isBlack ? '/pieces/cannon_black.png' : '/pieces/cannon_white.png', colPos, rowPos);
        this.canCastle = true;
        this.movementBehaviours.push(new SlidingOrtho(16));
        this.captureBehaviours.push(new CannonCapture());
    }
}
export class Roach extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(2, isBlack, isBlack ? '/pieces/roach_black.png' : '/pieces/roach_white.png', colPos, rowPos);
        this.movementBehaviours.push(new MarchForward(1,1));
        this.captureBehaviours.push(new PawnCapture(this.isBlack));
        this.hasDeathTrigger = true;
    }
    onDeath(boardState: Square[][]): void {
        if(this.isBlack && boardState[this.colPos][1].occupying == null){
            boardState[this.colPos][1].occupy(this)
            this.updatePosition(this.colPos, 1)
        }
        if(!this.isBlack && boardState[this.colPos][boardState[this.colPos].length-2].occupying == null){
            boardState[this.colPos][boardState[this.colPos].length-2].occupy(this)
            this.updatePosition(this.colPos, boardState[this.colPos].length-2)
        }
    }
}