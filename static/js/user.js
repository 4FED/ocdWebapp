var ocdWebApp = ocdWebApp || {};
(function () {
	Parse.initialize("e2pCNYD20d5ynvUPKyUud5G20evDRI4pmHiqrvPw", "6IEcqXamMkjJsssIaFPiTDKH1azNB6wOtR5kuAIP");

	ocdWebApp.User = {
		signUp: function () {
			var user = new Parse.User();

		    var email = document.registerForm.email.value;
		    var password = document.registerForm.password.value;
		    var initials = document.registerForm.initials.value;
		    var firstname = document.registerForm.firstname.value;
		    var surname = document.registerForm.surname.value;

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
			    },
			    error: function(model, error) {
			    	alert('Failed to create new object, with error code: ' + error.message);
			    }
			});
		},
		login: function () {	
			var email = document.loginForm.email.value;
		    var password = document.loginForm.password.value;

			Parse.User.logIn(email, password, {
			  success: function(user) {
			  	console.log("succes" + user);
				    window.location.href = "http://localhost/4fed/Webapp/#home";
			  },
			  error: function(user, error) {
			    console.log('login Failed ' + error.message);
			  }
			});
			
		},
		update: function () {
			// body...
		},
		logout: function () {
			Parse.User.logOut();
			window.location.href = "http://localhost/4fed/Webapp/#user/login";
			sessionStorage.clear();
			localStorage.clear();
		}
	};
})();