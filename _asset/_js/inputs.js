//costanti riguardanti gli inputs
MOUSE_LEFT = 1;
MOUSE_RIGHT = 3;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_UP = 38;
KEY_DOWN = 40;
KEY_ENTER = 13;
KEY_ESC = 27;
KEY_CTRL = 17;
KEY_SPACE = 32;

// oggetto che gestisce gli input
Inputs = function(){
	//inputs
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseLeft = false;
	this.mouseLeftPress = false;
	this.mouseLeftRel = false;
	
	this.mouseRight = false;
	this.mouseRightPress = false;
	this.mouseRightRel = false;
	
	this.key = [];
	this.keyPress = [];
	this.keyRel= [];
	
	
	window.addEventListener('keydown', function(e) {
		inputs.keyPress[e.keyCode] = true;
		inputs.key[e.keyCode] = true; 
	}, false);

	window.addEventListener('keyup', function(e) {
		inputs.keyRel[e.keyCode] = true;
		inputs.key[e.keyCode] = false; 
	}, false);

	window.addEventListener("mousemove", function(s) {
		inputs.mouseMoved = true;
		inputs.mouseX = Math.round(s.pageX - game.ctx.canvas.offsetLeft );
		inputs.mouseY = Math.round(s.pageY - game.ctx.canvas.offsetTop );
	}, false);

	
	
	window.addEventListener("mouseup", function(d) { 
		switch (d.which) {
		case 1: 
			inputs.mouseLeft = false;
			inputs.mouseLeftRel = true;
			break; 
		case 3: 
			inputs.mouseRight = false;
			inputs.mouseRightRel = true;
			break;
		}
	}, false);
	
	
	window.addEventListener("touchmove", function(s) {
		inputs.mouseX = Math.round(s.pageX - game.ctx.canvas.offsetLeft );
		inputs.mouseY = Math.round(s.pageY - game.ctx.canvas.offsetTop );
	}, false);

	window.addEventListener("touchstart", function(e) { 
		inputs.mouseLeft = true;
		inputs.mouseLeftPress = true;
	}, false);
	
	window.addEventListener("touchend", function() { 
		inputs.mouseLeft = false;
		inputs.mouseLeftRel = true;
	}, false);
	 
	
	
	this.Clear = function(){
		this.mouseLeftPress = false;
		this.mouseLeftRel = false;
		this.mouseMoved = false;
		
		this.mouseRightPress = false;
		this.mouseRightRel = false;
		
		this.keyPress = [];
		this.keyRel= [];
	}
	
	this.GetKeyDown = function(k){
		return (this.key[k] == true);
	}
	
	this.GetKeyPress = function(k){
		return (this.keyPress[k] == true);
	}
	
	this.GetKeyRelease = function(k){
		return (this.keyRel[k] == true);
	}
	
	this.MouseInsideRect = function(x,y,w,h){
		return (this.mouseX >= x && this.mouseX <= x+w && this.mouseY >= y && this.mouseY <= y+h);
	}
	this.GetMouseDown = function(b){
		if(b == 1) return this.mouseLeft;
		if(b == 3) return this.mouseRight;
	}
	
	this.GetMousePressed = function(b){
		if(b == 1) return this.mouseLeftPress;
		if(b == 3) return this.mouseRightPress;
	}
	
	this.GetMouseReleased = function(b){
		if(b == 1) return this.mouseLeftRel;
		if(b == 3) return this.mouseRightRel;
	}

}
