var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.User = {
		signUp: function () {
			var user = new Parse.User();
			myFunctions.enableLoader();	
			
		    var email = document.registerForm.email.value;
		    var email = email.toLowerCase();
		    var password = document.registerForm.password.value;
		    var initials = document.registerForm.initials.value;
		    var firstname = document.registerForm.firstname.value;
		    var surname = document.registerForm.surname.value;
			var passwordChecker = document.registerForm.passwordChecker.value;			
		    var password = document.registerForm.password.value;
		    var fileUploadControl = document.getElementById("profilePicture");
			if (passwordChecker == password) {				
			 //    if (fileUploadControl.files.length > 0) {
			 //    	var file = fileUploadControl.files[0];
			 //  		var name = "profilePicture.png";		 
			 //  		var parseFile = new Parse.File(name, file);		

				//   	parseFile.save().then(function(profilePicture) {			  
				// 	    user.set("username", email);
				// 	    user.set("email", email);
				// 	    user.set("password", password);
				// 	    user.set("initials", initials);
				// 	    user.set("firstname", firstname);
				// 	    user.set("surname", surname);
				// 	    user.set("profilePicture", profilePicture);
				// 	    user.set("isDoctor", false);

				// 	    user.signUp(null, {
				// 		    success: function(object) {
				// 			    alert("nieuwe gebruiker is aangemaakt, vergeet niet je email te verifiseren");
				// 			    ocdWebApp.User.logout();
				// 			    myFunctions.clearForm(document.registerForm);
				// 			    myFunctions.disableLoader();
				// 		    },
				// 		    error: function(model, error) {
				// 		    	myFunctions.disableLoader();
				// 		    	alert('Failed to create new object, with error code: ' + error.message);
				// 		    }
				// 		});
				// 	}, function(error) {
				// 		alert("something went wrong");
				// 		console.log(error);
				// 	});
				// } else {
						user.set("username", email);
					    user.set("email", email);
					    user.set("password", password);
					    user.set("initials", initials);
					    user.set("firstname", firstname);
					    user.set("surname", surname);
					    user.set("isDoctor", false);

					    user.signUp(null, {
						    success: function(object) {
							    alert("nieuwe gebruiker is aangemaakt, vergeet niet je email te verifiseren");
							    ocdWebApp.User.logout();
							    myFunctions.clearForm(document.registerForm);
							    myFunctions.disableLoader();
						    },
						    error: function(model, error) {
						    	myFunctions.disableLoader();
						    	alert('Failed to create new object, with error code: ' + error.message);
						    }
						});
			} else {
				myFunctions.disableLoader();
				alert("The two passwords are not the same");
			};
		},
		login: function () {	
			var email = document.loginForm.email.value;
			var email = email.toLowerCase();
		    var password = document.loginForm.password.value;

			Parse.User.logIn(email, password, {
			  success: function(user) {
			  	console.log("succes" + user);
				    window.location.hash = "#home";
			  },
			  error: function(user, error) {
			    alert('login Failed ' + error.message);
			  }
			});
			
		},
		update: function (item) {
			var userQuery = new Parse.Query(Parse.User);
			var currentUser = Parse.User.current();
				userQuery.get(currentUser.id, {
					success: function(user) {
						var fileUploadControl = myFunctions.getOneEl("#changePictureButton");
						fileUploadControl.onchange = function () {
							if (fileUploadControl.files.length > 0) {
						    	var file = fileUploadControl.files[0];
						  		var name = "profilePicture.png";		 
						  		var parseFile = new Parse.File(name, file);		

							  	parseFile.save().then(function(profilePicture) {
							  		user.set("profilePicture", profilePicture);
							  		user.save(null, {
										  success: function(user) {
										    // Execute any logic that should take place after the object is saved.
										    alert("Nieuwe profiel foto is geupload en zal te zien zijn wanneer je opnieuw inloged");
										  },
										  error: function(user, error) {
										    alert('Uploaden van profiel foto is mislukt: ' + error.message);
										  }
										});
							  	});
							}
						}
					},
					error: function(error) {
					  console.log("object with id: " + id + "not found"); 
					}
				});
		},
		forgotPassword: function (currentUser) {
			myFunctions.enableLoader();
			if (currentUser) {
				var emailAdress = Parse.User.current().get('email')
			} else {
				var emailAdress = document.forgotForm.email.value;
			};	
			var userQuery = new Parse.Query(Parse.User);
			userQuery.equalTo("email", emailAdress);
			userQuery.find({
				success: function(user) {
			    	if (user.length > 0) {
			    		Parse.User.requestPasswordReset(emailAdress, {
							success: function() {
								myFunctions.disableLoader();
								myFunctions.alert("EEN EMAIL IS VERSTUURD NAAR<br /><u>"+emailAdress+"</u>", 
						    	"images/envelop.svg", 
						    	"Binnen enkele minuten ontvang je een e-mail waarin je je wachtwoord kunt ressetten", 
						    	"home",
						    	"terug naar home");
							},
							error: function(error) {
							  // Show the error message somewhere
							  myFunctions.disableLoader();
							  alert("Error: " + error.code + " " + error.message);
							}
						});
			    		
			    	} else {
			    		alert("There is no user registerd under this emailadress: " + emailAdress);				    		
						myFunctions.disableLoader();
			    	}
				}
			});
			
		},
		logout: function () {
			Parse.User.logOut();
			window.location.hash = "#user/login";
			sessionStorage.clear();
			localStorage.clear();
		},
		directives: {
		    myLink:{
		    	href: function() { return "#exercises/detail/" + this.number; }
		    },
		    profilePicture:{
		    	src: function(target) {
		    		if (this.profilePicture) {
		    			var backgroundImage = "url(" + this.profilePicture.url() + ")";
		    			target.element.style.backgroundImage= backgroundImage;
		    		}
		    	}
		    },
		    myName:{
		    	text: function () {
		    		return this.firstname + " " + this.surname
		    	}
		    }
		}
	};
})();