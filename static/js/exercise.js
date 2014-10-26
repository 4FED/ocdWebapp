var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Exercise = {
		init: function (type) {
			if (type == "post") {
				var Exercise = Parse.Object.extend("exercise");
				return new Exercise();
			} else if(type == "get"){
				var Exercise = Parse.Object.extend("exercise");
				return new Parse.Query(Exercise);
			} 
		},
		create: function () {
			var exercise = this.init("post");

		    var userID =  Parse.User.current().id;
		    var title = document.newExerciseForm.title.value;
		    var responsePrevention =  document.newExerciseForm.responsePrevention.value;
		    var category = document.newExerciseForm.category.value;
		    var fearFactor =  document.newExerciseForm.fearFactor.value;

		    exercise.set("userID", userID);
		    exercise.set("title", title);
		    exercise.set("responsePrevention", responsePrevention);
		    exercise.set("category", category);
		    exercise.set("fearFactor", fearFactor);

		    exercise.save(null, {
			  success: function(exercise) {
			    // Execute any logic that should take place after the object is saved.
			    alert('New exercise created with name: ' + exercise.title);
			  },
			  error: function(exercise, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
		},
		read: function () {
			var exerciseQuery = this.init("get");
			exerciseQuery.equalTo("userID", Parse.User.current().id);
			exerciseQuery.find({
			  success: function(exercises) {
			  	for (var i = 0; i < exercises.length; i++) {
			  		var exercise = new Object();
			  		exercise.title = exercises[i].get("title");
				    exercise.category = exercises[i].get("category");
				    exercise.responsePrevention = exercises[i].get("responsePrevention");
				    exercise.fearFactor = exercises[i].get("fearFactor");
				    ocdWebApp.Exercise.content.push(exercise);
			    }
			  	SHOTGUN.fire('getExercises');
			  },
			  error: function(exercises, error) {
			    console.log('get exercises failed ' + error.message);
			  }
			});
			
		},
		delete: function () {
			// body...
		},
		content: [],
	};
})();