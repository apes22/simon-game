//https://www.freecodecamp.com/challenges/build-a-simon-game
const WINNING_STEPS = 20;

//simonGame class
function simonGame(){
	//A variable to repreent whether the game is in strict mode
	this.strictMode = false;
	//A variable to hold the pattern
	this.pattern = [];
	//a variable to represent the position of the nexStepPosition
	this.nextStepPointer = 0;
	//A variable that represents steps that are in the current series of button presess
	//could be the length of the pattern array
	//a variable to represent whether the game has started
	this.isRunning = false;
	this.endOfCurrentSeries = false;
}

//A method to create a random button press
 simonGame.prototype.createNextStep = function(){
	var randomStep = Math.floor(Math.random()*4);
	this.pattern.push(randomStep);
	this.nextStepPointer = 0;
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
		this.nextStepPointer=0;
	}
	return false;
};

simonGame.prototype.setWrongMove = function(){
	this.nextStepPointer = 0;
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
		if (!model.game.isRunning){
			model.game.isRunning = true;
			console.log("startedGame!");
		this.addStep();
		}
	},
	addStep: function(){

		//disable button presses
		console.log("Buttons to press in order are", model.game.createNextStep());
		//The program wil present the current series of presses
		//show the new number of steps
		//enable button presses
	},
	//When the user presses a button, it will check that it is the correct next Step
	///If the user presses all of the correct button presses, then it will create add an additional button press.
	checkPress: function(buttonPres){
		var isPressCorrect = model.game.play(buttonPres);
		if (isPressCorrect){
			//check if the player completed the series of steps
			if (model.game.endOfCurrentSeries){
				//add additional step
				console.log("Who you completed the series of steps. Adding an additional step");
				//clear the pointer as well as the 
				return this.addStep();
			}
			console.log("Correct! Keep going!");
			return;
		}
		else{
		
			console.log("Wrong move. Try again");
			//Notify the user they pressed the wrong button 
			//repeat the series of button presses to remind the player of the patter
		}
		
	}
}

controller.initializeGame();

//Method needs:
//A method to check whether the series of button pressed
	// by the players matches the current pattern
	//