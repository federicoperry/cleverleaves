window.onerror=function(){//errorMsg, url, lineNumber, column, errorObj
	//alert(JSON.stringify(arguments));
};

window.onload=function(){
	
};

(function(){
	var app=angular.module("cleverleaves-es",["ngRoute","ngSanitize","vjs.video","angular-p5","720kb.socialshare","oc.lazyLoad","ngCookies","ngMap"]);
	app.config(function($routeProvider,$locationProvider,$ocLazyLoadProvider,socialshareConfProvider){
		console.log("app.config");
		socialshareConfProvider.configure([
			{
				"provider":"twitter",
				"conf":{
					"trigger":"click",
					"popupHeight":600,
					"popupWidth":600
				}
			},
			{
				"provider":"facebook",
				"conf":{
					"trigger":"click",
					"popupHeight":600,
					"popupWidth":600
				}
			}
		]);
		$locationProvider.html5Mode(true);
		$ocLazyLoadProvider.config({
			debug:true,
			events:true
		});
		$routeProvider
			.when("/",{templateUrl:"./templates/index.html",controller:"indexController",reloadOnSearch:false})
			.when("/index",{templateUrl:"./templates/index.html",controller:"indexController",reloadOnSearch:false})
			.when("/error",{templateUrl:"./templates/secondary/400error.html",controller:"400errorController"})
			.when("/about",{templateUrl:"./templates/about.html",controller:"aboutController",reloadOnSearch:false})
			.when("/portfolio",{templateUrl:"./templates/portfolio.html",controller:"portfolioController",reloadOnSearch:false})
			.when("/about-cannabis",{templateUrl:"./templates/about-cannabis.html",controller:"aboutCannabisController",reloadOnSearch:false})
			.when("/contact",{templateUrl:"./templates/contact.html",controller:"contactController",reloadOnSearch:false})
			.otherwise({templateUrl:"./templates/secondary/404error.html",controller:"404errorController"});
		console.log("app.config.end");
		
	});
	
	app.run(function($rootScope,$http,Page,$location,$window){
		console.log("app.run");
		Page.setTitle("Clever Leaves");
		$rootScope.indexSliderData=undefined;
		$rootScope.language="es";
		
		var dataSuccess=function(response){
			$rootScope[response.config.params["var"]]=response.data;
			console.log("app.run>>",response.config.params["var"],$rootScope[response.config.params["var"]]);
		};
		var dataError=function(response){
			console.log(response);
		};
		$http({
			method:"GET",
			url:"./indexsliderdata",
			params:{var:"indexSliderData"}
		}).then(dataSuccess,dataError);
		$http({
			method:"GET",
			url:"./configdata",
			params:{var:"config"}
		}).then(dataSuccess,dataError);
		$http({
			method:"GET",
			url:"./pagesdata",
			params:{var:"pagesData"}
		}).then(dataSuccess,dataError);
		
		$rootScope.showSlider=function(){
			return !!$rootScope.indexSliderData && (/^\/$/ig.test($location.path()) || /^\/index$/ig.test($location.path()) || /^\/about$/ig.test($location.path()) || /^\/portfolio$/ig.test($location.path()) || /^\/about-cannabis$/ig.test($location.path()));
		};
		
		$rootScope.backToTop=function(){
			$window.scrollTo(0,0);
		};
		
		$rootScope.jssorOptions={
			$AutoPlay:true
		};
		
		$rootScope.toggleMenu=function(){
			angular.element($("#menu")).toggleClass("open");
		};
		
		$rootScope.checkLanguage=function(){
			if($location.host().split(".")[0]=="es") $rootScope.language="es";
			else if($location.host().split(".")[0]=="en")$rootScope.language="en";
			else if($location.host().split(".")[0]=="www")$rootScope.language="es";
			else $rootScope.language="es";
			//console.log("$rootScope.language",$rootScope.language);
		};
		$rootScope.checkLanguage();
		
		$rootScope.getLocationPath=function(){
			return $location.url();
		};
		
		$rootScope.getbackToTopLabel=function(){
			if($rootScope.language=="es"){
				return "VOLVER ARRIBA";
			}else if($rootScope.language=="en"){
				return "BACK TO TOP";
			}
		};
		
		console.log("navigator.userAgent",navigator.userAgent,/android\s4/ig.test(navigator.userAgent));
		
		console.log("app.run.end");
	});
	
	app.controller("appController",function($scope,$rootScope){
		console.log("app.appController");
		
		$scope.onload=function(){
			//console.log("$scope.onload");
		};
		
		$scope.$on("$destroy",function(){
			
		});
		
		console.log("app.appController.end");
	});
	
	app.controller("appHeadCtrl",["$scope","Page",function($scope,Page){
		console.log("app.appHeadCtrl");
		$scope.Page=Page;
		
		$scope.$on("$destroy",function(){
			
		});
		console.log("app.appHeadCtrl.end");
	}]);
	
	app.controller("sliderController",function($scope,$rootScope,$window,$location,$timeout,p5){console.log("app.sliderController");
		$scope.activeSlider=$location.path();
		
		$scope.$on("$destroy",function(){
			
		});
		console.log("app.sliderController.end");
	});
	
	app.factory("Page",function(){
		var title="Clever Leaves";
		return{
			title:function(){return title;},
			setTitle:function(newTitle){title=newTitle;}
		};
	});
	
	app.filter("to_trusted",["$sce",function($sce){
		return function(text){
			return $sce.trustAsHtml(text);
		};
	}]);
	
	app.filter("to_trusted_url",["$sce",function($sce){
		return function(text){
			return $sce.trustAsResourceUrl(text);
		};
	}]);
	
	
}());

