var ocdWebApp = ocdWebApp || {};
(function (){
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Progress = {
		init: function () {
			this.setData();
		},
		setData: function () {		
			var Exercise = Parse.Object.extend("exerciseFinished");
			var exerciseQuery = new Parse.Query(Exercise);
			exerciseQuery.equalTo("userID", Parse.User.current().id);			
			exerciseQuery.find({
				success: function(exercises) {		
					for (var i = 0; exercises.length > i; i++) {
						ocdWebApp.Progress.dataSetPre[i] = exercises[i].get("fearFactorPre");
						ocdWebApp.Progress.dataSetPost[i] = exercises[i].get("fearFactorPost");
					};
					ocdWebApp.Progress.drawChart();
			  	},
			  	error: function(exercises, error) {
			    	console.log('get exercises failed ' + error.message);
			  	}
			});
		},
		drawChart: function (){		
			var canvas  = document.getElementById("progressChart").getContext("2d");
			var options = {
				 scaleShowGridLines : false,
			}
			var data = {
			    labels: ["1", "2", "3", "4", "5", "6", "7"], 
			    datasets: [
				    {
			            label: "angst score pre exposure",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(220,220,220,1)",
			            pointColor: "rgba(220,220,220,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: ocdWebApp.Progress.dataSetPre
			        },
			        {
			            label: "angst score post exposure",
			            fillColor: "rgba(151,187,205,0.2)",
			            strokeColor: "rgba(151,187,205,1)",
			            pointColor: "rgba(151,187,205,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(151,187,205,1)",
			            data: ocdWebApp.Progress.dataSetPost
			        }
	            ]
			}
			var progressLineChart = new Chart(canvas).Line(data, options);
		},
		dataSetPre: [
		],
		dataSetPost:[
		]
	}
})();