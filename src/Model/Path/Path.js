import {LineCommand, CurveCommand} from './Command.js';
/**
 * 描述貝茲路徑的Model
 */
export default class Path {
	/*
	 * @param {Point} [p1] 端點
	 * @param {Point} [p2] 端點
	 * @param {string} [commandString] 建立Line還是Curve
	 */
	constructor(p1, p2, commandString){
		this.points = [p1, p2];
		this.commands = [this.makeCommand(commandString)];
	}
	appendLineWithPoint(p) {
		this.points.push(p);
		this.commands.push(new LineCommand());
	}
	/**
	 * @curveCommand {Command} p L p => p C p  更換頂點間的Command
	 */
	makeCurveWithCommandAtIndex(curveCommand, index) {
		this.commands[index] = curveCommand;
	}
	/**
	 * @private
	 */
	makeCommand(commandString){
		if (commandString === 'Line') return new LineCommand();
		else if(commandString === 'Curve') return new CurveCommand();
	}
}