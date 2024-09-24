var hmet, deadHmet, parachuteHmet;
var score = 0;
var num;
var randY;
var highscore = 0;

function updateHighScore(newScore) {
	if (newScore > highscore) {
		highscore = newScore
		Telegram.WebApp.sendData(highscore, function (error, result) {
			if (error) {
				console.error('Failed to send leaderboard data:', error);
			} else {
				console.log('Leaderboard data successfully sent:', result);
			}
		});
	}
}

function setup() {
	lowerminusHeight = -height / 3;
	upperminusHeight = height / 4
	randY =
		createCanvas(windowWidth, windowHeight)
	textSize(25)
	hmetSizeX = windowWidth / 7;
	hmetSizeY = 100;
	hmet = loadImage("ahmet.png")
	bg = loadImage("bg.jpg")
	console.log(hmet)
	deadHmet = loadImage('hmet_dead.png')
	parachuteHmet = loadImage('parachute.png')
	ahmet3 = new Ahmet()
	ahmets = [];
	ahmets.push(ahmet3)
	num = 300;

}

function draw() {
	background(bg)
	fill(0, 255, 0)
	if (frameCount < 200) {
		text("Save Private Ahmet", 100, 100)
	}
	if (frameCount % num == 0) {
		if (score > 0) {
			lowerminusHeight -= 100
			upperminusHeight -= 100
			ahmets.push(new Ahmet());
			num += 200
		}
		else if (score == 0 && ahmets.length > 1) {
			ahmets.pop();
			num = 300;
		}
	}
	for (var ahmet = 0; ahmet < ahmets.length; ahmet++) {
		ahmets[ahmet].show()
	}
	text(score, 50, 50)
}

function mousePressed() {
	for (var ahmet of ahmets)
		if ((mouseX >= ahmet.x && mouseX <= ahmet.x + hmetSizeX) && (mouseY >= ahmet.y - 50 && mouseY <= ahmet.y + hmetSizeX)) {
			console.log("SAVED")
			if (ahmet.y > (height - 180)) {
				ahmet.v = 0.5;
				return
			}
			ahmet.parachute = 1;
		}
}
class Ahmet {
	constructor() {
		this.parachuteImg = parachuteHmet;
		this.deathImg = deadHmet;
		this.init()
	}
	init() {
		this.img = hmet
		this.g = 1;
		this.a = 0.2;
		this.v = 1;
		this.y = random(lowerminusHeight, upperminusHeight);
		this.parachute = 0;
		this.x = random(hmetSizeX, width - hmetSizeX);
		this.end = 0;
		this.rip = 0;
		this.earthOffset = random(50, 150)
	}
	isOnEarth() {
		return (this.y + hmetSizeX > height - this.earthOffset);
	}
	parachuteFall() {
		this.v = 1;
		this.parachuteAlive();
		this.y += this.v;
	}
	show() {
		if (this.isOnEarth()) {
			if (this.parachute && !this.end)
				this.alive()
			else {
				this.dead();
				this.end = 1;
			}
			if (frameCount % 30 == 0) {
				if (this.parachute && !this.end) {
					score++
					updateHighScore(score)  // Update leaderboard with new score
				}
				else {
					score = 0
					ahmets = [];
					ahmets.push(this);
					updateHighScore(score)  // Update leaderboard with reset score
				}
				this.init();
			}
			return;
		} else if (this.parachute) {
			this.parachuteFall();
		}
		this.freeFall();
	}
	freeFall() {
		this.alive()
		this.y += this.v
		this.v = this.v + this.a
	}
	dead() {
		image(this.deathImg, this.x, this.y, hmetSizeX, hmetSizeX);
	}
	parachuteAlive() {
		this.alive()
		image(this.parachuteImg, this.x, this.y - 25, hmetSizeX, hmetSizeX);
	}
	alive() {
		image(this.img, this.x, this.y, hmetSizeX, hmetSizeX);
	}
	setImg(img) {
		this.img = img;
	}
	setParachuteImg(img) {
		this.parachuteImg = img;
	}
	setDeathImg(img) {
		this.deathImg = img;
	}
}






