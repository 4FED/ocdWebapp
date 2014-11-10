onmessage = function(e) {
   
	importScripts("vendor/parse-1.3.1.min.js");

	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	debugger;
	var Exercise = Parse.Object.extend("exercise");
	var exerciseQuery = new Parse.Query(Exercise);
	var exerciseContent = []

				exerciseQuery.equalTo("userID", e.data);
				exerciseQuery.find({
				  success: function(exercises) {
				  	console.log(exercises);
				  	for (var i = 0; i < exercises.length; i++) {
				  		var exercise = new Object();
				  		exercise.number = i;
				  		exercise.id = exercises[i].id;
				  		exercise.title = exercises[i].get("title");
					    exercise.category = exercises[i].get("category");
					    exercise.responsePrevention = exercises[i].get("responsePrevention");
					    exercise.fearFactor = exercises[i].get("fearFactor");
					    exerciseContent.push(exercise);
				    }
				    postMessage(exerciseContent);
				  },
				  error: function(exercises, error) {
				    console.log('get exercises failed ' + error.message);
				  }
				}); 
};