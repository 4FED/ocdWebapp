
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var Mandrill = require('mandrill');
Mandrill.initialize('9ea9i9si1Ps6Z55VpUbT4w');


// 			Parse.Cloud.run('sendNewPassword', { email: emailAdress, password: newPassword }, {
// 				success: function(succes) {
// 					alert(succes);
// 					myFunctions.disableLoader();
// 				},
// 					error: function(error) { 
// 					alert(error);
// 					myFunctions.disableLoader();
// 				}
// 			});
//     	} else {
//     		alert("There is no user registerd under this emailadress: " + emailAdress);				    		
// 			myFunctions.disableLoader();
//     	}
// 	}
// });

Parse.Cloud.define("sendNewPassword", function(request, response) {
  Mandrill.sendEmail({
    message: {
      text: "Your new password is: " + request.params.password,
      subject: "new password",
      from_email: "no-reply@fidence.com",
      from_name: "fidence support",
      to: [
        {
          email: request.params.email,
          name: "fidence user"
        }
      ]
    },
    async: true
  }, {
    success: function(httpResponse) { response.success("An email with your new password was sent to " + request.params.email); },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
});