var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");


	// Router object
	// sets router parameters
	var sections = {
		exercisesSummary: function () {
			Transparency.render(myFunctions.getOneEl(".exercisesTable"), ocdWebApp.Exercise.content, ocdWebApp.Exercise.directives);
		},
		exerciseDetail: function(id){
			Transparency.render(myFunctions.getOneEl(".detailExercise"), ocdWebApp.Exercise.content[id], ocdWebApp.Exercise.directives);
		},
		doctorsSummary: function  () {			
			Transparency.render(myFunctions.getOneEl(".doctorsTable"), ocdWebApp.Doctor.content, ocdWebApp.Doctor.directives);
		},
		doctorsResult: function (){
			Transparency.render(myFunctions.getOneEl(".doctorsResultTable"), ocdWebApp.Doctor.content, ocdWebApp.Doctor.directives);
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

	var router = {
		init: function () {
			routie({
	    		'user/:type': function (type) {
	    			sections.toggle("user", "content");
	    			sections.toggle(type, "userForm");
	    			if (type == "login" && Parse.User.current()) {	    				
				    	window.location.href = "http://localhost/4fed/Webapp/#home";
	    			};
	    		},
	    		home: function() {	
	    			if (Parse.User.current()) {
	    				sections.toggle("home", "content");
	    			}else{
	    				window.location.replace("http://localhost/4fed/Webapp/#user/login");
	    			};
	    		},
	    		'exercises/:type': function(type) {
	    			if (Parse.User.current()) {
		    			sections.toggle("exercises", "content");
		    			sections.toggle(type, "exercisesEl");
		    			if ("exercisesSummary") {
		    				SHOTGUN.listen('getExercises', sections.exercisesSummary);
		    				ocdWebApp.Exercise.read();
		    			}
	    			}else{
	    				window.location.replace("http://localhost/4fed/Webapp/#user/login");	    				
	    			};
	    		},
	    		'exercises/detail/:id': function(id){
	    			sections.exerciseDetail(id);
		    		sections.toggle("exercises", "content");
		    		sections.toggle("detailExercise", "exercisesEl");
	    		},
	    		'doctors/:type': function(type) {
	    			if (Parse.User.current()) {
		    			sections.toggle("doctors", "content");
		    			sections.toggle(type, "doctorEl");
		    			if (type == "doctorsSummary") {	    				
		    				SHOTGUN.listen('getDoctors', sections.doctorsSummary);
		    				ocdWebApp.Doctor.get("this");
		    			} else if (type == "newDoctor") {
		    				SHOTGUN.listen('getDoctors', sections.doctorsResult);
		    			}
	    			}else{
	    				window.location.replace("http://localhost/4fed/Webapp/#user/login");
	    			};
	    		},
	    		'': function () {
	    			window.location.replace("http://localhost/4fed/Webapp/#user/login");
	    		}
			});
		} 
	};


	// movieApp.Sections Object
	// Sets templater
	// toggle's movieApp.sections
	router.init();

})();