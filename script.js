var bal = {
  diameter: 40,
  straal: null,
  x: null,
  y: null,
  snelheidX: 8,
  snelheidY: 5,

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
    }
  },

  teken() {
    fill(255,255,255,1);
    ellipse(this.x,this.y,this.diameter);
  }
}
*
class Bom {
  constructor(sprite,stap, snelheid) {
    this.x = floor(random(0,raster.aantalKolommen))*raster.celGrootte;
    this.y = floor(random(0,raster.aantalRijen))*raster.celGrootte;
    this.sprite = sprite;
    this.stapGrootte = stap;
    this.snelheid = snelheid; //willekeurige snelheid
    this.zin = 1; //bepaald omhoog of omlaag
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
  
  beweeg() {
      this.y += this.snelheid * this.zin;
    //controleert of de bom de bovenkant of onderkant van het canvas bereikt
      if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
        //als de bom de bovenkant of onderkant van het canvas bereikt,
        this.zin *= -1; //verandert de richting van de beweging
    }
  }
}

  class rasterObject {
    constructor(sprite,stap, snelheid = 5) {
      this.x = floor(random(0 ,raster.aantalKolommen)) * raster.celGrootte;
      this.y = floor(random(0 ,raster.aantalRijen)) * raster.celGrootte;
      this.sprite = sprite;
      this.stapGrootte = stap;
      this.snelheid = snelheid; //willekeurige snelheid
      this.zin = 1; //bepaald omhoog of omlaag
    }

    toon() {
      image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
    }
    
  }

class Vijand {
  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
    }   
  }   

class Jos {
  constructor(sprite,stap) {
    super(sprite,stap)
    this.x = 0;
    this.gehaald = false;
    this.aanDeBeurt = true;
    this.staOpBom = false;
  }

  beweeg() {
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.aanDeBeurt = false;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.aanDeBeurt = false;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.aanDeBeurt = false;
    }


    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height-raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  staatOp(bommenLijst) {
    for (var b = 0;b < bommenLijst.length;b++) {
      if (bommenLijst[b].x == this.x && bommenLijst[b].y == this.y) {
        this.staOpBom = true;
      }
    }
    return this.staOpBom;
  } 
}

function preload() {
  bomPlaatje = loadImage("images/sprites/bom_100px.png");
  evePlaatje = loadImage("images/sprites/Eve100px/Eve_0.png");
  alicePlaatje = loadImage("images/sprites/Alice100px/Alice.png");
  bobPlaatje = loadImage("images/sprites/Bob100px/Bob.png");
}

var bommenArray = [];

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(8,12);
  raster.berekenCelGrootte();

  //HOEVEELHEID BOMMEN
  for (var b = 0;b < 10;b++) {
    bommenArray.push(new Bom(bomPlaatje,0)); //bom inplaats van rastervak
  }

  eve = new Jos(evePlaatje,raster.celGrootte);    
  alice = new Vijand(alicePlaatje,raster.celGrootte);
  bob = new Vijand(bobPlaatje,raster.celGrootte);
}

function draw() {
  background(250);
  
  raster.teken();

  bal.beweeg();
  bal.teken('red');
  
  for (var b = 0;b < bommenArray.length;b++) {
    bommenArray[b].beweeg(); //beweeg bom
    bommenArray[b].toon(); //toon bom
  
  }
  if (eve.aanDeBeurt) {
    eve.beweeg();
  } else {
    alice.beweeg();
    bob.beweeg();
    eve.aanDeBeurt = true;
  }  
  if (alice.x == bob.x && alice == bob.y) {
    bob.beweeg();
  }  
  eve.toon();
  alice.toon();
  bob.toon();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.staatOp(bommenArray)) {
    background('red');
    fill('white');
    text("Je hebt verloren!",30,300);
    noLoop();  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }
}

class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('blue')
    strokeWeight(8)
    for (var rij = 0;rij<this.aantalRijen;rij++) {
      for (var kolom = 0;kolom<this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}