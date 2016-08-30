import Point from '../Point.js';

export class Command {
	constructor(){

	}
}

export class CurveCommand extends Command{
	constructor(p1, p2){
		if (!(p1 instanceof Point) ||  !(p2 instanceof Point)) {
			console.error('CurveCommand init error');
		}
		super();
		this.p1 = p1;
		this.p2 = p2;
	}
}

export class LineCommand extends Command{
	
}
