(function(){
	var app=angular.module("cleverleaves-es");
	
	app.controller("404errorController",function($scope,$rootScope,Page){
		Page.setTitle("Error - Page not found - CleverLeaves");
		
		$scope.$on("$destroy",function(){
			
		});
		
	});
}());
