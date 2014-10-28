var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Doctor = {
		set: function (order) {
			var currentUser = Parse.User.current();
			var doctorID = this.content[order].id;
			currentUser.set("hasDoctor", doctorID);
		    currentUser.save(null, {
				success: function(doctor) {
					alert('doctor added' + ocdWebApp.Doctor.content[order]);
				},
				error: function(doctor, error) {
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		},
		get: function (type) {		
			if (type == "search") {
				ocdWebApp.Doctor.content = [];

				var doctorQuery = new Parse.Query(Parse.User);
				var email = document.getElementById("searchField").value;
				doctorQuery.equalTo("isDoctor", true);
				doctorQuery.equalTo("email", email);
				doctorQuery.find({
					success: function(doctors) {
					  	for (var i = 0; i < doctors.length; i++) {
					  		var doctor = new Object();
					  		console.log(doctors[i]);
					  		doctor.order = "ocdWebApp.Doctor.set("+i+");";
						    doctor.firstname = doctors[i].get("firstname");
						    doctor.id = doctors[i].id;
						   	ocdWebApp.Doctor.content.push(doctor);
						}
						SHOTGUN.fire("getDoctors");
					},
					error: function(doctors, error) {
						console.log('get doctors failed ' + error.message);
					}
				});
			} else{
				ocdWebApp.Doctor.content = [];

				var user = Parse.User.current();
				doctorID = user.get("hasDoctor");
				var doctorQuery = new Parse.Query(Parse.User);
				doctorQuery.equalTo("objectId", doctorID);
				doctorQuery.find({
					success: function(doctors) {
					  	for (var i = 0; i < doctors.length; i++) {
					  		var doctor = new Object();
					  		doctor.order = i;
						    doctor.firstname = doctors[i].get("firstname");
						    doctor.id = doctors[i].get("objectId");
						    ocdWebApp.Doctor.content.push(doctor);
						    console.log(doctor.firstname);
						}
						SHOTGUN.fire("getDoctors");
					},
					error: function(doctors, error) {
						console.log('get doctors failed ' + error.message);
					}
				});

			}
		},
		delete: function () {
		},
		content: [
		],
		directives: {
		    doctorID: { 
		        onclick: function() { return this.order; }
		     },
		    myLink:{
		    	href: function() { return "#movies/" + myFunctions.cleanStrings(this.title); }
		    }
  		}
	};
})();