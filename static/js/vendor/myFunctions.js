var myFunctions = {
	cleanStrings: function(string) {
			return string.replace(/(^\-+|[^a-zA-Z0-9\/_| -]+|\-+$)/g, '').toLowerCase().replace(/[\/_| -]+/g, '-');
    },
    getOneEl: function(el){
		return document.querySelector(el);
	},
	getAllEl: function (el){
		return document.querySelectorAll(el);
	},
	execute: function(){
		var attribute = this.getAttribute("id");
		console.log(attribute);
		switch(attribute){
			case "loginButton":
				ocdWebApp.User.login();
				break;
			case "registreerButton":
				ocdWebApp.User.signUp();
				break;
			case "logoutButton":
				ocdWebApp.User.logout();
				break;
			case "newExerciseButton":
				ocdWebApp.Exercise.create();
				break;
			case "finishExerciseButton":
				SHOTGUN.fire("finishExercise");
				break;
			case "searchDoctorButton":
				ocdWebApp.Doctor.get('search');
				break;
			case "inviteDoctorButton":
				ocdWebApp.Doctor.set();
				break;
			case "removeDoctorButton":
				ocdWebApp.Doctor.remove();
				break;
		}
	},
	AddClickEvent: function(el){
		var clickElement =  myFunctions.getAllEl(el);
		for(var i=0;i<clickElement.length;i++){
        	clickElement[i].addEventListener("click",  myFunctions.execute, false);
    	}
	},
	showSliderVal: function(slider, output){
		var sliderInput = myFunctions.getOneEl(slider);	
		var sliderOutput = myFunctions.getOneEl(output);
		var selected = false;

		sliderInput.onmousedown = function (e){
			selected = true;				
		}

		sliderInput.onmouseup = sliderInput.onmouseout;

		sliderInput.onmouseout = function () {
			selected = false;
			console.log("out");
		}

		sliderInput.onmousemove = function(e){
			if (selected == false) return;
			posX 						= e.clientX;
    		posY 						= e.clientY;
    		sliderOutput.style.position = 'absolute';
    		sliderOutput.style.top 		= ''+posY+'px';
    		sliderOutput.style.left 	= ''+posX+'px';
		}
		
    	sliderInput.oninput  = function () {
			sliderOutput.innerHTML = sliderInput.value;
		}	
	},
	disableLoader: function() {		
		var loaderIcons = myFunctions.getAllEl(".loaderIcon");
		_.each(loaderIcons, function (loaderIcon) {
			loaderIcon.style.display = "none";
		})				
	}	

};	