//https://www.freecodecamp.com/challenges/build-a-simon-game
const WINNING_STEPS = 20;

//simonGame class
function simonGame(){
	this.pattern = [];
	this.strictMode = false;
	this.nextStepPointer = 0;
	this.gameON = false;
	this.endOfCurrentSeries = false;
	this.intervalID = "";
	this.timeoutID = "";
	this.isFinished = false;
}

//A method to create a random button press and returns the new series
simonGame.prototype.createNextStep = function(){
	var randomStep = Math.floor(Math.random()*4);
	this.pattern.push(randomStep);
	this.resetStepPointer();
	this.endOfCurrentSeries = false;
	return this.pattern;
};

simonGame.prototype.play = function(buttonPress){
	if (buttonPress == this.pattern[this.nextStepPointer]){
		this.nextStepPointer++;
		this.endOfCurrentSeries = (this.nextStepPointer == this.pattern.length) ? true : false;
		return true;
		//It was a bad press, so move pointer back to 0.
	}else{
		this.resetStepPointer();
	}
	return false;
};

simonGame.prototype.resetStepPointer = function(){
	this.nextStepPointer = 0;
};

simonGame.prototype.reset = function(){
	this.gameON = false;
	this.strictMode = false;
	this.restart();
};

simonGame.prototype.restart = function(){
	this.pattern = [];
	//this.gameStarted = false;
	this.endOfCurrentSeries = false;
	//this.strictMode = false;
	this.resetStepPointer();
};

simonGame.prototype.toggleStrictMode = function(){
	this.strictMode = !this.strictMode;
};

//model layer
var model = {
	game: {},
	setupGame: function(){
		this.game = new simonGame();
	}
};

//controller layer
var controller = {
	initializeGame: function(){
		model.setupGame();
	},
	toggleTurnON: function(){
		if (model.game.gameON){
			model.game.gameON  = false;
		  this.resetGame();
		  view.showCount("");
		  console.log(model.game.strictMode);
		  //model.game.strictMode = false;
		  view.showStrictMode(model.game.strictMode);
		}
		else{
			model.game.gameON  = true;
			view.showCount("--")
		}
	},
	resetGame: function(){
		clearInterval(model.game.intervalID);
		clearTimeout(model.game.timeoutID);
		view.resetOpacity();
		model.game.reset();
	
	},
	/**This will be restartGame**/
	startGame: function(){
		if (model.game.gameON){
			//instead of calling resetGame, we want to restartGame
			//model.game.restart();
			model.game.restart();
		  this.addStep();
	 }
	},
	toggleStrictMode: function(){
		if (model.game.gameON){
		model.game.toggleStrictMode();
		view.showStrictMode(model.game.strictMode);
	}
	},
	addStep: function(){
		if (model.isWinner){
			view.showCount("YOU WON!");
			model.game.timeoutID = setTimeout(function(){
				this.startGame();
			}.bind(this),1000);	
		}else{
		var updatedSteps = model.game.createNextStep();
		this.showSteps(updatedSteps);
		}
	},
	showSteps: function(steps){
		//disable button presses
		view.disableColorBtns();
		//The method wil present the current series of presses
			var i = 0;
			model.game.intervalID = setInterval(function(){
				if (i < steps.length){
					if (i==0){
					view.showCount(steps.length);
					}
					view.showStep(steps[i]);
					model.game.timeoutID = setTimeout(function(step){
							view.resetOpacity(step);
					},800, steps[i])
					i++;
				}else{
					clearInterval(model.game.intervalID);
					view.enableColorBtns();
				}	
			}.bind(this),900);
	},
	//When the user presses a button, it will check that it is the correct next Step
	///If the user presses all of the correct button presses, then it will create add an additional button press.
	checkPress: function(buttonPress){
		var isPressCorrect = model.game.play(buttonPress);

		if (isPressCorrect){
			//check if the player completed the series of steps
			if (model.game.endOfCurrentSeries){
				//add additional step
				//console.log("Wooo! You completed the series of steps. Adding an additional step");
				//clear the pointer as well as the 
				return this.addStep();
			}
			return	console.log("Correct! Keep going!");
		}
		else{
			if (model.game.strictMode){
				view.showWrongMove();
				//model.game.restart();
				//model.game.reset();
				this.startGame();
			}else{
				//Notify the user they pressed the wrong button by playing a noise
				//console.log("Wrong move. Try again");
				view.disableColorBtns();
				view.showWrongMove();
				model.game.timeoutID = setTimeout(function(){
								//repeat the series of button presses to remind the player of the patter
						this.showSteps(model.game.pattern);
				}.bind(this),1000);			
			}
		}
	}
};

var view = {
  setUpEventListeners: function(){
  	var colorBtns = document.getElementsByClassName('colored-btns')[0];
  	var buttonList = colorBtns.querySelectorAll("button");

  	for (var i = 0; i < buttonList.length; i++) {
  		buttonList[i].addEventListener("click", function(){
    		controller.checkPress(parseInt(this.value));
    		var mp3val = parseInt(this.value) + parseInt(1);
    		var snd = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound" + mp3val + ".mp3");
        snd.play();
     	});
  	}

  	var startBtn = document.getElementsByClassName('startBtn')[0];
  	var strictModeBtn = document.getElementsByClassName('strictModeBtn')[0];
  	var toogleON = document.getElementsByClassName('toggleON')[0];

  	startBtn.addEventListener("click", function(){
    		controller.startGame();
     });
  	
  	strictModeBtn.addEventListener("click", function(){
    		controller.toggleStrictMode();
    });

  	toogleON.addEventListener("click", function(){
    		controller.toggleTurnON();
     });
  },

  disableColorBtns: function(){
  	document.getElementsByClassName('colored-btns')[0].classList.add('disable-clicks');
  },
  enableColorBtns: function(){
  	document.getElementsByClassName('colored-btns')[0].classList.remove('disable-clicks')
  },
  showCount: function(count){
  	document.getElementById('count').innerHTML = count;
  },
  showWrongMove: function(){
  	document.getElementById('count').innerHTML = "!!";
  },
  hideWrongMove: function(){
  	//want it to blink twice and then show 
  	document.getElementById('count').innerHTML = "";
  },
  showStrictMode: function(flag){
  	if (flag == true){
  		document.getElementsByClassName('strictModeIndicator')[0].classList.add('led-on');
  	}else{
  		document.getElementsByClassName('strictModeIndicator')[0].classList.remove('led-on');
  	}
  },
  showStep: function(step){
  	var gameWell = document.getElementsByClassName('colored-btns')[0];
  	var buttonList = gameWell.querySelectorAll("button")
  	//this.resetOpacity(buttonList);
  	//highlight current corresponding button 
  	buttonList[step].classList.add('light');

  	var mp3val = parseInt(step) + parseInt(1);
    var snd = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound" + mp3val + ".mp3");
    snd.play();
  },
  resetOpacity: function(step){
  	//remove full opacity from buttons inside colored-btns
  	var colorBtns = document.getElementsByClassName('colored-btns')[0];
  	var buttonList = colorBtns.querySelectorAll("button");

  	for (var i =0; i<buttonList.length; i++){
  			buttonList[i].classList.remove('light');
  	}
  }
};

controller.initializeGame();
view.setUpEventListeners();