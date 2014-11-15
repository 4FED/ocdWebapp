var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.Doctor = {
		set: function () {

			var order = document.getElementById("doctorOrderNumber").value 
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
				var username = document.getElementById("searchField").value;
				doctorQuery.equalTo("isDoctor", true);
				doctorQuery.equalTo("username", username);
				doctorQuery.find({
					success: function(doctors) {
					  	for (var i = 0; i < doctors.length; i++) {
					  		var doctor = new Object();
					  		doctor.order = i;
						    doctor.firstname = doctors[i].get("firstname");
						    doctor.id = doctors[i].id;
						   	ocdWebApp.Doctor.content.push(doctor);
						}
				  		myFunctions.disableLoader();
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
				  		myFunctions.disableLoader();
						SHOTGUN.fire("getDoctors");
					},
					error: function(doctors, error) {
						console.log('get doctors failed ' + error.message);
					}
				});

			}
		},
		remove: function () {
			var user = Parse.User.current();
			user.set("hasDoctor", "");
			user.save(null, {
				success: function(user) {
					alert("doctor is removed");
					window.location.reload();
				},
				error: function() {
					alert("removing doctor failed " + error.message);
				}
			});
		},
		content: [
		],
		directives: {
		    doctorID: { 
		        value: function() { return this.order; }
		     },
		    myLink:{
		    	href: function() { return "#movies/" + myFunctions.cleanStrings(this.title); }
		    }
  		}
	};
})();