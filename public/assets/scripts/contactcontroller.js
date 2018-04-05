(function(){
	var app=angular.module("cleverleaves-es");
	
	app.controller("contactController",function($rootScope,$scope,Page,$window,$http,$location,NgMap,$timeout,$anchorScroll){
		console.log("app.contactController");
		Page.setTitle("Clever Leaves");
		$window.scrollTo(0,0);
		$scope.submitButtonActive=true;
		$scope.contactName=undefined;
		$scope.contactEmail=undefined;
		$scope.contactPhone=undefined;
		$scope.contactCompany=undefined;
		$scope.contactMessage=undefined;
		
		$rootScope.checkLanguage();
		
		$scope.mapCenterLocation=[4.681046296599829,-74.04732990000002];
		//$scope.mapCenterLocation="Cra. 13 # 96-67, Bogotá, Colombia";
		$scope.mapMarkerLocation=[4.681046296599829,-74.04732990000002];
		//$scope.mapMarkerLocation="Cra. 13 # 96-67, Bogotá, Colombia";
		$scope.mapZoom=16;
		
		NgMap.getMap().then(function(map){
			//console.log(map.getCenter());
			//console.log('markers', map.markers);
			//console.log('shapes', map.shapes);
			//google.maps.event.trigger(map,"resize");
			google.maps.event.addDomListener(window,"resize",function(){
				map.setCenter({lat:4.6810463,lng:-74.04732990000002});
			});
			map.setCenter({lat:4.6810463,lng:-74.04732990000002});
			//map.showInfoWindow("address");
			/*var marker=new google.maps.Marker({
			 position:{lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)},
			 title:"Actuar "+$rootScope.markerName,
			 map:map
			 });*/
		});
		
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
			params:{page:"contact"}
		}).then(dataSuccess,dataError);
		
		var dataSuccess=function(response){
			$rootScope[response.config.params["var"]]=response.data;
			console.log("app.run>>",response.config.params["var"],$rootScope[response.config.params["var"]]);
		};
		var dataError=function(response){
			console.log(response);
		};
		$http({
			method:"GET",
			url:"./configdata",
			params:{var:"config"}
		}).then(dataSuccess,dataError);
		
		$scope.sendEmail=function(){
			if($scope.submitButtonActive){
				$scope.submitButtonActive=false;
				let dataSuccess=function(response){
					$window.alert("Mensaje enviado");
					$scope.submitButtonActive=true;
					$window.scrollTo(0,0);
				};
				let dataError=function(response){
					$window.alert(response.data);
					console.log(response);
					$scope.submitButtonActive=true;
				};
				$http({
					method:"POST",
					url:"./contact",
					data:{name:$scope.contactName,email:$scope.contactEmail,phone:$scope.contactPhone,company:$scope.contactCompany,message:$scope.contactMessage,language:$rootScope.language}
				}).then(dataSuccess,dataError);
			}
		};
		
		$scope.getSubmitButtonLabel=function(){
			if($rootScope.language=="es"){
				return "Enviar";
			}else if($rootScope.language=="en"){
				return "Send";
			}
		};
		
		$scope.getTelefonosTitle=function(){
			if($rootScope.language=="es"){
				return "Teléfonos";
			}else if($rootScope.language=="en"){
				return "Phone numbers";
			}
		};
		
		$scope.getDireccionTitle=function(){
			if($rootScope.language=="es"){
				return "Dirección";
			}else if($rootScope.language=="en"){
				return "Address";
			}
		};
		
		$scope.getNombreTitle=function(){
			if($rootScope.language=="es"){
				return "NOMBRE COMPLETO";
			}else if($rootScope.language=="en"){
				return "FULL NAME";
			}
		};
		
		$scope.getTelefonoTitle=function(){
			if($rootScope.language=="es"){
				return "TELÉFONO";
			}else if($rootScope.language=="en"){
				return "PHONE";
			}
		};
		
		$scope.getEmpresaTitle=function(){
			if($rootScope.language=="es"){
				return "EMPRESA";
			}else if($rootScope.language=="en"){
				return "COMPANY";
			}
		};
		
		$scope.getMensajeTitle=function(){
			if($rootScope.language=="es"){
				return "MENSAJE";
			}else if($rootScope.language=="en"){
				return "MESSAGE";
			}
		};
		
		$scope.$on("$destroy",function(){
			
		});
		
		console.log("app.contactController.end");
	});
	
	
}());


