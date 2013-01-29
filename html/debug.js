window.onerror=sendError;

function sendError(e,u,l){
	var  f = (u.split('/')).pop();
	debug(f+":"+l+' '+e);
}

function debug(){
	var len = arguments.length;
	var res = '';
	for(var i=0;i<len-1;i++) res = res+arguments[i]+' ';
	res+=arguments[len-1];
	sendString(res);
}

function sendString(str){
	str = str+'';
	var request = new XMLHttpRequest();
	request.open('PUT', '/debug', true);
	request.setRequestHeader("Content-Type", 'text/plain');
	request.send(str+'');
}

