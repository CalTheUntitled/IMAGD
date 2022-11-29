const clrTiles = [];
const BOARD_HEIGHT = 16;
const BOARD_WIDTH = 8;
const SQUARE_SIZE = 35;
var intTimeUntilNextDecent = 0;
var intPoints = 0;
var tetCurrent;

var blnLeftPressedLastFrame = false;
var blnRightPressedLastFrame = false;
var blnClockwisePressedLastFrame = false;
var blnCounterClockwisePressedLastFrame = false;
var blnGameStarted = false;
var blnGameOver = false;



function setup()
{
	intWidth = windowWidth;
	intHeight = windowHeight;
	
	if(intWidth < 400)//Canvas will always be at least 400x400, just in case you grade assignments in really small windows
		intWidth = 400;
	
	if(intHeight < 400)
		intHeight = 400;
		
	createCanvas(intWidth - 5, intHeight - 5);

	frameRate(50);
}


function windowResized()
{
	resizeCanvas(windowWidth - 5, windowHeight - 5);
}

function mouseClicked()//Use of mouseClicked()
{
	if(!blnGameStarted)
		startGame();
}

function startGame()
{
	blnGameStarted = true;
	blnGameOver = false;
	intPoints = 0;
	
	for(let intI = 0; intI < BOARD_WIDTH; intI++)
		clrTiles[intI] = Array(BOARD_HEIGHT).fill(null);
	
	tetCurrent = generateNewTetromino();
}

function draw()
{
	background(0);
	translate((windowWidth / 2) - SQUARE_SIZE * 4, 10); //Place board in center of window
	
	noFill();
	stroke(255);
	rect(-2, -2, SQUARE_SIZE * BOARD_WIDTH + 2, SQUARE_SIZE * BOARD_HEIGHT + 2);//Place board
	
	rect(-20 - SQUARE_SIZE * 6, -2, SQUARE_SIZE * 6, SQUARE_SIZE * 4);
	
	fill(255);
	
	textSize(20);
	
	text("Score: " + intPoints, SQUARE_SIZE * -6, SQUARE_SIZE * 1.5)
	
	if(!blnGameStarted)
	{
		textSize(25);
		
		if(blnGameOver == false)
		{
			text("Use arrow keys or asd for movement \nUse E and Q or space for rotation \nClick or press any key to start", 2, 2, SQUARE_SIZE * BOARD_WIDTH - 4, SQUARE_SIZE * BOARD_HEIGHT - 4);
		}else
		{
			text("Game over\nFinal score: " + intPoints +"\nClick or press any key to play again", 2, 2, SQUARE_SIZE * BOARD_WIDTH - 4, SQUARE_SIZE * BOARD_HEIGHT - 4);
		}
		
		if(keyIsPressed)//Use of keyIsPressed (which incorrectly has parentheses after it on the assingment page; only methods should have parentheses after them)
			startGame();
		
		return;
	}
	
	noStroke();
	for(let intI = 0; intI < clrTiles.length; intI++)//Draw placed tiles
	{
		for(let intJ = 0; intJ < BOARD_HEIGHT; intJ++)
		{
			if(clrTiles[intI][intJ] != null)
			{
				fill(clrTiles[intI][intJ]);
				square(intI * SQUARE_SIZE, (BOARD_HEIGHT - intJ - 1) * SQUARE_SIZE, SQUARE_SIZE - 2);
			}
		}
	}
	
	
	
	tetCurrent.drawSelf();//Draw tetromino
	
	//Test for left right and rotate buttons being pressed
	
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68))
	{
		if(!blnRightPressedLastFrame)
		{
			tetCurrent.moveTetrominoRight();
		}
		blnRightPressedLastFrame = true;
	}else
	{
		blnRightPressedLastFrame = false;
	}
	
	if(keyIsDown(LEFT_ARROW) || keyIsDown(65))//Move left (left arrow or A)
	{
		if(!blnLeftPressedLastFrame)
		{
			tetCurrent.moveTetrominoLeft();
		}
		blnLeftPressedLastFrame = true;
	}else
	{
		blnLeftPressedLastFrame = false;
	}
	
	if(keyIsDown(69) || keyIsDown(32))//rotate clockwise (E or space)
	{
		if(!blnClockwisePressedLastFrame)
		{
			tetCurrent.rotateClockwise();
		}
		blnClockwisePressedLastFrame = true;
	}else
	{
		blnClockwisePressedLastFrame = false;
	}
	
	if(keyIsDown(81))//rotate counterclockwise (Q)
	{
		if(!blnCounterClockwisePressedLastFrame)
		{
			tetCurrent.rotateCounterClockwise();
		}
		blnCounterClockwisePressedLastFrame = true;
	}else
	{
		blnCounterClockwisePressedLastFrame = false;
	}
	
	if(intTimeUntilNextDecent <= 0 || (intTimeUntilNextDecent <= frameRate() - (frameRate() / 35) && (keyIsDown(DOWN_ARROW) || keyIsDown(83))))
	{
		blnStillFalling = tetCurrent.decendTile();
		
		if(!blnStillFalling)
		{
			tetCurrent.placeSelf();
			

			intCompleteLines = 0;
			
			for(var intI = 0; intI < BOARD_HEIGHT; intI++)
			{
				var blnLineComplete = true;
				
				for(var intJ = 0; intJ < BOARD_WIDTH; intJ++)
				{
					if(clrTiles[intJ][intI] == null)
					{
						intJ = BOARD_WIDTH;
						blnLineComplete = false;
					}
				}
				
				if(blnLineComplete)
				{
					for(var intK = intI + 1; intK < BOARD_HEIGHT; intK++)//Copy all lines down, starting from the line above the completed line
					{
						for(var intJ = 0; intJ < BOARD_WIDTH; intJ++)
						{
							clrTiles[intJ][intK - 1] = clrTiles[intJ][intK];
						}
					}
					
					for(var intK = 0; intK < BOARD_WIDTH; intK++)//Clear top line
						clrTiles[intK][15] = null;
					
					intCompleteLines++;
					intI--;
				}
			}
			
			intPoints += Math.pow(intCompleteLines, 2) * 100;
			
			
			
			tetCurrent = generateNewTetromino();
			
		}
		
		intTimeUntilNextDecent = frameRate();
	}else
	{
		intTimeUntilNextDecent--;
	}
}

function tetromino(intXArray, intYArray, clrTileColor, intXCenter, intYCenter)
{
	this.intXs = intXArray;
	this.intYs = intYArray;
	this.clrColor = clrTileColor;
	this.intCenterX = intXCenter;
	this.intCenterY = intYCenter;
	
	this.decendTile = function()//Returns true if it decended, false if it couldn't
	{
		var blnStopped = false;
		
		for(let intI = 0; intI < 4; intI++)
		{
			if(this.intYs[intI] == 0)//Check if it will hit bottom
			{
				blnStopped = true;
			}else if(clrTiles[this.intXs[intI]][this.intYs[intI] - 1] != null)//Or another placed tile
			{
				blnStopped = true;
			}
		}
		
		if(!blnStopped)
		{
			for(let intI = 0; intI < 4; intI++)//Decend self
				this.intYs[intI]--;
				
			this.intCenterY -= 1;
			
			return true;
		}else
		{
			return false;
		}
	}
	
	this.placeSelf = function()
	{
		for(let intI = 0; intI < 4; intI++)
			clrTiles[this.intXs[intI]][this.intYs[intI]] = this.clrColor;
	}
	
	this.drawSelf = function()
	{
		fill(this.clrColor);
		
		for(let intI = 0; intI < 4; intI++)
			square(this.intXs[intI] * SQUARE_SIZE, (BOARD_HEIGHT - this.intYs[intI] - 1) * SQUARE_SIZE, SQUARE_SIZE - 2);
	}
	
	this.moveTetrominoRight = function()
	{
		blnCanMoveRight = true;
		for(let intI = 0; intI < 4; intI++)
		{
			if(this.intXs[intI] == BOARD_WIDTH - 1)
			{
				blnCanMoveRight = false;
				break;
			}
			
			if(clrTiles[this.intXs[intI] + 1][this.intYs[intI]] != null)
			{
				blnCanMoveRight = false;
				break;
			}
		}
		
		if(blnCanMoveRight)
		{
			for(let intI = 0; intI < 4; intI++)
				this.intXs[intI] += 1;
			this.intCenterX += 1;
		}
	}
	
	this.moveTetrominoLeft = function()
	{
		blnCanMoveLeft = true;
		for(let intI = 0; intI < 4; intI++)
		{
			if(this.intXs[intI] == 0)
			{
				blnCanMoveLeft = false;
				break;
			}
			
			if(clrTiles[this.intXs[intI] - 1][this.intYs[intI]] != null)
			{
				blnCanMoveLeft = false;
				break;
			}
		}
		
		if(blnCanMoveLeft)
		{
			for(let intI = 0; intI < 4; intI++)
				this.intXs[intI] -= 1;
			this.intCenterX -= 1;
		}
	}
	
	this.rotateClockwise = function()
	{
		if(this.intCenterX == -1 || this.intCenterY == -1)//Don't rotate squares
			return;
		
		for(let intI = 0; intI < 4; intI++)
		{
			if(this.intXs[intI] == this.intCenterX && this.intYs[intI] == this.intCenterY)//If tile is the center, do nothing to it
			{
				continue;
			}else
			{
				intXDifference = this.intXs[intI] - this.intCenterX;
				intYDifference = this.intYs[intI] - this.intCenterY;
				
				this.intXs[intI] = this.intCenterX + intYDifference;
				this.intYs[intI] = this.intCenterY - intXDifference;
				
				this.checkAndFixPlacement();
			}
		}
	}
	
	this.rotateCounterClockwise = function()
	{
		if(this.intCenterX == -1 || this.intCenterY == -1)//Don't rotate squares counterclockwise either
			return;
		
		for(let intI = 0; intI < 4; intI++)
		{
			if(this.intXs[intI] == this.intCenterX && this.intYs[intI] == this.intCenterY)//If tile is the center, do nothing to it
			{
				continue;
			}else
			{
				intXDifference = this.intXs[intI] - this.intCenterX;
				intYDifference = this.intYs[intI] - this.intCenterY;
				
				this.intXs[intI] = this.intCenterX - intYDifference;
				this.intYs[intI] = this.intCenterY + intXDifference;
			}
			
			this.checkAndFixPlacement();
		}
	}
	
	this.checkAndFixPlacement = function()//Checks if placement is valid (after rotating or placing) and fixes it if needed
	{
		blnValidPlacement = false;
		intLoopCount = 0;
		while(!blnValidPlacement && intLoopCount < 100)
		{
			blnValidPlacement = true;
			intLoopCount++;
			for(let intI = 0; intI < 4; intI++)
			{
				if(this.intXs[intI] >= BOARD_WIDTH)//If tetromino is out of bounds on the right
				{
					blnValidPlacement = false;
					for(let intJ = 0; intJ < 4; intJ++)
						this.intXs[intJ] -= 1;
					this.intCenterX -= 1;
					break;
				}
				
				if(this.intXs[intI] < 0)//If tetromino is out of bounds on left
				{
					blnValidPlacement = false;
					for(let intJ = 0; intJ < 4; intJ++)
						this.intXs[intJ] += 1;
					this.intCenterX += 1;
					break;
				}
				
				if(this.intYs[intI] < 0)//If tetromino is out of bounds on the bottom
				{
					blnValidPlacement = false;
					for(let intJ = 0; intJ < 4; intJ++)
						this.intYs[intJ] += 1;
					this.intCenterY += 1;
					break;
				}
				
				if(this.intYs[intI] >= BOARD_HEIGHT)//If tetromino is out of bounds on the top
				{
					blnValidPlacement = false;
					for(let intJ = 0; intJ < 4; intJ++)
						this.intYs[intJ] -= 1;
					this.intCenterY -= 1;
					break;
				}
				
				if(clrTiles[this.intXs[intI]][this.intYs[intI]] != null)//If tetromino overlaps with existing tiles
				{
					blnAlreadyAtTop = false;
					for(let intJ = 0; intJ < 4; intJ++)//Check if it's at the top of the board
					{
						if(this.intYs[intJ] == BOARD_HEIGHT - 1)
							blnAlreadyAtTop = true;
					}
					
					if(!blnAlreadyAtTop)//If it isn't, try moving up
					{
						blnValidPlacement = false;
						for(let intJ = 0; intJ < 4; intJ++)
							this.intYs[intJ] += 1;
						this.intCenterY += 1;
						break;
					}else if(intLoopCount < 50)//If already at the top of the board, try moving left
					{
						blnValidPlacement = false;
						for(let intJ = 0; intJ < 4; intJ++)
							this.intXs[intJ] -= 1;
						this.intCenterX -= 1;
						break;
					}else//If moving left didn't work, try moving right
					{
						blnValidPlacement = false;
						for(let intJ = 0; intJ < 4; intJ++)
							this.intXs[intJ] += 1;
						this.intCenterX += 1;
						break;
					}
				}
			}
			
		}
		
		if(intLoopCount >= 100)//If a valid spot can't be found, Game Over
		{
			blnGameOver = true;
			blnGameStarted = false;
			intTimeUntilNextDecent = frameRate();
		}
	}
}

function generateNewTetromino()
{
	intNext = Math.floor(Math.random() * 7);
	
	switch(intNext)
	{
		case 0://I Blue
			intXs = [2, 3, 4, 5];
			intYs = [15, 15, 15, 15];
			
			tetReturn = new tetromino(intXs, intYs, color(0, 0, 255), 4, 15);
			break;
		
		case 1://L Green
			intXs = [3, 4, 5, 5];
			intYs = [14, 14, 14, 15];
			
			tetReturn = new tetromino(intXs, intYs, color(0, 255, 0), 5, 14);
		
			break;
		
		case 2://J Red
			intXs = [3, 4, 5, 3];
			intYs = [14, 14, 14, 15];
			
			tetReturn = new tetromino(intXs, intYs, color(255, 0, 0), 4, 14);
		
			break;
		
		case 3://Square Yellow
			intXs = [4, 5, 4, 5];
			intYs = [14, 14, 15, 15];
			
			tetReturn = new tetromino(intXs, intYs, color(255, 255, 0), -1, -1);
			break;
		
		case 4://T Magenta
			intXs = [3, 4, 5, 4];
			intYs = [15, 15, 15, 14];
			
			tetReturn = new tetromino(intXs, intYs, color(255, 0, 255), 4, 15);
			break;
		
		case 5://Z Orange
			intXs = [3, 4, 4, 5];
			intYs = [15, 15, 14, 14];
			
			tetReturn = new tetromino(intXs, intYs, color(255, 150, 0), 4, 15);
			break;
		
		default://S Cyan
			intXs = [3, 4, 4, 5];
			intYs = [14, 14, 15, 15];
			
			tetReturn = new tetromino(intXs, intYs, color(0, 255, 255), 4, 14);
			break;
	}
	
	tetReturn.checkAndFixPlacement();
	
	return tetReturn;
}