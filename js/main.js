var editor = null;
var selection = null; 

/*
window.onerror = function(msg, url, linenumber) {
	return true;
}
*/
function StartEditor(){ 
	editor = new Editor(22,12); 
}

function Editor(areaW, areaH){  
	//working area
	this.areaW = areaW;
	this.areaH = areaH;
	
	this.cellSize = 32;
	this.spacing = 2;
	
	this.SetSize = function(){
		this.div = document.getElementById("EditorDiv");
		this.div.style.width = ((window.innerWidth)/4*3 - 8) + "px";
		this.div.style.height = (window.innerHeight-5 - 8) + "px";
		this.div.style.cursor = "copy";  
	}
	this.SetSize();
	
	 
	this.canvas = document.getElementById("EditorCanvas");
	
	this.ResizeCanvas = function(){
		this.canvas.setAttribute("width",this.areaW * this.cellSize);
		this.canvas.setAttribute("height",this.areaH * this.cellSize);
	}
	
	this.ResizeCanvas();
	
	
	this.canvas.addEventListener('contextmenu', function (event) {
		event.preventDefault();
	});  
	this.canvas.addEventListener("mousedown", function(e){
		if(e.which == 1){
			editor.mouseLeft = true;
			if(selection.selected != null)
				editor.placeBlock();
		}
		else if(e.which == 3){  
			editor.mouseRight = true;
			editor.removeBlock();
		}
		
	});
	
	this.ctx = this.canvas.getContext("2d");
	
	// views
	this.viewX = 0;
	this.viewY = 0;
	//mouse
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseLeft = false;
	this.mouseRight = false;
	
	this.drawGrid = true;
	this.drawTiles = true;
	this.drawBlocks = true;
	this.drawObjects = true;
	
	this.mode = 0;
	document.getElementById("mode").onchange = function(){
		editor.mode = this.selectedIndex;
		if(this.selectedIndex == 2){
			document.getElementById("newObject").style.visibility = "visible";
		}else{
			document.getElementById("newObject").style.visibility = "hidden";
		}
	};
	document.getElementById("export").onclick = function(){editor.Export();};
	document.getElementById("loadMap").onclick = function(){editor.LoadMap();};
	
	document.getElementById("newMap").onclick = function(){
		var w = prompt("Area Width",null);
		if (w != null){
			var h = prompt("Area Height",null);
			if (h != null){
				w = parseInt(w);
				h = parseInt(h);
				if(w*editor.cellSize < 4000 && h*editor.cellSize < 4000){
					editor = null;
					editor = new Editor(w,h); 
				}
				else{
					alert(w + " x "+ h +" is too big");
				}
			}
		}
	};
	
	this.Export = function(){
		var n = parseInt(prompt("Level Number",1));
		var output = "levels["+n+"] = [";
		
		//settings
		
		output += "[" +
		this.cellSize + "," +
		this.spacing + "," +
		this.areaW + "," +
		this.areaH ;
		
		output += "],";
		
		//tiles
		output += "[";
		for(var i = 0; i < this.tiles.length; i ++){
			output += "[" +
			this.tiles[i][4]+ "," +
			this.tiles[i][0]/this.cellSize + "," +
			this.tiles[i][1]/this.cellSize + "]";
			if(i < this.tiles.length -1)
				output += ","
		}
		output += "],";
		
		//collision
		output += "[";
		for(var i = 0; i < this.blocks.length; i ++){
			output += "[" +
			this.blocks[i][0]/this.cellSize + "," +
			this.blocks[i][1]/this.cellSize + "]";
			if(i < this.blocks.length -1)
				output += ","
		}
		output += "],";
		
		//objects
		output += "[";
		for(var i = 0; i < this.objects.length; i ++){
			output += "[" +
			this.objects[i][0]/this.cellSize + "," +
			this.objects[i][1]/this.cellSize + "," +
			'"'+this.objects[i][2] + '"'+ "]";
			if(i < this.objects.length -1)
				output += ","
		}
		output += "]";
		
		
		output += "];"; 
		document.getElementById("output").value = output;
	}
	
	
	
	this.LoadMap = function(){ 
		var levels = [];
		eval(document.getElementById("output").value);
		if(levels.length == 0){
			alert("Error: Unable to find levels[n]");
			return null;
		} 
		lev = levels.length-1;
		//carico le info sul livello
		var settings = levels[lev][0];
		this.cellSize = settings[0];
		this.spacing = settings[1];
		this.areaW = settings[2];
		this.areaH = settings[3];
		this.ResizeCanvas();
		//dati sui tiles
		var tiles = levels[lev][1];
		var cs = this.cellSize + this.spacing; 
		var cellsX = Math.ceil(selection.image.width / cs);
		var cellsY = Math.ceil(selection.image.height / cs);
		 
		for(var i = 0; i < tiles.length; i++){
			var t = tiles[i];
			var cy = Math.floor(t[0] / cellsX);
			var cx = t[0] - cy*cellsX;
			this.tiles.push([t[1]*this.cellSize, t[2]*this.cellSize, cx*cs, cy*cs,t[0]]);
		}
		
		//dati sui blocchi di collisione
		var blocks = levels[lev][2];
		for(var i = 0; i < blocks.length; i++){
			this.blocks.push([blocks[i][0]*this.cellSize, blocks[i][1]*this.cellSize,this.cellSize,this.cellSize]); 
		}
		
		
		//dati sugli oggetti
		var objects = levels[lev][3];
		for(var i = 0; i < objects.length; i++){
			this.objects.push([objects[i][0]*this.cellSize, objects[i][1]*this.cellSize, objects[i][2]]);			
		}
		
		
		editor.Draw();
	}
	
	
	document.getElementById("cellSize").onchange = function(){
		editor.cellSize = parseInt(this.value);
		editor.Draw();
		selection.Draw();
	};
	document.getElementById("grid_t").onchange = function(){
		editor.drawGrid = this.checked;
		editor.Draw();
	}; 
	document.getElementById("tiles_t").onchange = function(){
		editor.drawTiles = this.checked;
		editor.Draw();
	}; 
	document.getElementById("blocks_t").onchange = function(){
		editor.drawBlocks = this.checked;
		editor.Draw();
	}; 
	document.getElementById("objects_t").onchange = function(){
		editor.drawObjects = this.checked;
		editor.Draw();
	};
	
	document.getElementById("spacing").onchange = function(){
		editor.spacing = parseInt(this.value);
		editor.Draw();
		selection.Draw();
	};
	
	document.getElementById("newObject").onclick = function(){
		editor.objectId = null;
	}
	
	//image file
	var finput = document.getElementById("loadFile");
	finput.onchange = function(){
		var file = this.files[0];
		var fr = new FileReader();
		fr.onload = function(){
			selection.image = new Image();
			selection.image.src = this.result;
			selection.Draw();
		};
		fr.readAsDataURL(file);
	} 
	
	this.tiles = [];
	this.blocks = [];
	this.objects = [];
	this.objectId = null; //current objecty
	
	this.placeBlock = function(){ 
		
		var px = Math.floor(this.mouseX /this.cellSize )*this.cellSize; 
		var py = Math.floor(this.mouseY /this.cellSize )*this.cellSize;
		
		var buffer;
		switch(this.mode){
			case 0: buffer = this.tiles; break;
			case 1: buffer = this.blocks; break;
			case 2: buffer = this.objects; break;
		}
		var found = -1;
		for(var i = 0; i < buffer.length; i ++){ 
			if(buffer[i][0] == px && buffer[i][1] == py){
				found = i;
				break;
			}
		}
		if(found < 0){
			switch(this.mode){
			case 0: 
				var tile = [px,py,selection.selectedX,selection.selectedY,selection.selected]; 
				buffer.push(tile);
				break;
			case 1:
				var block = [px,py,this.cellSize,this.cellSize]; 
				buffer.push(block);	
				break;
			case 2:
				var val = (this.objectId != null) ? this.objectId : prompt("ID",null);
				if (val!=null){
					var obj = [px,py,val]; 
					buffer.push(obj);
					this.objectId  = val;
				}
				this.mouseLeft = false;
				
				break;
			}
			this.Draw();
		}
	}
	
	this.removeBlock = function(){ 
		var px = Math.floor(this.mouseX /this.cellSize )*this.cellSize; 
		var py = Math.floor(this.mouseY /this.cellSize )*this.cellSize; 
		
		var buffer;
		switch(this.mode){
			case 0: buffer = this.tiles; break;
			case 1: buffer = this.blocks; break;
			case 2: buffer = this.objects; break;
		}
		 
		for(var i = 0; i < buffer.length; i ++){ 
			if(buffer[i][0] == px && buffer[i][1] == py){
				buffer.splice(i,1); 
				break;
			}
		} 
		this.Draw();	
	}
	
	//Load Resources
	rh = new ResourcesHandler( function(){
		this.loaded = true;
	});
	 
	///Sprites
	//Player  
	this.imgTiles = rh.LoadImage("res/tiles.png", function(){
		selection = new SelectionFrame(editor.imgTiles);
	}); 
	
	//menu
	this.sprLogo = rh.LoadImage("res/logo.png");  
 
	 
	
	this.textHover = function(str, x, y, col1, col2){
		var w = editor.ctx.measureText(str).width;
		var h = 30; 
		var inside = (inputs.mouseX > x - w/2  && inputs.mouseY > y - h && inputs.mouseX < x + w/2  && inputs.mouseY < y );
		if(inside)
			editor.ctx.fillStyle = col2;
		else
			editor.ctx.fillStyle = col1;
		editor.ctx.fillText(str, x, y);
		return inside;
	};
	
	this.Draw = function(){ 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		
		var w = this.areaW * this.cellSize;
		var h = this.areaH * this.cellSize;
		var cs = this.cellSize;
		
		//tiles
		if(this.drawTiles){
			for(var i = 0; i < this.tiles.length; i ++){ 
				this.ctx.drawImage(selection.image,
					this.tiles[i][2], this.tiles[i][3],
					cs, cs,
					this.tiles[i][0], this.tiles[i][1],
					cs, cs); 
			}
		}
		
		
		//grid
		if(this.drawGrid){
			this.ctx.strokeStyle = "rgba(0,0,0,0.14)";
			this.ctx.beginPath();
			for(var x = 0; x <= w; x += this.cellSize){
				this.ctx.moveTo(x-0.5, 0);
				this.ctx.lineTo(x-0.5, h);
			}  
			for(var y = 0; y <= h; y += this.cellSize){ 
				this.ctx.moveTo(0, y-0.5);
				this.ctx.lineTo(w, y-0.5); 
			} 
			this.ctx.closePath();
			this.ctx.stroke();
		}
		 
		//collision blocks
		if(this.drawBlocks){
			this.ctx.strokeStyle = "#c00";
			for(var i = 0; i < this.blocks.length; i ++){ 
				this.ctx.strokeRect(this.blocks[i][0]-0.5, this.blocks[i][1]-0.5,this.blocks[i][2], this.blocks[i][3]); 
			}
			this.ctx.strokeStyle = "#000";
		}
		
		//objects
		if(this.drawObjects){
			this.ctx.strokeStyle = "#00c";
			var cs2 = cs/2;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			for(var i = 0; i < this.objects.length; i ++){ 
				this.ctx.beginPath();
				this.ctx.arc(this.objects[i][0]+cs2-0.5, this.objects[i][1]+cs2-0.5, cs2-1, 0, 2 * Math.PI);  
				this.ctx.stroke();
				this.ctx.fillText(this.objects[i][2].substr(0,4),this.objects[i][0]+cs2 , this.objects[i][1]+cs2 )
			} 
			this.ctx.strokeStyle = "#000";
		}
	}
	
	this.Draw();
	
	
	
	this.ResetEditor = function(){ 
		this.blocks = []; 
	}

}
 

function SelectionFrame(image){
	this.image = image;
	this.backColor = "#fff";
	this.mouseX = 0;
	this.mouseY = 0;
	
	this.SetSize = function(){
		this.width = (window.innerWidth-5)/4 ;
		this.div = document.getElementById("SelectionDiv");
		this.div.style.width = this.width + "px";
		this.div.style.height = window.innerHeight/5*3+"px" 
		this.div.style.left = window.innerWidth - this.width - 6 +"px" 
		this.div.style.cursor = "pointer";  
		
		
		this.divOpt = document.getElementById("Options");
		this.divOpt.style.padding = "5px";
		this.divOpt.style.width = this.width -10 + "px";
		this.divOpt.style.height = window.innerHeight/5*2 -26+"px"; 
		this.divOpt.style.top = (window.innerHeight/5*3 + 3)+"px";
		this.divOpt.style.left = window.innerWidth - this.width - 6 +"px" 
	}
	
	this.SetSize();
	
	
	this.cellsX = Math.ceil(this.image.width / (editor.cellSize + editor.spacing));
	this.cellsY = Math.ceil(this.image.height / (editor.cellSize + editor.spacing));
	
	
	this.canvas = document.getElementById("SelectionCanvas");
	this.canvas.setAttribute("width",this.image.width+2);
	this.canvas.setAttribute("height",this.image.height+2);
	this.canvas.onclick = function(){
		var cs = editor.cellSize+editor.spacing; 
		var px = Math.floor(selection.mouseX /cs ); 
		var py = Math.floor(selection.mouseY /cs ); 
		selection.selected = py*selection.cellsX + px;
		selection.selectedX = px*cs;
		selection.selectedY = py*cs;
		selection.Draw();
		
		
	};
	this.ctx = this.canvas.getContext("2d");
	
	
	
	this.selected = 0;
	this.selectedX = 0;
	this.selectedY = 0;
	
	
	
	this.Draw = function(){
		this.ctx.fillStyle = this.backColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		
		this.ctx.drawImage(this.image,0,0);
		
		var cellsize = editor.cellSize + editor.spacing 
		this.ctx.beginPath();
		for(var x = 0; x <= this.image.width; x += cellsize){
			this.ctx.moveTo(x-0.5, 0);
			this.ctx.lineTo(x-0.5, this.image.height);
			if(editor.spacing > 1){ 
				this.ctx.moveTo(x-0.5 - editor.spacing+1, 0);
				this.ctx.lineTo(x-0.5 - editor.spacing+1, this.image.height);
			}
		}
		
		for(var y = 0; y <= this.image.height; y += cellsize){ 
			this.ctx.moveTo(0, y-0.5);
			this.ctx.lineTo(this.image.width, y-0.5); 
			if(editor.spacing > 1){ 
				this.ctx.moveTo(0, y-0.5- editor.spacing+1);
				this.ctx.lineTo(this.image.width, y-0.5- editor.spacing+1);  
			}
		}
		
		this.ctx.closePath();
		this.ctx.stroke();
		
		if(this.selected != null){ 
			this.ctx.strokeStyle="#fc0";
			this.ctx.strokeRect(this.selectedX-0.5,this.selectedY-0.5,editor.cellSize+1,editor.cellSize+1);
			this.ctx.strokeStyle="#000";
		}
		
	}
	this.Draw();

}

window.addEventListener("mousemove", function(s) {
	editor.mouseX = Math.round(s.pageX - editor.ctx.canvas.offsetLeft + editor.div.scrollLeft);
	editor.mouseY = Math.round(s.pageY - editor.ctx.canvas.offsetTop + editor.div.scrollTop);
	if(editor.mouseLeft){
		if(selection.selected != null)
				editor.placeBlock();
	}
	else if(editor.mouseRight){ 
		editor.removeBlock();
	}

	selection.mouseX = Math.round(s.pageX - selection.ctx.canvas.offsetParent.offsetLeft + selection.div.scrollLeft);
	selection.mouseY = Math.round(s.pageY - selection.ctx.canvas.offsetParent.offsetTop + selection.div.scrollTop );
}, false);

window.addEventListener("mousedown", function(e) { 
	switch (e.which) {
	case 1: 
		break; 
	case 3:  
		break;
	}
}, false);


window.addEventListener("mouseup", function(e) { 
	switch (e.which) {
	case 1: 
		editor.mouseLeft = false; 
		break; 
	case 3:  
		editor.mouseRight = false;
		break;
	}
}, false);
