//Create variables here
var fedTime, lastFed, feedButton, fillButton, foodObj, foodS;

var gameState = "hungry";
var bedroom, washroom, garden;

function preload(){

  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/bedroom.png");
  garden = loadImage("images/garden.png");
  washroom = loadImage("images/washroom.png");
}

function setup() {
  database = firebase.database();
  createCanvas(700, 500);
  
  dog = createSprite(450,250,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  ground = createSprite(width/2,490,width,20);
  ground.visible = false;

  foodObj = new Food();

  feedButton = createButton("Feed dog");
  feedButton.position(800,100);
  feedButton.show();
  feedButton.mousePressed(feedDog);
  fillButton = createButton("Refill food");
  fillButton.position(900,100);
  fillButton.mousePressed(addFood);
  fillButton.hide();

  

}


function draw() {  
  background(46,139,87);

  foodObj.getFoodStock();




  fedTime = database.ref("feedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  })


  textSize(20);
  fill(255);

  if(lastFed > 12){
    text("Last Fed: " + lastFed%12 + " PM", 90,70);
  }else if (lastFed === 0){
    text("Last Fed: 12 AM", 90,70);
  }else if(lastFed === 12){
    text("Last Fed: 12 PM", 90,70)
  }else{
    text("Last Fed: " + lastFed + " AM", 90,70);
  }

  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  })
  
  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("playing");
    gameState = "playing"
    foodObj.garden();
    feedButton.hide();
    fillButton.hide();
    dog.scale = 0.000001;
  }
  if(currentTime == (lastFed + 2)){
    update("sleeping");
    gameState = "sleeping"
    foodObj.bedroom();
  }
  else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("bathing");
    gameState = "bathing"
    foodObj.washroom();
  }
  else{
    update("hungry");
    gameState = "hungry"
    foodObj.display();
  }

  if(gameState == "hungry"){
    feedButton.show();
    fillButton.show();
    foodObj.display();
  }
  else{
    feedButton.hide();
    fillButton.hide();
  } 
    
  dog.velocityY = dog.velocityY + 8;
  dog.collide(ground);
  drawSprites();
}

function addFood(){
  dog.addImage(dogImg);
  foodObj.updateFoodStock();
}

function feedDog(){
  dog.addImage(happyDogImg);
  dog.velocityY = -15;
  foodObj.deductFood();

  database.ref('/').update({
    feedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
  
}

