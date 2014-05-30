function ResourcesHandler(callback){
	//numero immagini da caricare/caricate
	this.imgNumber = 0;
	this.imgLoaded = 0;
	this.imgAllLoaded = false;
	
	//numero suoni da caricare/caricati
	this.sndNumber = 0;
	this.sndLoaded = 0;
	this.sndAllLoaded = false;
	
	//funzione da eseguire al completamento di tutti i caricamenti
	this.OnLoad = callback;
	
	//carica un immagine e ritorna un id
	this.LoadImage = function(url, funct){
		var img = new Image();
		img.src = url;
		img.rh = this;
		this.imgNumber++;
		img.onload = function(){ 
			if(funct != undefined){
				funct();
			}
			this.rh.imgLoaded++;
			
			//se il numero di immagini caricate è uguale al numero di immagini richieste
			if(this.rh.imgNumber == this.rh.imgLoaded){ 
				this.rh.imgAllLoaded = true;
				if(this.rh.sndAllLoaded){
					this.rh.OnLoad();
				}
			}
		};
		return img;
	}
	 
	
	//carica un suono
	this.LoadSound = function(url){
		var sound = new Audio();
		sound.src = url;
		sound.volume = 0.05;
		this.sndNumber++;
		sound.rh = this;
		sound.addEventListener("canplaythrough", function(){
			this.rh.sndLoaded++;
			
			//se il numero di suoni caricati è uguale al numero di suoni richiesti
			if(this.rh.sndNumber == this.rh.sndLoaded){ 
				this.rh.sndAllLoaded = true;
				if(this.rh.imgAllLoaded){
					this.rh.OnLoad();
				}
			}
		}, true);
		return sound;
	} 

}