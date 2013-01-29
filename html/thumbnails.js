var thumbcnvs = [];
var thumbframe;
var mode, selected=0;
var tl;

/////////////////////////
//
// Thumbnails
//
/////////////////////////

function thumbsInit(){
	tl = {x0: 20, y0: 100, xd: 200, yd: 200, xn: 5};
	thumbframe.style.width = '1024px';
	thumbframe.style.height = '748px';
	newThumbCanvases();
	select(0);
}


function newThumbCanvases(){
	var x, y=tl.y0;
	for(i=0;i<15;i++){
		if((i%tl.xn)==0) x=tl.x0;
		var cnv = newThumbCanvas(x, y);
		var pos = gallery[i];
		drawThumb(cnv, pos);
		thumbframe.appendChild(cnv);
		thumbcnvs.push(cnv);
		x+=tl.xd;		
		if((i%tl.xn)==(tl.xn-1)) y+=tl.yd;
	}
}

function newThumbCanvas(x, y){
	var cnv = document.createElement('canvas');
	cnv.style.position = 'absolute'
	cnv.style.width = 176+'px';
	cnv.style.height = 147+'px';
	cnv.style.left = x+'px';
	cnv.style.top = y+'px';
	cnv.width = 176;
	cnv.height = 147;
	return cnv;
}

function drawThumb(cnv, pos){
	var ctx = cnv.getContext('2d');
	ctx.save();
	ctx.fillStyle = 'lightblue';
	ctx.scale(176/720, 176/720);
	ctx.strokeStyle = '#404040'; 
	ctx.lineWidth = 1;
	for(var i=0;i<shapes.length;i++){
		ctx.fillStyle= fromColorLetter(pos[i]);;
		shapePath(i, ctx);
		ctx.fill();
	}
	for(var i=0;i<shapes.length;i++){
		shapePath(i, ctx);
		ctx.stroke();
	}
	ctx.restore();
}


/////////////////////////
//
// Events
//
/////////////////////////

function handleThumbStart(x, y){
	var n = Math.floor((y-tl.y0)/tl.yd)*tl.xn+Math.floor((x-tl.x0)/tl.xd);
	if((n<0)||(n>=15)) return;
	select(n); 
	editMode();
}

function handleRotate(e){
	var o = window.orientation;
	if((o==90)||(o==-90)) {
		frame.style.width = '1024px';
		frame.style.height = '748px';
		editMode();
	} else {
		frame.style.width = '768px';
		frame.style.height = '1004px';
		selectorMode();
	}
}

function editMode(){
	mode = 'edit';
	thumbframe.style.visibility = 'hidden';
	onStart = handleStart;
	loadPos(selected);
	changed = false;
}

function selectorMode(){
	mode = 'selector';
	thumbframe.style.visibility = 'visible';
	onStart = handleThumbStart;
	if(changed) savePos(selected);
}


function select(n){
	thumbcnvs[selected].style.border = '0px';
	thumbcnvs[n].style.border = '3px solid black'; 
	selected=n;
}

/////////////////////////
//
// Persistance
//
/////////////////////////

function loadPos(n){
	var pos = gallery[n];
	for(var i=0;i<colors.length;i++) colors[i]= fromColorLetter(pos[i]);
	for(var i=0;i<shapes.length;i++) fillPiece(i);
	for(var i=0;i<shapes.length;i++) strokePiece(i);
}

function savePos(n){
	var pos = posString();
	drawThumb(thumbcnvs[n], pos);
	gallery[n] = pos;
	saveGallery();
}

function storedPos(n){
	var pos = '';
	for(var i=0;i<colors.length;i++) pos+='w';
	return pos;
}

function posString(){
	var res = '';
	for(var i=0;i<colors.length;i++) res+=toColorLetter(colors[i]);
	return res;
}

function timestamp(){
	return Math.floor(Date.now()/1000);
}

function fromColorLetter(c){return cnames[cletters.indexOf(c)];}
function toColorLetter(c){return cletters[cnames.indexOf(c)];}

