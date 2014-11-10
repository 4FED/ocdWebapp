var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Exercise = {
		init: function (type) {
			var Exercise = Parse.Object.extend("exercise");
			if (type == "post") {
				return new Exercise();
			} else if(type == "get"){
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
				ocdWebApp.Exercise.read(true);
			  },
			  error: function(exercise, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
		},
		read: function (newEl) {
			if (sessionStorage.getItem("exercises") && newEl == null) {
				ocdWebApp.Exercise.content = JSON.parse(sessionStorage.getItem("exercises"));				
				SHOTGUN.fire('getExercises');
				myFunctions.disableLoader();

			}else{
				ocdWebApp.Exercise.content = [];
				var worker = new Worker("static/js/exerciseWorker.js");
				worker.postMessage(Parse.User.current().id);
				worker.onmessage = function (e){
					console.log(e.data);
					throw new Error("worked");
					 // ocdWebApp.Exercise.content = _.sortBy(e.data, function(sorted){
			   // 			 return -sorted.fearFactor;
					// });

					var content  = JSON.stringify(ocdWebApp.Exercise.content);
				    sessionStorage.setItem("exercises", content);

				  	myFunctions.disableLoader();

				  	SHOTGUN.fire('getExercises');
				};
			}
			
		},
		finish: function (id) {
			var exerciseId = id;
			var finish = function () {				
				var Exercise = Parse.Object.extend("exerciseFinished");
				var exercise = new Exercise();		

				var fearFactorPre = myFunctions.getOneEl("#fearFactorPre").value;
				var fearFactorPost = myFunctions.getOneEl("#postExposureSlider").value;
				var tijdAfronding = myFunctions.getOneEl('input[name = "tijdAfronding"]:checked').id;
				var ervaring = myFunctions.getOneEl("#postExposureErvaring").value;

				exercise.set("exerciseId", exerciseId);
				exercise.set("fearFactorPre", fearFactorPre);
				exercise.set("fearFactorPost", fearFactorPost);
				exercise.set("tijdAfronding", tijdAfronding);
				exercise.set("ervaring", ervaring);
				exercise.set("userID", Parse.User.current().id);

				exercise.save(null, {
			  		success: function(exercise) {
					    // Execute any logic that should take place after the object is saved.
					    alert('exercise was finished: ' + exercise.exerciseId);
					    window.location.replace("http://localhost/4fed/Webapp/#exercises/exercisesSummary");
			 		},
					error: function(exercise, error) {
					    // Execute any logic that should take place if the save fails.
					    // error is a Parse.Error with an error code and message.
					    alert('Failed to create new object, with error code: ' + error.message);
					}
			});
			}
			SHOTGUN.listen('finishExercise', finish);
		},
		content: [
		],
		directives: {
		    myLink:{
		    	href: function() { return "#exercises/detail/" + this.number; }
		    },
		    myValue:{
		    	value: function() { return this.fearFactor; }
		    },
  		}
	};
})();