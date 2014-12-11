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
			case "forgotPasswordButton":
				ocdWebApp.User.forgotPassword();
				break;
			case "newExerciseButton":
				ocdWebApp.Exercise.create();
				break;
			case "finishExerciseButton":
				SHOTGUN.fire("finishExercise");
				SHOTGUN.remove("finishExercise");
				break;
			case "searchDoctorButton":
				ocdWebApp.Doctor.get('new');
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
			    	}else if(el.type != "button" && el.type != "select") {			    		
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
	},
	getMonthName: function (month) {
		var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    	return monthNames[month];
	},
	WeekToDate: function (w) {
		var simple = new Date((new Date).getFullYear(), 0, 1 + (w - 1) * 7);
	    var dow = simple.getDay();
	    var ISOweekStart = simple;
	    if (dow <= 4)
	        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
	    else
	        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
	    return ISOweekStart;
	},
	getCurrentWeek: function() {
        var onejan = new Date((new Date).getFullYear(), 0, 1);
        return Math.ceil((((new Date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

};	