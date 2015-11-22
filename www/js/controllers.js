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

            var userID = res.user_id;
            localStorage.setItem('userID', userID);

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

  $scope.restaurants = null;

  var searchQuery = $stateParams.query; 

  var res = Restaurant.find({
    filter: { where: { name: { like: '%' + searchQuery + '%' } } }
  });

  res.$promise.then(function(r) {
    $scope.restaurants = r;
  });

})

.controller('BookingController', function($scope, $stateParams, Bookings, Restaurant) {

  $scope.bookings = [];

  var ruserID = localStorage.getItem('userID');

  var res = Bookings.find({
        filter: { where : { user_id: ruserID } }
      }); 

  res.$promise.then(function(b) {
    b.forEach(function(booking) {

      var restaurant = Restaurant.findOne({
        filter: { where : { id: booking.restaurant_id } }
      }); 
      restaurant.$promise.then(function(r) {
          booking.name = r.name; 
          $scope.bookings.push(booking);
      }); 
    }); 

  });


})

.controller('RestaurantInfoController', function($scope, $stateParams, Restaurant, Review, Menu) {

  Array.prototype.groupBy = function(hash){
    var _hash = hash ? hash : function(o){return o;};

    var _map = {};
    var put = function(map, key, value){
      if (!map[_hash(key)]) {
          map[_hash(key)] = {};
          map[_hash(key)].group = [];
          map[_hash(key)].key = key;

      }
      map[_hash(key)].group.push(value); 
    }

    this.map(function(obj){
      put(_map, obj, obj);
    });

    return Object.keys(_map).map(function(key){
      return {key: _map[key].key, group: _map[key].group};
    });
  }

  $scope.getNumber = function(num) {
      return new Array(num);   
  }

  $scope.restaurant = null;

  var restaurantId = $stateParams.rid; 

  //Get the restaurant. 

  $scope.restaurant = Restaurant.findOne({
    filter: { where: { id: restaurantId } }
  });

  //Get the reviews. 

  $scope.reviews = Review.find({
    filter: { where: { restaurant_id: restaurantId } }
  });

  //Get the menu 

  Menu.find({
    filter: { where: { restaurant_id: restaurantId } }
  }).$promise.then(function(m) {

      var groupedMenu = m.groupBy(function(mi) { return mi.type;});
      $scope.menuItems = groupedMenu;

  });

  $scope.getTotalPrice = function(menuGroup)
  {
      var totalCost = 0; 
      if (menuGroup != null)
      {
        menuGroup.forEach(function(group) {
            group.group.forEach(function(groupItem) {
              var price = Number(groupItem.price.substring(1,groupItem.price.length));
              totalCost += groupItem.orderCount * price; 
            }); 
        }); 
      }

      return totalCost;
  }; 

}); 

