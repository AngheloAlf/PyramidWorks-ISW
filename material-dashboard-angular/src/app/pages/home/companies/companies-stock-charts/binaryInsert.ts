export function binaryInsert(value, array, ...limits: number[]| undefined/*startVal: number| undefined, endVal: number| undefined*/){

	let length = array.length;
	let start = typeof(limits[0]) != 'undefined' ? limits[0] : 0;
	let end = typeof(limits[1]) != 'undefined' ? limits[1] : length - 1;//!! endVal could be 0 don't use || syntax
	let m = start + Math.floor((end - start)/2);
	
	if(length == 0){
		array.push(value);
		return;
	}

	if(Date.parse(value) > Date.parse(array[end])){
		array.splice(end + 1, 0, value);
		return;
	}

	if(Date.parse(value) < Date.parse(array[start])){//!!
		array.splice(start, 0, value);
		return;
	}

	if(start >= end){
		return;
	}

	if(Date.parse(value) < Date.parse(array[m])){
		binaryInsert(value, array, start, m - 1);
		return;
	}

	if(Date.parse(value) > Date.parse(array[m])){
		binaryInsert(value, array, m + 1, end);
		return;
	}

	//we don't insert duplicates
}