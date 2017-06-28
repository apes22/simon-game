//https://www.freecodecamp.com/challenges/build-a-simon-game
const WINNING_STEPS = 20;

//simonGame class
function simonGame(){
	//A variable to repreent whether the game is in strict mode
	this.strictMode = false;
	//A variable to hold the pattern
	this.pattern = [];
	//A variable that represents steps that are in the current series of button presess
	//could be the length of the pattern array
	//a variable to represent whether the game has started
	this.isRunning = false;
}

//A method to create a random button press
//returns a random number between min and max-1
 simonGame.prototype.createNextStep = function(min,max){
	var randomStep = Math.floor(Math.random() * (max - min)) + min;
	this.pattern.push(randomStep);
};

simonGame.prototype.play = function(){
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
		if (!model.game.isRunning){	
		}
	}
}

controller.initializeGame();

//Method needs:
//A method to check whether the series of button pressed
	// by the players matches the current pattern
	//