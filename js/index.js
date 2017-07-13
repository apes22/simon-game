//https://www.freecodecamp.com/challenges/build-a-simon-game
const WINNING_STEPS = 20;

//simonGame class
function simonGame(){
	this.pattern = [];
	this.strictMode = false;
	this.nextStepPointer = 0;
	this.gameStarted = false;
	this.endOfCurrentSeries = false;
	this.intervalID = "";
	this.timeoutID = "";
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
	this.pattern = [];
	this.gameStarted = false;
	this.endOfCurrentSeries = false;
	this.stirctMode = false;
	this.resetStepPointer();
};

simonGame.prototype.toggleStrictMode = function(){
	this.strictMode = !this.strictMode;
	console.log( this.strictMode);
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
	startGame: function(){
		if (!model.game.gameStarted){
			model.game.gameStarted = true;
			console.log("startedGame!");
			this.addStep();
		}
	},
	resetGame: function(){

		console.log("Resetting game.")

		clearInterval(model.game.intervalID);
		clearTimeout(model.game.timeoutID);
		view.showCount("--");
		model.game.reset();
		this.startGame();
	},
	toggleStrictMode: function(){
		model.game.toggleStrictMode();
	},
	addStep: function(){
		var updatedSteps = model.game.createNextStep();
		
		this.showSteps(updatedSteps);
		
	},
	showSteps: function(steps){
		//disable button presses
		view.disableColorBtns();
		
		console.log("Buttons to press in order are", steps);
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
			}.bind(this),1000);
		console.log("Current number of steps: ", model.game.pattern.length);
	},
	//When the user presses a button, it will check that it is the correct next Step
	///If the user presses all of the correct button presses, then it will create add an additional button press.
	checkPress: function(buttonPress){
		var isPressCorrect = model.game.play(buttonPress);

		if (isPressCorrect){
			//check if the player completed the series of steps
			if (model.game.endOfCurrentSeries){
				//add additional step
				console.log("Wooo! You completed the series of steps. Adding an additional step");
				//clear the pointer as well as the 
				return this.addStep();
			}
			return	console.log("Correct! Keep going!");
		}
		else{
			if (model.game.strictMode){
				model.game.reset();
				console.log("Wrong move :( Restarting game with a single step");
				this.startGame();
			}else{
				//Notify the user they pressed the wrong button by playing a noise
				console.log("Wrong move. Try again");
				view.disableColorBtns();
				view.showWrongMove();
				//view.hideWrongMove();
				var t2 = setTimeout(function(){
								view.showWrongMove();
								//repeat the series of button presses to remind the player of the patter
								this.showSteps(model.game.pattern);
				}.bind(this),800);			
			}
		}
	}
};

var view = {
  setUpEventListeners: function(){
  	var colorBtns = document.getElementsByClassName('colored-btns')[0];
  	var buttonList = colorBtns.querySelectorAll("button");


  	for (var i = 0; i < buttonList.length; i++) {
  		console.log(buttonList[i]);
  		console.dir(buttonList[i])
  		buttonList[i].addEventListener("click", function(){
    		controller.checkPress(parseInt(this.value));
    		//this.classList.add("light");
    		var mp3val = parseInt(this.value) + parseInt(1);
    		var snd = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound" + mp3val + ".mp3");
        snd.play();
     	});
  	}

  	var startBtn = document.getElementsByClassName('startBtn')[0];
  	var toggleStrictMode = document.getElementsByClassName('toggleStrictMode')[0];
  	var resetBtn = document.getElementsByClassName('resetBtn')[0];

  	startBtn.addEventListener("click", function(){
    		controller.startGame();
     });
  	
  	toggleStrictMode.addEventListener("click", function(){
    		controller.toggleStrictMode();
    });

  	resetBtn.addEventListener("click", function(){
    		controller.resetGame();
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
  	document.getElementsByClassName('game-well')[0].classList.add('shake-vertical');
  	//want it to blink twice and then show 
  	document.getElementById('count').innerHTML = "!!";
  },
  hideWrongMove: function(){
  	//want it to blink twice and then show 
  	document.getElementById('count').innerHTML = "";
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