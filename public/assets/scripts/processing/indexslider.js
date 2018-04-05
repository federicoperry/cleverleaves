(function(){
	
	var app=angular.module("cleverleaves-es");
	
	
	app.factory("indexSliderSketchFac",["$rootScope","$window","$location","$timeout","p5",function($rootScope,$window,$location,$timeout,p5){
		return function(p){
			var canvasWidth,
				canvasHeight,
				translationX,
				translationY,
				mouseOver,
				rotacion,
				img=[],
				objects,
				scaling,
				containerCanvas,
				fontNormal,
				sliderMillis,
				difMillis,
				sliderTime,
				i0,
				i1,
				translateDirection,
				sliderOn,
				noRender,
				resumeTimer,
				hidebuttonsTimer,
				leftButton,
				rightButton,
				boton,
				container,
				boxBlack,
				mouseDragg,
				changeSlide,
				isDragging,
				pmouseDragg,
				ptranslateDirection,
				animationInProgress,
				mouseIsOver,
				frameRate,
				boxBlack,
				title;
			
			$rootScope.checkLanguage();
			
			p5.disableFriendlyErrors=true;
			
			p.preload=function(){
				for(var i=0;i<$rootScope.indexSliderData.length;i++){
					img[i]=p.loadImage("/getimage?url="+$rootScope.indexSliderData[i].image.url);
				}
				//fontNormal=p.loadFont("css/fuentes/lsn.ttf");
			};
			p.setup=function(){
				p.imageMode(p.CENTER);
				p.background(235,235,235,255);
				canvasWidth=angular.element($("#indexSliderDiv")).outerWidth();
				canvasHeight=Math.floor(angular.element($("#indexSliderDiv")).outerWidth()/3);
				//canvasWidth=document.getElementById("indexSliderDiv").offsetWidth;
				//canvasHeight=document.getElementById("indexSliderDiv").offsetWidth/3;
				//canvasHeight=document.getElementById("indexSliderDiv").offsetHeight;
				//canvasHeight=angular.element($("#indexSliderDiv")).outerHeight();
				translationX=0;
				translationY=0;
				mouseOver=false;
				//if(angular.element($("body")).outerWidth()<800){
				//}else{
				//}
				objects=[];
				i0=img.length-1;
				i1=0;
				sliderMillis=0;
				sliderTime=8000;
				translateDirection=1;
				sliderOn=true;
				noRender=false;
				$rootScope.animationOn=true;
				mouseDragg=0;
				changeSlide=false;
				isDragging=false;
				pmouseDragg=0;
				ptranslateDirection=0;
				animationInProgress=false;
				mouseIsOver=false;
				frameRate=25;
				
				//console.log(canvasWidth, canvasHeight);
				containerCanvas=p.createCanvas(canvasWidth,canvasHeight,"WEBGL");//P2D WEBGL
				containerCanvas.parent("indexSliderCanvasDiv");
				containerCanvas.id("indexCanvas");
				//containerCanvas.mouseOver(function(){				});
				//containerCanvas.mouseOut(function(){			});
				/*containerCanvas.mouseClicked(function(){
				 //if(translateDirection>0) $window.location.href="./link"+i1;
				 //else $window.location.href="./link"+i0;
				 //if(translateDirection>0) $window.open($rootScope.indexSliderFotos.fotos[i1].link,"_self");
				 //else $window.open($rootScope.indexSliderFotos.fotos[i0].link,"_self");
				 //$location.url("./linkfoto"+i0);
				 //$window.location="./linkfoto"+i0;
				 });*/
				containerCanvas.mouseMoved(function(){
					//console.log(p.mouseX,canvasWidth,p.mouseY,canvasHeight);
					sliderOn=false;
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
						}
					},sliderTime*1.5);
					mouseIsOver=true;
				});
				containerCanvas.mouseOut(function(){
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
						}
					},1000);
					mouseIsOver=false;
				});
				containerCanvas.mousePressed(function(){
					
				});
				containerCanvas.mouseReleased(function(){
					
				});
				
				boxBlack=p.createDiv("");
				boxBlack.parent("indexSliderCanvasDiv");
				boxBlack.addClass("slider-box-black");
				//boxBlack.style("position","absolute");
				//boxBlack.style("left",(canvasWidth/5).toFixed(0)+"px");
				//console.log("canvastop",((9*canvasHeight)/25));
				//boxBlack.style("top",((9*canvasHeight)/25).toFixed(0)+"px");
				//boxBlack.style("width",(((canvasWidth/5)*3)-60).toFixed(0)+"px");
				//boxBlack.style("height",((canvasHeight/4)-40).toFixed(0)+"px");
				boxBlack.mouseOver(function(){sliderOn=false;});
				boxBlack.mouseOut(function(){
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
						}
					},sliderTime*1.5);
				});
				/*container=p.createDiv("");
				 container.parent(boxBlack);
				 container.addClass("box-black-cont");*/
				title=p.createElement("p","");
				title.parent(boxBlack);
				title.addClass("slider-title");
				//title.style("margin-top",((canvasHeight-40)/8).toFixed(0)+"px");
				//title.style("margin-bottom",((canvasHeight-40)/8).toFixed(0)+"px");
				//title.style("font-size",((canvasWidth*30)/1500).toFixed(0)+"px");
				
				leftButton=p.createImg("assets/images/prev.png");
				leftButton.parent("indexSliderCanvasDiv");
				leftButton.style("left:10px");
				leftButton.style("position:absolute");
				leftButton.style("display:inline");
				var topLeft=Math.floor((canvasHeight/2)-25);
				leftButton.style("top:"+topLeft+"px");
				leftButton.style("float:left");
				leftButton.style("width:40px");
				leftButton.style("height:40px");
				leftButton.style("cursor:pointer");
				leftButton.mousePressed(function(){
					if(translateDirection<0){
						if(i0<=0)i0=img.length-1;
						else i0=i0-1;
						if(i1<=0)i1=img.length-1;
						else i1=i1-1;
					}
					sliderMillis=p.millis();
					difMillis=0;
					translateDirection=-1;
					mouseDragg=0;
					pmouseDragg=mouseDragg;
					//if($rootScope.animationOn) p.frameRate(frameRate);
					//p.loop();
				});
				leftButton.mouseOver(function(){sliderOn=false;});
				leftButton.mouseOut(function(){
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
						}
					},sliderTime);
				});
				
				rightButton=p.createImg("assets/images/next.png");
				rightButton.parent("indexSliderCanvasDiv");
				rightButton.style("right:10px");
				rightButton.style("position:absolute");
				leftButton.style("display:inline");
				//rightButton.style("top:0px");//+Math.ceil(angular.element($("#indexSliderDiv")).position().top)+"px"
				var topRight=Math.floor((canvasHeight/2)-25);
				rightButton.style("top:"+topRight+"px");
				rightButton.style("float:right");
				rightButton.style("width:40px");
				rightButton.style("height:40px");
				rightButton.style("cursor:pointer");
				rightButton.mousePressed(function(){
					if(translateDirection>0){
						if(i0>=img.length-1)i0=0;
						else i0=i0+1;
						if(i1>=img.length-1)i1=0;
						else i1=i1+1;
					}
					sliderMillis=p.millis();
					difMillis=0;
					translateDirection=1;
					mouseDragg=0;
					pmouseDragg=mouseDragg;
					//if($rootScope.animationOn) p.frameRate(frameRate);
					//p.loop();
				});
				rightButton.mouseOver(function(){sliderOn=false;});
				rightButton.mouseOut(function(){
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
						}
					},sliderTime);
				});
				
				p.cursor(p.HAND);
				//p.textStyle(p.BOLD);
				//p.textSize(50);
				//p.textFont(fontNormal);
				
				if(/android/ig.test(navigator.userAgent) || (/gecko/ig.test(navigator.userAgent) && !/like gecko/ig.test(navigator.userAgent))){
					p.frameRate(1);
					$rootScope.animationOn=false;
				}else p.frameRate(frameRate);
				//p.frameRate(frameRate);
				//p.frameRate(10);
				
			};
			p.draw=function(){
				if(!isDragging){
					difMillis=p.millis()-sliderMillis;
					//console.log("difMillis",difMillis);
					if((difMillis>sliderTime && sliderOn && p.focused) || changeSlide){
						//boxBlack.style("transform","translate("+0+"px,"+0+"px)");
						sliderTime=5200;
						changeSlide=false;
						//translateDirection=1;
						if(translateDirection>0){
							if(i0>=img.length-1)i0=0;
							else i0=i0+1;
							if(i1>=img.length-1)i1=0;
							else i1=i1+1;
						}else{
							if(i0<=0)i0=img.length-1;
							else i0=i0-1;
							if(i1<=0)i1=img.length-1;
							else i1=i1-1;
						}
						sliderMillis=p.millis();
						difMillis=0;
						noRender=true;
						//if($rootScope.animationOn) p.frameRate(frameRate);
						//p.loop();
						//p.resetMatrix();
					}
				}else{
					sliderMillis=p.millis();
				}
				
				if(noRender){
					p.background(255,255,255,0);
				}
				else{
					p.background(255,255,255,255);
				}
				drawScene();
				
				//p.fill(255,255,255,255);
				//p.text(p.frameRate().toFixed(1), 12, 40);
				
			};
			function drawScene(){
				if(mouseDragg!=0 && $rootScope.animationOn){
					if(mouseDragg<0){
						p.imageMode(p.CORNER);
						var i12;
						if(translateDirection!=Math.sign(-mouseDragg)){
							i12=i1;
						}else{
							if(i1>=img.length-1) i12=0;
							else i12=i1+1;
						}
						p.image(img[i12],0,0,img[i12].width,img[i12].height,(0),(0),canvasWidth,canvasHeight);
						p.imageMode(p.CENTER);
						if(!$rootScope.indexSliderData[i12][$rootScope.language+"Caption"]){
							boxBlack.style("display","none");
						}else{
							boxBlack.style("display","block");
							title.html($rootScope.indexSliderData[i12][$rootScope.language+"Caption"]);
							//boxBlack.position(((canvasWidth/5)).toFixed(0),((9*canvasHeight)/25).toFixed(0));
						}
					}else{
						p.imageMode(p.CORNER);
						var i02;
						if(translateDirection!=Math.sign(-mouseDragg)){
							i02=i0;
						}else{
							if(i0<=0) i02=img.length-1;
							else i02=i0-1;
						}
						p.image(img[i02],0,0,img[i02].width,img[i02].height,(0),(0),canvasWidth,canvasHeight);
						p.imageMode(p.CENTER);
						if(!$rootScope.indexSliderData[i02][$rootScope.language+"Caption"]){
							boxBlack.style("display","none");
						}else{
							boxBlack.style("display","block");
							title.html($rootScope.indexSliderData[i02][$rootScope.language+"Caption"]);
							//boxBlack.position(((canvasWidth/5)).toFixed(0),((9*canvasHeight)/25).toFixed(0));
						}
					}
				}
				if($rootScope.animationOn){
					p.translate(mouseDragg,0);
					//if(difMillis>400) boxBlack.position(boxBlack.position().x+mouseDragg,0);
					if(difMillis>400) boxBlack.style("transform","translate("+mouseDragg+"px,"+0+"px)");
				}
				if(noRender){p.tint(255,0);noRender=false;}
				else p.tint(255,255);
				if(translateDirection>0){
					p.imageMode(p.CORNER);
					p.image(img[i1],0,0,img[i1].width,img[i1].height,(0),(0),canvasWidth,canvasHeight);
					p.imageMode(p.CENTER);
					if(!$rootScope.indexSliderData[i1][$rootScope.language+"Caption"]){
						boxBlack.style("display","none");
					}else{
						boxBlack.style("display","block");
						title.html($rootScope.indexSliderData[i1][$rootScope.language+"Caption"]);
					}
				}else{
					p.imageMode(p.CORNER);
					p.image(img[i0],0,0,img[i0].width,img[i0].height,(0),(0),canvasWidth,canvasHeight);
					p.imageMode(p.CENTER);
					if(!$rootScope.indexSliderData[i0][$rootScope.language+"Caption"]){
						boxBlack.style("display","none");
					}else{
						boxBlack.style("display","block");
						title.html($rootScope.indexSliderData[i0][$rootScope.language+"Caption"]);
					}
				}
				//console.log($rootScope.animationOn && difMillis<1000 && p.focused && ($location.path()=="/" || $location.path()=="/index"));
				if($rootScope.animationOn && difMillis<400){// && p.focused
					animationInProgress=true;
					if(pmouseDragg!=0) p.translate(pmouseDragg+Math.floor(-translateDirection*(difMillis/(400/(canvasWidth)))),0);
					else p.translate(Math.floor(-translateDirection*(difMillis/(400/(canvasWidth)))),0);
					//p.tint(255,255-difMillis/((1500)/255));
					if(translateDirection>0){
						p.imageMode(p.CORNER);
						p.image(img[i0],0,0,img[i0].width,img[i0].height,(0),(0),canvasWidth,canvasHeight);//pg.image(img[i0], pg.width/2, pg.height/2);//pg.image(img[i0], 0, 0,img[i0].width, img[i0].height,canvasWidth/2,canvasHeight/2,img[i0].width*1.4, img[i0].height*1.4);
						p.imageMode(p.CENTER);
						if(!$rootScope.indexSliderData[i0][$rootScope.language+"Caption"]){
							boxBlack.style("display","none");
						}else{
							boxBlack.style("display","block");
							title.html($rootScope.indexSliderData[i0][$rootScope.language+"Caption"]);
						}
					}else{
						p.imageMode(p.CORNER);
						p.image(img[i1],0,0,img[i1].width,img[i1].height,(0),(0),canvasWidth,canvasHeight);//pg.image(img[i1], pg.width/2, pg.height/2);
						p.imageMode(p.CENTER);
						if(!$rootScope.indexSliderData[i1][$rootScope.language+"Caption"]){
							boxBlack.style("display","none");
						}else{
							boxBlack.style("display","block");
							title.html($rootScope.indexSliderData[i1][$rootScope.language+"Caption"]);
						}
					}
					//boxBlack.position(boxBlack.position().x-translateDirection*(difMillis/(400/(canvasWidth))),0);
					boxBlack.style("transform","translate("+Math.floor(pmouseDragg-translateDirection*(difMillis/(400/(canvasWidth))))+"px,"+0+"px)");
				}else{
					//if(mouseDragg==0) p.frameRate(10);
					//else p.frameRate(frameRate);
					animationInProgress=false;
				}
			}
			
			
			function actualizarInnerHTML(id,valor){
				document.getElementById(id).innerHTML=valor;
			}
			function setFrameRate(n){
				p.frameRate(n);
			}
			
			function setRotacion(n){
				rotacion=n*PI/180;
			}
			
			p.mouseDragged=function(){
				if(mouseIsOver){
					//console.log("p.mouseDragged",mouseDragg,p.mouseX,canvasWidth,p.mouseY,canvasHeight);
					if(Math.abs(p.mouseX-p.pmouseX)>5 && !animationInProgress){
						isDragging=true;
						sliderOn=false;
						//sliderMillis=p.millis();
						mouseDragg+=(p.mouseX-p.pmouseX);
						//if($rootScope.animationOn) p.frameRate(frameRate);
					}
				}
			};
			
			p.mouseReleased=function(e){
				//console.log("p.mouseReleased",isDragging,mouseDragg,p.mouseX,canvasWidth,p.mouseY,canvasHeight);
				if(isDragging){
					isDragging=false;
					sliderOn=true;
					ptranslateDirection=translateDirection;
					if(mouseDragg>0) translateDirection=-1;
					else translateDirection=1;
					//else mouseDragg=0;
					if(translateDirection==ptranslateDirection){// && mouseDragg!=0
						if(translateDirection>0){
							if(i0>=img.length-1)i0=0;
							else i0=i0+1;
							if(i1>=img.length-1)i1=0;
							else i1=i1+1;
						}else{
							if(i0<=0)i0=img.length-1;
							else i0=i0-1;
							if(i1<=0)i1=img.length-1;
							else i1=i1-1;
						}
					}
					sliderMillis=p.millis();
					//difMillis=0;
					pmouseDragg=mouseDragg;
					mouseDragg=0;
				}else{
					//p.position(0,0)
				}
			};
			
			p.windowResized=function(){
				console.log("p.windowResized",p.mouseX,canvasWidth,p.mouseY,canvasHeight);
				canvasWidth=angular.element($("#indexSliderDiv")).outerWidth();
				canvasHeight=Math.floor(angular.element($("#indexSliderDiv")).outerWidth()/3);
				//canvasWidth=document.getElementById("indexSliderDiv").offsetWidth;
				//var adjust=(document.getElementById("indexSliderDiv").offsetWidth/3)-document.getElementById("indexSliderDiv").offsetHeight;
				//canvasHeight=document.getElementById("indexSliderDiv").offsetHeight+adjust;
				p.resizeCanvas(canvasWidth,canvasHeight);
				var topLeft=Math.floor((canvasHeight/2)-25);
				//leftButton.style("top:"+topLeft+"px");
				var topRight=Math.floor((canvasHeight/2)-25);
				//rightButton.style("top:"+topRight+"px");
				//boxBlack.style("left",(canvasWidth/5).toFixed(0)+"px");
				//boxBlack.style("top",(canvasHeight/4).toFixed(0)+"px");
				//boxBlack.style("width",(((canvasWidth/5)*3)-60).toFixed(0)+"px");
				//boxBlack.style("height",((canvasHeight/2)-40).toFixed(0)+"px");
				//title.style("margin-top",(canvasHeight/8).toFixed(0)+"px");
				//title.style("margin-bottom",(canvasHeight/8).toFixed(0)+"px");
				//title.style("font-size",((canvasWidth*30)/1500).toFixed(0)+"px");
			}
			
		};
		
		
		
		
	}]);
	
}());
