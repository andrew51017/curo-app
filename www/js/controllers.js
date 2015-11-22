angular.module('curoapp.controllers', [])

.controller('AppCtrl', function($scope, $rootScope) {

})

.controller('LoginCtrl', function($scope, $rootScope, $location, $ionicModal, $ionicPopup, ApplicationUser) {

  // Form data for the registration modal
  $scope.registerData = {};
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  // Triggered in the register modal to close it
  $scope.closeRegistration = function() {
    $scope.registerModal.hide();
  };

  // Open the registration modal
  $scope.registration = function() {
    $scope.registerModal.show();
  };

  $scope.doRegister = function() {

      var data = $scope.registerData;
      ApplicationUser.create(data, function() {
          $scope.showAlert("Registered successfully!", "Your account has been successfully registered.");
      }, function(res) {
          $scope.showAlert("Registration failed!", "Your account couldn't be registered.");
      });
  }; 

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {

        var data = $scope.loginData;
        ApplicationUser.login(data, function(res) {

            $rootScope.loggedInUser = data.email;

            $location.path("/tab/dash");
        }, function(res) {
            
        });

    };

    $scope.navigateToRegistration = function() {
      $scope.registration();
    }; 

   // An alert dialog
   $scope.showAlert = function(title, message) {
     var alertPopup = $ionicPopup.alert({
       title: title,
       template: message
     });
     alertPopup.then(function(res) {
     });
   };

})

.controller('SearchController', function($scope, $stateParams, Restaurant) {

  var searchQuery = $stateParams.query; 
  $scope.restaurants = Restaurant.find({
    filter: { where: { name: {like: '.*' + searchQuery + '.*'} } }
  });


}); 
