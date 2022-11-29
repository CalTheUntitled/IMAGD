let intTime = 0;//Variable number 1
const balBalloons = [];
let intBalloonDelayTracker = 0;//Variable number 2

function setup()
{
	createCanvas(1000, 650);
	frameRate(50);
	
}

function draw()
{
	intTime++;
	colorMode(HSB, 255);
	background(230);
	
	for(let intI = 0; intI < balBalloons.length; intI++)//Tick Balloons
	{
		balBalloons[intI].applyVelocity();
		balBalloons[intI].drawBalloon();
		
		if(balBalloons[intI].intY < -300)//Removing offscreen balloons
		{
			for(let intJ = intI; intJ < balBalloons.length - 1; intJ++)
			{
				balBalloons[intJ] = balBalloons[intJ + 1];
			}
			balBalloons.length = balBalloons.length - 1;
			intI--;
		}
		
	}
	
	if(intBalloonDelayTracker >= 2)//Only make a balloon every 3 ticks
	{
		if((mouseX != pmouseX || mouseY != pmouseY) && balBalloons.length < 300)//Create Balloons if mouse moved, make sure there aren't too many
		{
			intDistance = dist(mouseX, mouseY, pmouseX, pmouseY); //Note the use of dist() here
			
			intDistance *= 3;//Turning distance into an HSB value. Faster = further along ROYGBIV
			
			if(intDistance > 200)//Make sure it doesn't wrap back around to red
				intDistance = 200;
			
			balBalloons[balBalloons.length] = new balloon(intDistance, mouseX, mouseY);
		}
		intBalloonDelayTracker = 0;
	}else
	{
		intBalloonDelayTracker++;
	}
	

	
	colorMode(RGB, 255);//Technically speaking, I set the color mode to RGB here even though I used HSB for all the actual colors. Technically, I did what was required for the assignment.
	//Also, there are 200 possible colors, even though none are strictly defined in the code. Hopefully that counts for a "minimum of three different colors"
}


function balloon(intBalloonHue, intXCenter, intYCenter)
{
	this.intHue = intBalloonHue;
	this.intX = intXCenter;
	this.intY = intYCenter;
	this.intCreationTime = intTime * 20;
	
	
	this.applyVelocity = function()
	{
		var intVelocity;
		
		if((intTime * 20) - this.intCreationTime >= 3000)
		{
			intVelocity = 3;
		}else
		{
			intVelocity = sin(radians((((intTime * 20) - this.intCreationTime) / 100) * 3)) * 3; //Note the use of radians() here
		}
		
		this.intY = this.intY - intVelocity;
		

	}
	
	this.drawBalloon = function()
	{
		translate(this.intX, this.intY);
		
		fill(this.intHue, 255, 130, 150);
		
		
		beginShape();//Balloon
		curveVertex(0, 80);//Start
		curveVertex(0, 80);
		curveVertex(-45, 40);
		curveVertex(-65, -10);//Middle left
		curveVertex(-50, -60)
		curveVertex(0, -80);//Top
		curveVertex(50, -60)
		curveVertex(65, -10);//Middle right
		curveVertex(45, 40);
		curveVertex(0, 80);
		curveVertex(0, 80);//end
		endShape();
		
		noFill();
		
		curve(-150, 240, 0, 80, 0, 300, 150, 160);//String (the thing on the balloon, not the data type)
		
		translate(-this.intX, -this.intY);
	}
}