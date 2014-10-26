var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");


	// Router object
	// sets router parameters
	var sections = {
		login: function () {
			Transparency.render(myFunctions.getOneEl(".login"), movieApp.about.content, movieApp.about.directives);
		},
		exercisesSummary: function () {
			Transparency.render(myFunctions.getOneEl(".exercisesTable"), ocdWebApp.Exercise.content);
		},
		detail: function(movieID) {
			Transparency.render(myFunctions.getOneEl(".detail"), movieApp.movies.content, movieApp.aboutDirectives);
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
	    		},
	    		home: function() {	
	    			sections.toggle("home", "content");
	    		},
	    		'exercises/:type': function(type) {
	    			sections.toggle("exercises", "content");
	    			sections.toggle(type, "exercisesEl");
	    			if ("summary") {
	    				ocdWebApp.Exercise.read();
	    				SHOTGUN.listen('getExercises', sections.exercisesSummary);
	    			};
	    		}
			});
		} 
	};


	// movieApp.Sections Object
	// Sets templater
	// toggle's movieApp.sections
	router.init();

})();