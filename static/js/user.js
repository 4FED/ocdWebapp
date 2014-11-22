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
		    var fileUploadControl = document.getElementById("profilePicture");
		    if (fileUploadControl.files.length > 0) {
		    	var file = fileUploadControl.files[0];
		  		var name = "profilePicture.png";		 
		  		var parseFile = new Parse.File(name, file);
		  	};
		  	parseFile.save().then(function(profilePicture) {			  
			    user.set("username", email);
			    user.set("email", email);
			    user.set("password", password);
			    user.set("initials", initials);
			    user.set("firstname", firstname);
			    user.set("surname", surname);
			    user.set("profilePicture", profilePicture)
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
			  // The file either could not be read, or could not be saved to Parse.
			});
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
			emailAdress = document.forgotForm.email.value;
			newPassword = this.generatePassword();
			this.update("password", newPassword);
			Parse.Cloud.run('sendNewPassword', { email: emailAdress, password: newPassword }, {
				success: function(succes) {
					alert(succes);
					myFunctions.disableLoader();
				},
					error: function(error) { 
					alert(error);
					myFunctions.disableLoader();
				}
			});
		},
		logout: function () {
			Parse.User.logOut();
			window.location.href = "http://localhost:8080/4fed/Webapp/#startScreen";
			sessionStorage.clear();
			localStorage.clear();
		},
		generatePassword: function () {
	        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	        var string_length = 8;
	        var newPassword = '';
	        for (var i=0; i<string_length; i++) {
	            var rnum = Math.floor(Math.random() * chars.length);
	            newPassword += chars.substring(rnum,rnum+1);
	        }
	        return newPassword;
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