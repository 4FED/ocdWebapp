var ocdWebApp = ocdWebApp || {};
window.onload = function (){	
	ocdWebApp.router.init();
	myFunctions.AddClickEvent(".eventButton");
};

(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");


	// Router object
	// sets router parameters
	var sections = {
		mainMenu: function (){
			userData = [{profilePicture: Parse.User.current().get("profilePicture"), firstname: Parse.User.current().get("firstname")}];
			Transparency.render(myFunctions.getOneEl(".hoofdmenu"), userData, ocdWebApp.User.directives);
		},
		exercisesSummary: function (){
			Transparency.render(myFunctions.getOneEl(".exercisesList"), JSON.parse(sessionStorage.getItem("exercises")), ocdWebApp.Exercise.directives);
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
			var reroute = window.location.href = "http://localhost:8080/4fed/Webapp/#startScreen";
			routie({
	    		'user/:type': function (type) {
	    			sections.toggle("user", "content");
	    			sections.toggle(type, "userForm");
	    			if (type == "login" && Parse.User.current()) {	    				
				    	window.location.href = "http://localhost:8080/4fed/Webapp/#home";
	    			};
	    		},
	    		home: function() {	
	    			if (Parse.User.current()) {
	    				sections.mainMenu();
	    				sections.toggle("home", "content");
	    			}else{
	    				reroute;
	    			};
	    		},
	    		'exercises/:type': function(type) {
	    			if (Parse.User.current()) {
		    			sections.toggle("exercises", "content");
		    			sections.toggle(type, "exercisesEl");
		    			myFunctions.showSliderVal("#newExercisesSlider","#newExercisesSliderOutput");
		    			if ("exercisesSummary") {
		    				SHOTGUN.listen('getExercises', sections.exercisesSummary);
		    				ocdWebApp.Exercise.read();
		    			}
	    			}else{
	    				reroute;	    				
	    			};
	    		},
	    		'exercises/detail/:id': function(id){
	    			sections.exerciseDetail(id);
		    		sections.toggle("exercises", "content");
		    		sections.toggle("detailExercise", "exercisesEl");
					ocdWebApp.Exercise.finish(id);
					myFunctions.showSliderVal("#postExposureSlider", "#postExposureSliderOutput");
	    		},
	    		'doctors/:type': function(type) {
	    			if (Parse.User.current()) {
		    			sections.toggle("doctors", "content");
		    			sections.toggle(type, "doctorEl");
		    			if (type == "doctorsSummary") {	    				
		    				SHOTGUN.listen('getDoctors', sections.doctorsSummary);
		    				ocdWebApp.Doctor.get("this");
		    			} else if (type == "newDoctor") {
		    				sections.doctorsResult();
		    				SHOTGUN.listen('getDoctors', sections.doctorsResult);
		    			}
	    			}else{
	    				reroute;
	    			};
	    		},
	    		progress: function () {
	    			sections.toggle("progress", "content");
	    			sections.progress();
	    		},
	    		startScreen: function() {
		    		if (Parse.User.current()) {
		    			window.location.href = "http://localhost:8080/4fed/Webapp/#home";
		    		} else {
		    			sections.toggle("startScreen", "content")
		    		}
	    		},
	    		'': function () {
	    			reroute;
	    		}
			});
		} 
	};
})();