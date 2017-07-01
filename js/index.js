//https://www.freecodecamp.com/challenges/build-a-simon-game
const WINNING_STEPS = 20;

//simonGame class
function simonGame(){
	this.pattern = [];
	this.strictMode = false;
	this.nextStepPointer = 0;
	this.gameStarted = false;
	this.endOfCurrentSeries = false;
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
	//When someone presses a start button, the program to create a button press
	startGame: function(){
		if (!model.game.gameStarted){
			model.game.gameStarted = true;
			console.log("startedGame!");
			this.addStep();
		}
	},
	toggleStrictMode: function(){
		model.game.toggleStrictMode();
	},
	resetGame: function(){
		console.log("Resetting game.")
		model.game.reset();
		this.startGame();

	},
	addStep: function(){
		//disable button presses
		view.disableGameWell();
		console.log("Buttons to press in order are", model.game.createNextStep());
		console.log("Current number of steps: ", model.game.pattern.length);
		//The program wil present the current series of presses
		//show the new number of steps
		//enable button presses
		view.enableGameWell();
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
				console.log("Wrong move. Try again");
			//Notify the user they pressed the wrong button 
			//repeat the series of button presses to remind the player of the patter
			}
		}
	}
};

var view = {
  setUpEventListeners: function(){
  	var gameWell = document.getElementsByClassName('game-well')[0];
  	var buttonList = gameWell.querySelectorAll("button")

  	for (var i = 0; i < buttonList.length; i++) {
  		buttonList[i].addEventListener("click", function(){
    		controller.checkPress(parseInt(this.value));
     	});
  	
  		buttonList[i].addEventListener("mouseover", function(){
    		this.style.opacity = 1.0;
     	});

  		buttonList[i].addEventListener("mouseleave", function(){
    		this.style.opacity = 0.8;
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

  disableGameWell: function(){
  	document.getElementsByClassName('game-well')[0].classList.add('disable-events')
  },
  enableGameWell: function(){
  	document.getElementsByClassName('game-well')[0].classList.remove('disable-events')
  },

};
controller.initializeGame();
view.setUpEventListeners();