import {Square} from './Square';
import {coordToKey, createMoveDictionary, disqualifyMovesForCheck, lookForCheck, Teams} from './Logic'
import {Board} from "./Board";
// @ts-ignore
import _ from 'lodash';

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
    attributeTags: string[]
    statusTags: string[];


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
        this.statusTags = []
        this.attributeTags = []
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

    getCastles(boardState:Square[][]):{[key:string]: number[][]}|null{
        console.log("Piece cannot initiate a castling move")
        return null
    }

    updatePosition(newColPos: number, newRowPos:number){
        this.colPos = newColPos;
        this.rowPos = newRowPos;
    }
    changeTeam(newTeam:boolean):void{
        this.isBlack = newTeam;
        this.image = this.image.split('_')[0] + (this.isBlack ? "_black.png" : "_white.png")
    }
    inflictStatus(boardState:Square[][]):void{
    }
    clearStatus(){
        this.statusTags = [];
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
    moveMatrix:number[][];
    constructor(limit:number,firstStep:number ) {
        this.limit = limit;
        this.firstStep = firstStep
        this.moveMatrix = [[1,0]]

    }
    getMoves(boardState:Square[][],piece:Piece):number[][]{
        let i:number = 1;
        let legalMoves: number[][] = []
        for (const direction of this.moveMatrix){
            i = 1;
            while((i<=this.limit || (i<=this.firstStep && !piece.hasMoved)) &&
            (piece.colPos + i*direction[0]) >= 0 && (piece.colPos + i*direction[0]) <= boardState[0].length -1 &&
            (piece.rowPos + i*direction[1]) >= 0 && (piece.rowPos + i*direction[1]) <= boardState.length -1 &&
            boardState[piece.colPos+i*direction[0]][piece.rowPos+i*direction[1]].occupying == null){
                legalMoves.push([piece.colPos+i*direction[0],piece.rowPos+i*direction[1]]);
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
        let tempMarch = new MarchForward(1,2);
        tempMarch.moveMatrix = (isBlack? [[0,1]] : [[0,-1]])
        this.movementBehaviours.push(tempMarch);
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
        this.movementBehaviours.push(new SlidingDiag(1));
        this.captureBehaviours.push(new SlidingDiag(1));
        this.movementBehaviours.push(new SlidingOrtho(1));
        this.captureBehaviours.push(new SlidingOrtho(1));
    }
    getCastles(boardState:Square[][]){
        if(this.hasMoved || this.colPos == 0 || this.colPos == boardState.length-1){
            return null
        }
        let kingCastleDictionary:{[key:string]:number[][]} = {}
        for(let i = 0; i <= boardState.length-1;i++){
            if(boardState[i][this.rowPos].occupying != null){
                if(boardState[i][this.rowPos].occupying!.canCastle && !boardState[i][this.rowPos].occupying!.hasMoved){
                    let pathClear = true;
                    let kingFinalPos = -1;
                    if(i<this.colPos){
                        let j=i+1;
                        while(j<this.colPos){ /*Check if spaces are blank*/
                            if(boardState[j][this.rowPos].occupying !== null){
                                pathClear = false;
                                break;
                            }
                            if(j-i < 3) { /*king only moves up to 2 spaces*/
                                let copiedBoard: Square[][] = _.cloneDeep(boardState) /*Check if King's movement through the spaces is attacked*/
                                /*This is the safest way to check just in case of unique capture methods!
                                * Pieces that are not attacking the path now may be able to if a King were to be in there
                                * Also, the capture dictionary doesn't check for empty squares anyway*/
                                copiedBoard[this.colPos][this.rowPos].moveTo(j, this.rowPos, copiedBoard);
                                if (lookForCheck(copiedBoard, this.isBlack) !== Teams.NONE) {
                                    pathClear = false;
                                    break;
                                }
                            }
                            j++;
                        }
                      if(this.colPos - 2 < 0){ /*If King starts less than two spaces from the edge*/
                          kingFinalPos = 0
                      }
                      else{
                          kingFinalPos = this.colPos - 2
                      }
                      if(pathClear){
                          kingCastleDictionary[coordToKey([i,this.rowPos])] = [[kingFinalPos,this.rowPos]] /*Dictionary: [rook pos]: [king pos]*/
                      }
                    }
                    if(i>this.colPos){
                        let k=i-1;
                        while(k>this.colPos){
                            if(boardState[k][this.rowPos].occupying !== null){
                                pathClear = false;
                                break;
                            }
                            if(i-k < 3) { /*king only moves up to 2 spaces*/
                                let copiedBoard: Square[][] = _.cloneDeep(boardState) /*Check if King's movement through the spaces is dangerous*/
                                copiedBoard[this.colPos][this.rowPos].moveTo(k, this.rowPos, copiedBoard);
                                if (lookForCheck(copiedBoard, this.isBlack) !== Teams.NONE) {
                                    pathClear = false;
                                    break;
                                }
                            }
                            k--;
                        }
                        if(this.colPos + 2 > boardState.length-1){ /*If King starts less than two spaces from the edge*/
                            kingFinalPos = boardState.length-1
                        }
                        else{
                            kingFinalPos = this.colPos + 2
                        }
                        if(pathClear){
                            kingCastleDictionary[coordToKey([i,this.rowPos])] = [[kingFinalPos,this.rowPos]] /*Dictionary: [rook pos]: [king pos]*/
                        }
                    }
                }
            }
        }
    return kingCastleDictionary
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
        super(2, isBlack, isBlack ? '/pieces/eoach_black.png' : '/pieces/roach_white.png', colPos, rowPos);
        let tempMarch = new MarchForward(1,1);
        tempMarch.moveMatrix = (isBlack? [[0,1]] : [[0,-1]])
        this.movementBehaviours.push(tempMarch);
        this.captureBehaviours.push(new PawnCapture(this.isBlack));
        this.hasDeathTrigger = true;
        this.canPromote = true;
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
export class Berolina extends Piece{
    constructor(isBlack:boolean,colPos:number,rowPos:number) {
        super(1,isBlack, isBlack ? '/pieces/berolina_black.png' : '/pieces/berolina_white.png', colPos, rowPos );
        this.canPromote = true
        let tempMarch = new MarchForward(1,2);
        tempMarch.moveMatrix = (isBlack? [[1,1],[-1,1]] : [[-1,-1],[1,-1]])
        this.movementBehaviours.push(tempMarch);
        let tempCapture = new SlidingOrtho(1)
        tempCapture.moveMatrix = (isBlack? [[0,1]] : [[0,-1]])
        this.captureBehaviours.push(tempCapture);
    }
}
export class EmpoweredBishop extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/empoweredbishop_black.png' : '/pieces/empoweredbishop_white.png', colPos, rowPos);
        this.movementBehaviours.push(new SlidingDiag(16));
        this.captureBehaviours.push(new SlidingDiag(16));
        this.movementBehaviours.push(new LeapingHippo(1,2));
        this.captureBehaviours.push(new LeapingHippo(1,2));
        this.movementBehaviours.push(new SlidingOrtho(16));
        this.captureBehaviours.push(new SlidingOrtho(16));
        this.attributeTags.push("empowered")
    }
    inflictStatus(boardState:Square[][]): void {
        let adjacentSquares = [[-1,-1],[-1,0],[-1,1],
            [0,-1], [0,1],
            [1,-1], [1,0], [1,1]]
        for (const direction of adjacentSquares) {
            if(this.colPos + direction[0] >= 0 && this.colPos + direction[0] <= boardState.length-1 &&
                this.rowPos + direction[1] >= 0 && this.rowPos + direction[1] <= boardState[this.colPos].length-1){
                if(boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying != null){
                    if (boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.attributeTags.includes("empowered") &&
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.isBlack == this.isBlack) {
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.statusTags.push("empower_bishop")
                    }
                }
            }
        }
    }
    getMoves(boardState: Square[][]):number[][]{
        let legalMoves: number[][] = [];
        if(this.statusTags.includes("empower_rook")){
            legalMoves = legalMoves.concat(this.movementBehaviours[2].getMoves(boardState,this));
        }
        if(this.statusTags.includes("empower_knight")){
            legalMoves = legalMoves.concat(this.movementBehaviours[1].getMoves(boardState,this));
        }
        legalMoves = legalMoves.concat(this.movementBehaviours[0].getMoves(boardState,this));
        return(legalMoves);
    }
    getCaptures(boardState: Square[][]):number[][]{
        let legalCaptures: number[][] = [];
        if(this.statusTags.includes("empower_rook")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[2].getCaptures(boardState,this));
        }
        if(this.statusTags.includes("empower_knight")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[1].getCaptures(boardState,this));
        }
        legalCaptures = legalCaptures.concat(this.captureBehaviours[0].getCaptures(boardState,this));
        return(legalCaptures);
    }
}
export class EmpoweredKnight extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(3, isBlack, isBlack ? '/pieces/empoweredknight_black.png' : '/pieces/empoweredknight_white.png', colPos, rowPos);
        this.movementBehaviours.push(new SlidingDiag(16));
        this.captureBehaviours.push(new SlidingDiag(16));
        this.movementBehaviours.push(new LeapingHippo(1,2));
        this.captureBehaviours.push(new LeapingHippo(1,2));
        this.movementBehaviours.push(new SlidingOrtho(16));
        this.captureBehaviours.push(new SlidingOrtho(16));
        this.attributeTags.push("empowered")
    }
    inflictStatus(boardState:Square[][]): void {
        let adjacentSquares = [[-1,-1],[-1,0],[-1,1],
            [0,-1], [0,1],
            [1,-1], [1,0], [1,1]]
        for (const direction of adjacentSquares) {
            if(this.colPos + direction[0] >= 0 && this.colPos + direction[0] <= boardState.length-1 &&
                this.rowPos + direction[1] >= 0 && this.rowPos + direction[1] <= boardState[this.colPos].length-1){
                if(boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying != null){
                    if (boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.attributeTags.includes("empowered") &&
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.isBlack == this.isBlack) {
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.statusTags.push("empower_knight")
                    }
                }
            }
        }
    }
    getMoves(boardState: Square[][]):number[][]{
        let legalMoves: number[][] = [];
        if(this.statusTags.includes("empower_bishop")){
            legalMoves = legalMoves.concat(this.movementBehaviours[0].getMoves(boardState,this));
        }
        if(this.statusTags.includes("empower_rook")){
            legalMoves = legalMoves.concat(this.movementBehaviours[2].getMoves(boardState,this));
        }
        legalMoves = legalMoves.concat(this.movementBehaviours[1].getMoves(boardState,this));
        return(legalMoves);
    }
    getCaptures(boardState: Square[][]):number[][]{
        let legalCaptures: number[][] = [];
        if(this.statusTags.includes("empower_bishop")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[0].getCaptures(boardState,this));
        }
        if(this.statusTags.includes("empower_rook")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[2].getCaptures(boardState,this));
        }
        legalCaptures = legalCaptures.concat(this.captureBehaviours[1].getCaptures(boardState,this));
        return(legalCaptures);
    }
}
export class EmpoweredRook extends Piece{
    constructor(isBlack:boolean, colPos: number, rowPos: number) {
        super(5, isBlack, isBlack ? '/pieces/empoweredrook_black.png' : '/pieces/empoweredrook_white.png', colPos, rowPos);
        this.canCastle = true;
        this.movementBehaviours.push(new SlidingDiag(16));
        this.captureBehaviours.push(new SlidingDiag(16));
        this.movementBehaviours.push(new LeapingHippo(1,2));
        this.captureBehaviours.push(new LeapingHippo(1,2));
        this.movementBehaviours.push(new SlidingOrtho(16));
        this.captureBehaviours.push(new SlidingOrtho(16));
        this.attributeTags.push("empowered")
    }
    inflictStatus(boardState:Square[][]): void {
        let adjacentSquares = [[-1,-1],[-1,0],[-1,1],
                                          [0,-1], [0,1],
                                          [1,-1], [1,0], [1,1]]
        for (const direction of adjacentSquares) {
            if(this.colPos + direction[0] >= 0 && this.colPos + direction[0] <= boardState.length-1 &&
                this.rowPos + direction[1] >= 0 && this.rowPos + direction[1] <= boardState[this.colPos].length-1){
                if(boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying != null){
                    if (boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.attributeTags.includes("empowered") &&
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.isBlack == this.isBlack) {
                        boardState[this.colPos + direction[0]][this.rowPos +direction[1]].occupying!.statusTags.push("empower_rook")
                    }
                }
            }
        }
    }
    getMoves(boardState: Square[][]):number[][]{
        let legalMoves: number[][] = [];
        if(this.statusTags.includes("empower_bishop")){
            legalMoves = legalMoves.concat(this.movementBehaviours[0].getMoves(boardState,this));
        }
        if(this.statusTags.includes("empower_knight")){
            legalMoves = legalMoves.concat(this.movementBehaviours[1].getMoves(boardState,this));
        }
        legalMoves = legalMoves.concat(this.movementBehaviours[2].getMoves(boardState,this));
        return(legalMoves);
    }
    getCaptures(boardState: Square[][]):number[][]{
        let legalCaptures: number[][] = [];
        if(this.statusTags.includes("empower_bishop")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[0].getCaptures(boardState,this));
        }
        if(this.statusTags.includes("empower_knight")){
            legalCaptures = legalCaptures.concat(this.captureBehaviours[1].getCaptures(boardState,this));
        }
        legalCaptures = legalCaptures.concat(this.captureBehaviours[2].getCaptures(boardState,this));
        return(legalCaptures);
    }
}

export function newPieceFromName(name:string,teamIsBlack:boolean):Piece{
    if(name == "Pawn"){
        return(new Pawn(teamIsBlack,-1,-1));
    }
    else if(name =="Roach") {
        return (new Roach(teamIsBlack, -1, -1));
    }
    else if(name == "Berolina"){
        return (new Berolina(teamIsBlack,-1,-1))
    }
    else if(name =="Bishop"){
        return(new Bishop(teamIsBlack,-1,-1))
    }
    else if (name == "Knight"){
        return(new Knight(teamIsBlack,-1,-1))
    }
    else if (name == "Mann"){
        return(new Mann(teamIsBlack,-1,-1))
    }
    else if (name == "Cannon"){
        return(new Cannon(teamIsBlack,-1,-1))
    }
    else if (name == "Rook"){
        return(new Rook(teamIsBlack,-1,-1))
    }
    else if (name == "Unicorn"){
        return(new Unicorn(teamIsBlack,-1,-1))
    }
    else if (name == "Queen"){
        return(new Queen(teamIsBlack,-1,-1))
    }
    else if (name =="EmpoweredBishop"){
        return(new EmpoweredBishop(teamIsBlack,-1,-1))
    }
    else if (name =="EmpoweredKnight"){
        return(new EmpoweredKnight(teamIsBlack,-1,-1))
    }
    else if (name =="EmpoweredRook"){
        return(new EmpoweredRook(teamIsBlack,-1,-1))
    }
    else if (name == "King"){
        return(new King(teamIsBlack,-1,-1))
    }
    else return(new Pawn(teamIsBlack,-1,-1))

}