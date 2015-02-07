// Funzione finestra modale
function runOverlay(content){
		var overlay = document.getElementById('overlay');
		
		content.className += ' active';
		overlay.className += ' active';
	
		overlay.onclick = function(){
			overlay.className = overlay.className.replace(' active', '');
			content.className = content.className.replace(' active', '');
		}
		
		this.closeOverlay = function(){
			overlay.className = overlay.className.replace(' active', '');
			content.className = content.className.replace(' active', '');
			}
	}