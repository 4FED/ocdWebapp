var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.User = {
		signUp: function () {
			var user = new Parse.User();
			myFunctions.enableLoader();	
			
		    var email = document.registerForm.email.value;
		    var password = document.registerForm.password.value;
		    var initials = document.registerForm.initials.value;
		    var firstname = document.registerForm.firstname.value;
		    var surname = document.registerForm.surname.value;
			var passwordChecker = document.registerForm.passwordChecker.value;			
		    var password = document.registerForm.password.value;
		    var fileUploadControl = document.getElementById("profilePicture");
			if (passwordChecker == password) {				
			    if (fileUploadControl.files.length > 0) {
			    	var file = fileUploadControl.files[0];
			  		var name = "profilePicture.png";		 
			  		var parseFile = new Parse.File(name, file);		

				  	parseFile.save().then(function(profilePicture) {			  
					    user.set("username", email);
					    user.set("email", email);
					    user.set("password", password);
					    user.set("initials", initials);
					    user.set("firstname", firstname);
					    user.set("surname", surname);
					    user.set("profilePicture", profilePicture);
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
					}, function(error) {
						alert("something went wrong");
						console.log(error);
					});
				} else {
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
				};
			} else {
				myFunctions.disableLoader();
				alert("The two passwords are not the same");
			};
		},
		login: function () {	
			var email = document.loginForm.email.value;
		    var password = document.loginForm.password.value;

			Parse.User.logIn(email, password, {
			  success: function(user) {
			  	console.log("succes" + user);
				    window.location.href = "http://localhost:8080/4fed/Webapp/#home";
			  },
			  error: function(user, error) {
			    console.log('login Failed ' + error.message);
			  }
			});
			
		},
		update: function () {
			// body...
		},
		forgotPassword: function () {
			myFunctions.enableLoader();
			var emailAdress = document.forgotForm.email.value;
			var userQuery = new Parse.Query(Parse.User);
			userQuery.equalTo("email", emailAdress);
			userQuery.find({
				success: function(user) {
			    	if (user.length > 0) {
			    		Parse.User.requestPasswordReset(emailAdress, {
							success: function() {
								myFunctions.disableLoader();
								alert("An email to reset your new password was sent to " + emailAdress);
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
			window.location.href = "http://localhost:8080/4fed/Webapp/#startScreen";
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
		    }
		}
	};
})();