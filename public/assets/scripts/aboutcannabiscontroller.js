(function(){
	var app=angular.module("cleverleaves-es");
	
	app.controller("aboutCannabisController",function($rootScope,$scope,Page,$window,$http,$location,$timeout,$anchorScroll){
		console.log("app.aboutCannabisController");
		Page.setTitle("Clever Leaves");
		$window.scrollTo(0,0);
		$scope.submitButtonActive=true;
		$scope.page=undefined;
		
		$rootScope.checkLanguage();
		
		var dataSuccess=function(response){
			$scope.page=response.data;
			if(!!$scope.page[$rootScope.language+"Title"]) Page.setTitle($scope.page[$rootScope.language+"Title"]+" - Clever Leaves");
			angular.element($('meta[name="author"]')).remove();
			angular.element($("head")).append('<meta name="author" content="Clever Leaves">');
			angular.element($('meta[name="description"]')).remove();
			angular.element($("head")).append('<meta name="description" content="'+$scope.page[$rootScope.language+"SeoDescription"]+'">');
			angular.element($('meta[name="keywords"]')).remove();
			angular.element($("head")).append('<meta name="keywords" content="'+$scope.page[$rootScope.language+"SeoKeywords"].map(function(element,index,array){return element.text;}).join(",")+'">');
			angular.element($('meta[property="og:url"]')).remove();
			angular.element($("head")).append('<meta property="og:url" content="'+$location.absUrl()+'">');
			angular.element($('meta[property="og:type"]')).remove();
			angular.element($("head")).append('<meta property="og:type" content="'+"article"+'">');
			angular.element($('meta[property="og:title"]')).remove();
			angular.element($("head")).append('<meta property="og:title" content="'+$scope.page[$rootScope.language+"SeoTitle"]+'">');
			angular.element($('meta[property="og:description"]')).remove();
			angular.element($("head")).append('<meta property="og:description" content="'+$scope.page[$rootScope.language+"SeoDescription"]+'">');
			angular.element($('meta[property="og:image"]')).remove();
			angular.element($("head")).append('<meta property="og:image" content="http://www.cleverleaves.com/assets/images/logo.png">');
			angular.element($('meta[property="article:author"]')).remove();
			angular.element($("head")).append('<meta property="article:author" content="Clever Leaves">');
			angular.element($('meta[property="article:publisher"]')).remove();
			angular.element($("head")).append('<meta property="article:publisher" content="'+"Clever Leaves"+'">');
			
		};
		var dataError=function(response){
			console.log(response);
		};
		$http({
			method:"GET",
			url:"./pagedata",
			params:{page:"about-cannabis"}
		}).then(dataSuccess,dataError);
		
		$scope.$on("$destroy",function(){
			
		});
		
		console.log("app.aboutCannabisController.end");
	});
	
	
}());


