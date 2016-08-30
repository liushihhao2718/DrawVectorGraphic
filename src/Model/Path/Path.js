import Point from '../Point.js';
import {LineCommand, CurveCommand, Command} from './Command.js';

export default class Path {
	//commandString: Line or Curve
	constructor(p1, p2, commandString){
		if (!(p1 instanceof Point)
			|| !(p2 instanceof Point)
			|| !(typeof commandString === 'string')) {
			console.error('Path init error');
		}

		this.points = [p1, p2];
		this.commands = [this.makeCommand(commandString)];
	}

	makeCommand(commandString){
		if (commandString === 'Line') return new LineCommand();
		else if(commandString === 'Curve') return new CurveCommand();
	}
}