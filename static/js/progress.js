var ocdWebApp = ocdWebApp || {};
(function (){
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Progress = {
		init: function (exercises) {
			this.setProgress(exercises);
		},
		// setProgress: function () {
		// 	var difficulty = 1;				
		// 	var exercises = JSON.parse(sessionStorage.getItem("exercises"));
		// 	_.each(exercises, function (exercise) {
		// 		if (document.getElementById(exercise.objectId)) {
		// 			var exerciseEl 	= document.getElementById(exercise.objectId);
		// 			var brons		= exerciseEl.getElementsByClassName("brons"); 	// 0
		// 			var silver		= exerciseEl.getElementsByClassName("silver"); 	// 2
		// 			var goud		= exerciseEl.getElementsByClassName("goud");	// 6
		// 			var platinum	= exerciseEl.getElementsByClassName("platinum");// 12
		// 			var diamand		= exerciseEl.getElementsByClassName("diamand");	// 20
		// 			var finished 	= exercise.finished;
		// 			var level = (difficulty + Math.sqrt(difficulty * difficulty - 4 * difficulty * (-finished) ))/ (2 * difficulty);
		// 			var percentage = (level - Math.floor(level))*100;
		// 			// console.log("percentage: "+percentage+" level: "+level);		
		// 			if (level > 0) {
		// 				brons[0].style.height = percentage + "%";
		// 			};
		// 			if (level > 1) {
		// 				brons[0].style.height = "100%";
		// 				silver[0].style.height = percentage + "%";
		// 			};
		// 			if (level > 2) {
		// 				silver[0].style.height = "100%";
		// 				goud[0].style.height = percentage + "%";
		// 			};
		// 			if (level > 3) {
		// 				goud[0].style.height ="100%";
		// 				platinum[0].style.height = percentage + "%";
		// 			};
		// 			if (level > 4) {
		// 				platinum[0].style.height = "100%";
		// 				diamand[0].style.height = percentage + "%";
		// 			};

		// 		};
		// 	});
		// },
		setProgress: function (exercises) {
			var x = 0;
			var loopArray = function(arr) {
			    customAlert(arr[x],function(){
			        // set x to next item
			        x++;
			        // any more items in array? continue loop
			        if(x < arr.length) {
			            loopArray(arr);   
			        }
			    }); 
			}
			function customAlert(exercise, callback) {
			    // code to show your custom alert
			    // in this case its just a console log
			    SHOTGUN.listen("getExerciseDetails", function () {
			    		var ctx = document.getElementById(exercise.objectId).getContext("2d");
						var BarChart = new Chart(ctx).Bar(ocdWebApp.Progress.content, ocdWebApp.Progress.options);
			    		callback();
					});
					ocdWebApp.Progress.content.datasets[0].data = [];
					ocdWebApp.Progress.getData(exercise.objectId);
			    // do callback when ready
			}
				var exercisesData = exercises;
				loopArray(exercises);
				// _.each(exercisesData, function (exercise) {
				// 	for(var exercise in exercises){
				// 	var ctx = document.getElementById(exercise.objectId).getContext("2d");
				// 	SHOTGUN.listen("getExerciseDetails", function () {
				// 		var BarChart = new Chart(ctx).Bar(ocdWebApp.Progress.content, ocdWebApp.Progress.options);
				// 	});
				// 	ocdWebApp.Progress.content.datasets[0].data = [];
				// 	ocdWebApp.Progress.getData(exercise.objectId);
					
				// });
		},
		getData: function (id) {
			var exerciseFinished = Parse.Object.extend("exerciseFinished");
			var exerciseFinishedQuery = new Parse.Query(exerciseFinished);
			exerciseFinishedQuery.equalTo("exerciseId", id);
			exerciseFinishedQuery.find({
				  	success: function(exercises) {
				  		if (exercises.length > 0) {
							_.each(exercises ,function (exercise) {
						  		var average = (parseInt(exercise.get("fearFactorPre")) + parseInt(exercise.get("fearFactorPost"))) / 2;
						  		ocdWebApp.Progress.content.datasets[0].data.push(average);
						  	});
						  	SHOTGUN.fire("getExerciseDetails");
						  	SHOTGUN.remove("getExerciseDetails");
						  	ocdWebApp.Progress.content.datasets[0].data = [];
						  } else{
						  	ocdWebApp.Progress.content.datasets[0].data.push(0);
						  	SHOTGUN.fire("getExerciseDetails");
						  	SHOTGUN.remove("getExerciseDetails");
						  	ocdWebApp.Progress.content.datasets[0].data = [];
						  };
				  	},
				  	error: function(exercises, error) {
					  	
				  	}
				});
		},
		content: {
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.5)",
		            strokeColor: "rgba(220,220,220,0.8)",
		            highlightFill: "rgba(220,220,220,0.75)",
		            highlightStroke: "rgba(220,220,220,1)",
		            data: []
		        },
		    ]
		},
		options: {
		    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		    scaleBeginAtZero : true,

		    //Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,
		}
	}
})();