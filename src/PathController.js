import Path from './Path';

export default class PathController{
	contreuctor(){
		this.paths = new Map();
	}

	addPath(path){
		if(path) this.paths.set(path.key, path);
	}

	
}