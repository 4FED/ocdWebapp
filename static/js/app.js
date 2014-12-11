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
		mainMenu: function (){
			userData = [{profilePicture: Parse.User.current().get("profilePicture"), firstname: Parse.User.current().get("firstname")}];
			Transparency.render(myFunctions.getOneEl(".hoofdmenu"), userData, ocdWebApp.User.directives);
		},
		exercisesSummary: function (weekNumber){
			var exercisesData = JSON.parse(sessionStorage.getItem("exercises"));
			
			if (!weekNumber) {
				var weekNumber = myFunctions.getCurrentWeek()
			};

			var weekdata = {
				content: {
					date: "De week van " + myFunctions.WeekToDate(weekNumber).getDate() + " " + myFunctions.getMonthName(myFunctions.WeekToDate(weekNumber).getMonth()),
				},
				directives: {
					previous:{
						onClick: function () { return "ocdWebApp.sections.exercisesSummary(" + (weekNumber - 1) + ")"; }
					},	
					next: {
						onClick: function () { return "ocdWebApp.sections.exercisesSummary(" + (weekNumber + 1) + ")"; }
					}
				}
			}

			Transparency.render(document.getElementById("scroller"), weekdata.content, weekdata.directives);

			var exercisesSummary = exercisesData[weekNumber];

			Transparency.render(myFunctions.getOneEl(".exercisesList"), exercisesSummary, ocdWebApp.Exercise.directives);
		},
		exerciseDetail: function  (id){
			var detailExercise = [];
			detailExercise.push(_.find(ocdWebApp.Exercise.content, function (exercise) { return exercise.objectId == id }));

			Transparency.render(myFunctions.getOneEl(".detailExercise"), detailExercise, ocdWebApp.Exercise.directives);
			Transparency.render(myFunctions.getOneEl(".postExposure"), detailExercise, ocdWebApp.Exercise.directives);
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
	    				ocdWebApp.sections.mainMenu();
	    				ocdWebApp.sections.toggle("home", "content");
	    			}else{
	    				reroute;
	    			};
	    		},
	    		'exercises/:type': function(type) {
	    			if (Parse.User.current()) {
		    			ocdWebApp.sections.toggle("exercises", "content");
		    			ocdWebApp.sections.toggle(type, "exercisesEl");
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
	    		progress: function () {
	    			ocdWebApp.sections.toggle("progress", "content");
	    			ocdWebApp.sections.progress();
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