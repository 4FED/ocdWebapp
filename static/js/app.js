var ocdWebApp = ocdWebApp || {};
window.onload = function (){	
	ocdWebApp.router.init();
	myFunctions.AddClickEvent(".eventButton");
};

(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");


	// Router object
	// sets router parameters
	ocdWebApp.sections = {
		userData: function (el){
			userData = [{profilePicture: Parse.User.current().get("profilePicture"), firstname: Parse.User.current().get("firstname"), surname: Parse.User.current().get("surname")}];
			Transparency.render(myFunctions.getOneEl(el), userData, ocdWebApp.User.directives);
		},
		exercisesSummary: function (weekNumber, old){
			var exercisesData = JSON.parse(sessionStorage.getItem("exercises"));
			
			_.each(exercisesData[old], function (exercise) {
				var elem = myFunctions.getOneEl(".G"+exercise.objectId);
				elem.parentNode.removeChild(elem);
			});

			if (!weekNumber) {
				var weekNumber = myFunctions.getCurrentWeek()
			};

			var weekdata = {
				content: {
					date: "De week van " + myFunctions.WeekToDate(weekNumber).getDate() + " " + myFunctions.getMonthName(myFunctions.WeekToDate(weekNumber).getMonth()),
				},
				directives: {
					previous:{
						onClick: function () { return "ocdWebApp.sections.exercisesSummary(" + (weekNumber - 1) + ", "+ weekNumber +")"; }
					},	
					next: {
						onClick: function () { return "ocdWebApp.sections.exercisesSummary(" + (weekNumber + 1) + ", "+ weekNumber +")"; }
					}
				}
			};

			Transparency.render(document.getElementById("scroller"), weekdata.content, weekdata.directives);
			var exercisesSummary = exercisesData[weekNumber];
			var el = document.getElementById("noResultsExposure");
			
			if (exercisesData[weekNumber] == null) {
				el.classList.add("active");
			} else{
				el.classList.remove("active");
			};

			Transparency.render(myFunctions.getOneEl(".exercisesList"), exercisesSummary, ocdWebApp.Exercise.directives);
			ocdWebApp.Progress.init(exercisesSummary);
		},
		exerciseDetail: function  (id){
			var exercisesData = JSON.parse(sessionStorage.getItem("exercises"));
			var detailExercise = [];
			_.each(exercisesData, function (exercises) {
				_.each(exercises, function (exercise) {
					if(exercise.objectId == id){
						detailExercise.push(exercise);
					}
				})
			});
			
			Transparency.render(myFunctions.getOneEl(".detailExercise"), detailExercise, ocdWebApp.Exercise.directives);
			Transparency.render(myFunctions.getOneEl(".postExposure"), detailExercise, ocdWebApp.Exercise.directives);
			Transparency.render(myFunctions.getOneEl(".duringExercise"), detailExercise, ocdWebApp.Exercise.directives);
		},
		doctorsSummary: function (){			
			Transparency.render(myFunctions.getOneEl(".doctorsSummary"), ocdWebApp.Doctor.content, ocdWebApp.Doctor.directives);
		},
		doctorsResult: function (){
			Transparency.render(myFunctions.getOneEl(".doctorsResultTable"), ocdWebApp.Doctor.content, ocdWebApp.Doctor.directives);
		},
		progress: function() {
			Transparency.render(myFunctions.getOneEl(".progressExercise"), JSON.parse(sessionStorage.getItem("exercises")), ocdWebApp.Exercise.directives);
			ocdWebApp.Progress.init();
		},
		toggle: function (show, hide) {
			var show = myFunctions.getOneEl("." + show);
			var hide =  myFunctions.getAllEl("." + hide);
			for (var i = 0; i < hide.length; i++) {
				hide[i].classList.remove('active');
			};

			show.classList.add('active');				
		} 
	};

	ocdWebApp.router = {
		init: function () {
			myFunctions.disableLoader();
			var reroute = window.location.hash = "#user/login";
			routie({
	    		'user/:type': function (type) {
	    			ocdWebApp.sections.toggle("user", "content");
	    			ocdWebApp.sections.toggle(type, "userForm");
	    			if (type == "login" && Parse.User.current()) {	    				
				    	window.location.hash = "#home";
	    			};
	    		},
	    		home: function() {	
	    			if (Parse.User.current()) {
	    				ocdWebApp.sections.userData(".hoofdmenu");
	    				ocdWebApp.sections.toggle("home", "content");
	    			}else{
	    				reroute;
	    			};
	    		},
	    		profiel: function () {
	    			if (Parse.User.current()) {
	    				ocdWebApp.sections.userData(".profiel");
	    				ocdWebApp.sections.toggle("profiel", "content");
	    			}else{
	    				reroute;
	    			};
	    		},
	    		'exercises/:type': function(type) {
	    			if (Parse.User.current()) {
		    			ocdWebApp.sections.toggle("exercises", "content");
		    			ocdWebApp.sections.toggle(type, "exercisesEl");
		    			var thirdWeek = myFunctions.getCurrentWeek() + 1;
		    			document.getElementById("thirdWeek").innerHTML = "De week van " + myFunctions.WeekToDate(thirdWeek).getDate() + " " + myFunctions.getMonthName(myFunctions.WeekToDate(thirdWeek).getMonth());
		    			myFunctions.showSliderVal("#newExercisesSlider","#newExercisesSliderOutput");
		    			if ("exercisesSummary") {
		    				SHOTGUN.listen('getExercises', ocdWebApp.sections.exercisesSummary);
		    				ocdWebApp.Exercise.read();
		    			}
	    			}else{
	    				reroute;	    				
	    			};
	    		},
	    		'exercises/detail/:id': function(id){
	    			ocdWebApp.sections.exerciseDetail(id);
		    		ocdWebApp.sections.toggle("exercises", "content");
		    		ocdWebApp.sections.toggle("detailExercise", "exercisesEl");
					ocdWebApp.Exercise.finish(id);
					myFunctions.showSliderVal("#postExposureSlider", "#postExposureSliderOutput");
	    		},
	    		'doctors/:type': function(type) {
	    			if (Parse.User.current()) {
		    			ocdWebApp.sections.toggle("doctors", "content");
		    			ocdWebApp.sections.toggle(type, "doctorEl");
		    			if (type == "doctorsSummary") {	    				
		    				SHOTGUN.listen('getDoctors', ocdWebApp.sections.doctorsSummary);
		    				ocdWebApp.Doctor.get("this");
		    			} else if (type == "newDoctor") {
		    				ocdWebApp.sections.doctorsResult();
		    				SHOTGUN.listen('getDoctors', ocdWebApp.sections.doctorsResult);
		    			}
	    			}else{
	    				reroute;
	    			};
	    		},
	    		startScreen: function() {
		    		if (Parse.User.current()) {
		    			window.location.hash = "#home";
		    		} else {
		    			ocdWebApp.sections.toggle("startScreen", "content")
		    		}
	    		},
	    		'': function () {
	    			reroute;
	    		}
			});
		} 
	};
})();