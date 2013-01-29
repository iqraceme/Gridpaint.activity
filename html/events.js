var onStart, onMove, onEnd;
var zoom;

function eventInit(){
	window.onmousedown = evMousedown;	
	frame.onmousemove = evMousemove;	
	frame.onmouseup = evMouseup;	
	zoom = 1.10;
	selectorMode();
	document.body.style.zoom = zoom;
}

function evMousedown(e){
	e.preventDefault(); 
	var x=localx(e.clientX), y=localy(e.clientY);
	onStart(x,y);
}


function evMousemove(e){
	e.preventDefault(); 
	if(!onMove) return;
	var x=localx(e.clientX), y=localy(e.clientY);
	onMove(x,y);
}

function evMouseup(e){
	e.preventDefault(); 
	if(!onEnd) return;
	onEnd();
}

function localx(gx){return (gx/zoom-frame.getBoundingClientRect().left);}
function localy(gy){return (gy/zoom-frame.getBoundingClientRect().top);}

