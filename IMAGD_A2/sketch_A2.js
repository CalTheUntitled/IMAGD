
let intTime = 0;
const BALLOON_HOVER_AMOUNT = 10;
const balBalloons = [];

function setup()
{
	createCanvas(1000, 650);
	
	for(let intI = 0; intI < 50; intI++)//Technically speaking, because balloons are randomly distributed, they will be, on avarage, balanced
	{
		balBalloons[intI] = new balloon(Math.random() * 255, Math.random() * 255,
		Math.random() * 255, 150, Math.random() * 1000, Math.random() * 650, Math.random() * 5000, (Math.random() / 4) + 0.75);
	}
	
}


function draw()
{
	intTime = millis();
	
	strokeWeight(1);
	
	background(230);
	
	
	colorMode(RGB, 255); //Actually pointless, same as default
	
	
	for(let intI = 0; intI < balBalloons.length; intI++)
		balBalloons[intI].drawBalloon();
	
}

function balloon(intRed, intGreen, intBlue, intAlpha, intXCenter, intYCenter, intTimeOffset, intScale)
{
	this.intR = intRed;
	this.intG = intGreen;
	this.intB = intBlue;
	this.intA = intAlpha;
	this.intX = intXCenter;
	this.intY = intYCenter;
	this.intOffset = intTimeOffset;
	this.intSize = intScale;
	
	this.drawBalloon = function()
	{
		translate(this.intX, this.intY);
		
		
		intSimpleTime = (intTime + this.intOffset) % 5000;

		intSimpleTime = intSimpleTime / 5000;
		intSimpleTime = intSimpleTime * Math.PI * 2;

		translate(0, Math.sin(intSimpleTime) * BALLOON_HOVER_AMOUNT);
		
		scale(this.intSize);
		
		fill(this.intR, this.intG, this.intB, this.intA);
		
		
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
		
		fill(0, 0, 0, 0); //For some reason, calling noFill() was causing the curve to not render at all, but this works
		
		curve(-150, 240, 0, 80, 0, 300, 150, 160);//String
		
		scale(1 / this.intSize);
		translate(0, -Math.sin(intSimpleTime) * BALLOON_HOVER_AMOUNT);
		translate(-this.intX, -this.intY);
	}
}