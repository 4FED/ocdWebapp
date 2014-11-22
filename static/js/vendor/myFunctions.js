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
				SHOTGUN.remove("finishExercise");
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
    	sliderInput.oninput  = function () {
			sliderOutput.innerHTML = sliderInput.value;
		}	
	},
	clearForm: function (form) {
		_.each(form.elements, function(el){
			    	if (el.type == "range") {
			    		el.value = 50;
			    	} else if(el.type != "button") {			    		
			    		el.value = null;
			    	}
			    })
	},
	disableLoader: function() {		
		var loaderIcons = myFunctions.getAllEl(".loaderIcon");
		_.each(loaderIcons, function (loaderIcon) {
			loaderIcon.style.display = "none";
		})				
	},
	enableLoader: function () {
		var loaderIcons = myFunctions.getAllEl(".loaderIcon");
		_.each(loaderIcons, function (loaderIcon) {
			loaderIcon.style.display = "block";
		})	
	}	

};	