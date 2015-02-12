// Modal window function
function runOverlay(content, title){
		var overlay = document.getElementById('overlay');
		var dialogs = document.querySelectorAll('.dialog-box');
		var errBox = content.querySelectorAll('.error')[0];
		
		// Title and alert creation
		if(title != null && content.innerHTML.indexOf('overlay-title') < 0){
			title = '<h2 class="overlay-title">' + title + '</h2>';
			content.innerHTML = title + content.innerHTML;
			}
			
		if(errBox != null){
			errBox.className = errBox.className.replace(' active', '');
			}
		
		// Check for other opened modals
		for(var i= 0; i < dialogs.length; i++){
			dialogs[i].className = dialogs[i].className.replace(' active', '');
			}
			
		if(content.className.indexOf('active') < 0){ content.className += ' active'; }
		if(overlay.className.indexOf('active') < 0){ overlay.className += ' active'; }
	
		// Click on overlay cause the modal to close
		overlay.onclick = function(){
			overlay.className = overlay.className.replace(' active', '');
			content.className = content.className.replace(' active', '');
		}
		
		// Close overlay function
		this.closeOverlay = function(){
			overlay.className = overlay.className.replace(' active', '');
			content.className = content.className.replace(' active', '');
			}
			
		// Detect enter key press
		document.onkeypress = function(e){
			var confirmBtn = content.querySelectorAll('input[type="button"]')[0];
			
			if (e.keyCode == 13 && confirmBtn != null) {
				confirmBtn.click();
			}
		}
	}
			
// Alerts (In modal or inline)
function runAlert(text, inner){
	if(!inner){
		var alertBox = document.getElementById('alert');
		alertBox.innerHTML = '<p>' + text + '</p>';
		runOverlay(alertBox, 'Alert');
		}
	else{	
		var errBox = document.querySelectorAll('.dialog-box.active .error')[0];
		errBox.innerHTML = text;
		if(errBox.className.indexOf('active') < 0){
			errBox.className = errBox.className + ' active';
			}
		}
	}