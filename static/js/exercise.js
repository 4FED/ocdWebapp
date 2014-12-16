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
			myFunctions.enableLoader();
		    var userID =  Parse.User.current().id;
		    var title = document.newExerciseForm.title.value;
		    var responsePrevention =  document.newExerciseForm.responsePrevention.value;
		    var week = document.newExerciseForm.week.value;
		    // var category = document.newExerciseForm.category.value;
		    var fearFactor =  document.newExerciseForm.fearFactor.value;
		    var weekTarget = document.newExerciseForm.weekTarget.value	

		    switch(week){
		   		case "0":
		   		var weekNumber = myFunctions.getCurrentWeek(); 
		   			break;
		   		case "1":
		   			var weekNumber = myFunctions.getCurrentWeek() + 1;
		   			break;
		   		case "2":
		   			var weekNumber = myFunctions.getCurrentWeek() + 2;
		   			break;		
		   	};

		    exercise.set("userID", userID);
		    exercise.set("title", title);
		    exercise.set("responsePrevention", responsePrevention);
		    exercise.set("weekNumber", weekNumber);
		    exercise.set("weekTarget", weekTarget)
		    // exercise.set("category", category);
		    exercise.set("fearFactor", fearFactor);
		    exercise.set("finished", 0);

		    exercise.save(null, {
			  success: function(exercise) {
			    // Execute any logic that should take place after the object is saved.
			    alert('New exercise created with name: ' + exercise.get("title"));
			    myFunctions.clearForm(document.newExerciseForm);
				ocdWebApp.Exercise.read(true);
				myFunctions.disableLoader();
			  },
			  error: function(exercise, error) {
			  	myFunctions.disableLoader();
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
		},
		read: function (newEl) {
			myFunctions.enableLoader();
			if (sessionStorage.getItem("exercises") && newEl == null) {
				ocdWebApp.Exercise.content = JSON.parse(sessionStorage.getItem("exercises"));				
				SHOTGUN.fire('getExercises');
				myFunctions.disableLoader();

			}else{
				ocdWebApp.Exercise.content = [];
				var exerciseQuery = this.init("get");
				exerciseQuery.equalTo("userID", Parse.User.current().id);

				exerciseQuery.find({
				  	success: function(exercises) {
					  	exercises = _.sortBy(exercises, function(sorted){
				  			return -sorted.get("weekNumber");
						});

					  	var weekNumber = exercises[0].get("weekNumber"); // save first weeknumber
					  	var weekArray = [];
					  	for (var i = 0; exercises.length >= i; i++) {
					  		if (exercises[i]) {
						  		if(weekNumber == exercises[i].get("weekNumber")){
						  			weekArray.push(exercises[i]);
						  		} else {
						  			ocdWebApp.Exercise.content[weekNumber] = weekArray;
						  			weekArray = [];
						  			weekNumber = exercises[i].get("weekNumber");
						  			weekArray.push(exercises[i]);
						  		}
					  		} else {
					  			ocdWebApp.Exercise.content[weekNumber] = weekArray;
					  		}
					  	};

					    var content  = JSON.stringify(ocdWebApp.Exercise.content);
					    sessionStorage.setItem("exercises", content);

					  	myFunctions.disableLoader();

					  	SHOTGUN.fire('getExercises');
				  	},
				  	error: function(exercises, error) {
					  	myFunctions.disableLoader();
					    console.log('get exercises failed ' + error.message);
				  	}
				});
			}
			
		},
		finish: function (id) {
			var exerciseId = id;
			var finish = function () {
				var exerciseQuery = ocdWebApp.Exercise.init("get");
				var exerciseData = {};
				exerciseQuery.get(id, {
					success: function(exercise) {
						var amount = exercise.get("finished") + 1;
						exerciseData.weekTarget = exercise.get("weekTarget");
						exerciseData.finished = amount;
						var fearFactorPre = myFunctions.getOneEl("#fearFactorPre").value;
						var fearFactorPost = myFunctions.getOneEl("#postExposureSlider").value;
					   	exercise.set("finished", amount);
					   	exercise.set("fearFactorPre", fearFactorPre);
					   	exercise.set("fearFactorPost", fearFactorPost);
					   	exercise.save();
					},
					error: function(error) {
					  console.log("object with id: " + id + "not found"); 
					}
				});
				myFunctions.enableLoader();				
				var Exercise = Parse.Object.extend("exerciseFinished");
				var exercise = new Exercise();		

				var fearFactorPre = myFunctions.getOneEl("#fearFactorPre").value;
				var fearFactorPost = myFunctions.getOneEl("#postExposureSlider").value;
				// var tijdAfronding = myFunctions.getOneEl('input[name = "tijdAfronding"]:checked').id;
				var ervaring = "lukte het om de angst te verdragen?<br />" + document.postExposureForm.ervaring1.value + "<br /><br />"
								+ "Is de verwachte ramp uitgekomen?<br />" + document.postExposureForm.ervaring2.value + "<br /><br />"
								+ "Wat gebeurde er met je angst?<br />" +document.postExposureForm.ervaring3.value + "<br /><br />";

				exercise.set("exerciseId", exerciseId);
				exercise.set("fearFactorPre", fearFactorPre);
				exercise.set("fearFactorPost", fearFactorPost);
				// exercise.set("tijdAfronding", tijdAfronding);
				exercise.set("ervaring", ervaring);
				exercise.set("userID", Parse.User.current().id);

				exercise.save(null, {
			  		success: function(exercise) {
					    // Execute any logic that should take place after the object is saved.
					    myFunctions.alert("TOP!<br /> JE HEBT EEN OEFENING VOLBRACHT", 
					    	"images/check.svg", 
					    	"Je week target staat nu op<br />"+exerciseData.finished+"/"+exerciseData.weekTarget, 
					    	"exercises/exercisesSummary", 
					    	"terug naar home");
					    myFunctions.clearForm(document.postExposureForm);
					    myFunctions.disableLoader();
					    ocdWebApp.Exercise.read(true);
			 		},
					error: function(exercise, error) {
						myFunctions.disableLoader();
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
			myId:{
				id: function () { return "G" + this.objectId; }
			},
			myExpandId:{
				id: function () { return "ex" + this.objectId; }
			},
			myExpand:{
				onclick: function () { return "myFunctions.expand('ex" + this.objectId + "');"; }
			},
		    myLink:{
		    	href: function() { return "#exercises/detail/" + this.objectId; }
		    },
		    myValue:{
		    	value: function() { return this.fearFactor; }
		    },
		    myTotal:{
		    	text: function () {
					return this.finished + "/" + this.weekTarget
		    	}
  			}
  		}
	};
})();