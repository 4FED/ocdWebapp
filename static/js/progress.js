var ocdWebApp = ocdWebApp || {};
(function (){
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Progress = {
		init: function () {
			SHOTGUN.listen('getExercises', this.setProgress);
			ocdWebApp.Exercise.read(true);
		},
		setProgress: function () {
			var difficulty = 1;				
			var exercises = JSON.parse(sessionStorage.getItem("exercises"));
			_.each(exercises, function (exercise) {
				if (document.getElementById(exercise.objectId)) {
					var exerciseEl 	= document.getElementById(exercise.objectId);
					var brons		= exerciseEl.getElementsByClassName("brons"); 	// 0
					var silver		= exerciseEl.getElementsByClassName("silver"); 	// 2
					var goud		= exerciseEl.getElementsByClassName("goud");	// 6
					var platinum	= exerciseEl.getElementsByClassName("platinum");// 12
					var diamand		= exerciseEl.getElementsByClassName("diamand");	// 20
					var finished 	= exercise.finished;
					var level = (difficulty + Math.sqrt(difficulty * difficulty - 4 * difficulty * (-finished) ))/ (2 * difficulty);
					var percentage = (level - Math.floor(level))*100;
					// console.log("percentage: "+percentage+" level: "+level);		
					if (level > 0) {
						brons[0].style.height = percentage + "%";
					};
					if (level > 1) {
						brons[0].style.height = "100%";
						silver[0].style.height = percentage + "%";
					};
					if (level > 2) {
						silver[0].style.height = "100%";
						goud[0].style.height = percentage + "%";
					};
					if (level > 3) {
						goud[0].style.height ="100%";
						platinum[0].style.height = percentage + "%";
					};
					if (level > 4) {
						platinum[0].style.height = "100%";
						diamand[0].style.height = percentage + "%";
					};

				};
			});
		},
	}
})();