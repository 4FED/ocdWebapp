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
		// // },
		setProgress: function (exercises) {
			var exercisesData = exercises;

			_.each(exercisesData, function (exercise) {			
				
					SHOTGUN.listen("getExerciseDetails", function () {
						var ctx = document.getElementById(exercise.objectId);
					});
				ocdWebApp.Progress.content = [];
				ocdWebApp.Progress.getData(exercise.objectId);
				
			});
		},
		getData: function (id) {
			var exerciseFinished = Parse.Object.extend("exerciseFinished");
			var exerciseFinishedQuery = new Parse.Query(exerciseFinished);
			exerciseFinishedQuery.equalTo("exerciseId", id);
			exerciseFinishedQuery.find({
				  	success: function(exercises) {
				  		if (exercises.length > 0) {
				  			var x = 1
							_.each(exercises ,function (exercise) {
								var obj = {};
								obj.letter = x;
						  		obj.frequency = (parseInt(exercise.get("fearFactorPre")) + parseInt(exercise.get("fearFactorPost"))) / 2;
						  		ocdWebApp.Progress.content.push(obj);
						  		x++
						  	});
						} else {
						 	ocdWebApp.Progress.content = [];
						};	
						ocdWebApp.Progress.draw(id);					
						SHOTGUN.fire("getExerciseDetails");
						// SHOTGUN.remove("getExerciseDetails");
				  	},
				  	error: function(exercises, error) {
					  	console.log("error loading data" + error.message);
				  	}
				});
		},
		draw: function(id){
			var data = ocdWebApp.Progress.content;
			var margin,
			    width,
			    height;

			margin = {
			    'top': 20,
			    'right': 20,
			    'bottom': 30,
			    'left': 50
			};

			width = 200 - margin.left - margin.right;
			height = 150 - margin.top - margin.bottom;


			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], 0.1);
			var y = d3.scale.linear()
    			.range([height, 0]);

    		var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient('bottom');

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient('left');

			var $svg = d3.select('#'+id)
			    .append('svg')
			    .attr('width', width + margin.left + margin.right)
			    .attr('height', height + margin.top + margin.bottom)
			    .attr('class', id)
			    .append('g')
			    .attr(
			        'transform',
			        'translate(' + margin.left + ',' + margin.top + ')'
			    );
			
			function clean(d) {
			    d.frequency = Number(d.frequency);
			    return d;
			}

			 x.domain(data.map(function (d) {
		        return d.letter;
		    }));

			y.domain([0, d3.max(data, function (d) {
        		return d.frequency;
    		})]);

    		$svg
		        .append('g')
		        .attr('class', 'axis axis-x')
		        .attr('transform', 'translate(0,' + height + ')')
		        .call(xAxis);

		    $svg
		        .append('g')
		        .attr('class', 'axis axis-y')
		        .call(yAxis)
		        .append('text')
		        .attr('transform', 'rotate(-90)')
		        .attr('y', 6)
		        .attr('dy', '.71em')
		        .style('text-anchor', 'end')
		    $svg
		        .selectAll('.bar')
		        .data(data)
		        .enter()
		            .append('rect')
		            .attr('class', 'bar')
		            .attr('x', function (d) {
		                return x(d.letter);
		            })
		            .attr('width', x.rangeBand())
		            .attr('y', function (d) {
		                return y(d.frequency);
		            })
		            .attr('height', function (d) {
		                return height - y(d.frequency);
		            });

		},
		content: [
	
		],
		options: {
		    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		    scaleBeginAtZero : true,

		    //Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,
		}
	}
})();