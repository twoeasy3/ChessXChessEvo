export{};
export class Piece{
    hasMoved: boolean;
    pointValue: number;
    movementBehaviours: MovementBehaviour[]
    captureBehaviours: MovementBehaviour[]
    royalty: boolean;
    constructor(pointValue: number ) {
        this.hasMoved = false;
        this.pointValue = pointValue;
        this.movementBehaviours = [];
        this.captureBehaviours = [];
        this.royalty = false;
    }
    move():void{
        console.log('This is the base move function for a piece');
    }
    capture():void{
        console.log('This is the base capture function for a piece');
    }
}
interface MovementBehaviour{};
class SlidingOrtho implements MovementBehaviour{
    limit:number;
    constructor(limit:number) {
        this.limit = limit;
    }
}

class SlidingDiag implements MovementBehaviour{
    limit:number;
    constructor(limit:number) {
        this.limit = limit;
    }
}
class LeapingHippo implements MovementBehaviour{
    axis1: number;
    axis2: number;
    constructor(axis1:number,axis2:number) {
        this.axis1 = axis1;
        this.axis2 = axis2;
    }
    move():void{
        console.log('Leaping behaviour');
    }
};

