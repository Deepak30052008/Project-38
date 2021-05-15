var dog,foodStock,database
var dogimage,happydogimage,sadDogimage
var feedFood,getFood,fedTime,lastFed,foodObj,milk
var foodR;
var foodS;
var changeState,readState
var bedroomimg,gardenimg,washroomimg
var playing=1;
var sleeping=2;
var bathing=3;
var Hungry=0;
var gameState=0;
function preload(){
 dogimage=loadImage("dogImg.png")
 happydogimage=loadImage("dogImg1.png")
 milk=loadImage("Milk.png")
 bedroomimg=loadImage("Bed Room.png")
 gardenimg=loadImage("Garden.png")
 washroomimg=loadImage("Wash Room.png")
 sadDogimage=loadImage("deadDog.png")
}

function setup() {
  database=firebase.database();
	createCanvas(1000, 500);

  foodObj=new Food()
  
 
  dog=createSprite(700,250,50,50)
  dog.scale=0.2
  dog.addImage(dogimage)
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock)
    readState=database.ref('gameState');
    readState.on("value",function(data){
gameState=data.val();
    })
  feed=createButton("feed the dog")
  feed.position(700,110)
  feed.mousePressed(feedDog)
 
  addfeed=createButton("add Food")
  addfeed.position(900,110)
  addfeed.mousePressed(addFood)

  
}

function draw() {  
background(46,138,89)
if(foodS===0){
dog.addImage(sadDogimage)

}

var play=createButton("Lets play")
play.position(300,110)
var bath=createButton("Lets bath")
bath.position(100,110)
var sleep=createButton("want to sleep")
sleep.position(500,110)
fill(255,255,254)
textSize(15)
lastFed = hour();
if(lastFed>=12){
text("Last Fed : "+lastFed%12+" PM",450,15)
}
else if(lastFed===0){
text("Last Fed : 12 AM",450,15)
}
else{
text("Last Fed : "+lastFed+" AM",450,15)
}
fill("black")
textSize(15)
text("x : "+mouseX,10,20);
text("y : "+mouseY,10,40);
var currentTime=hour();
if(currentTime===(lastFed+1)){
update("Playing")
foodObj.garden();
}else if(currentTime===(lastFed+2)){
update("Sleeping")
foodObj.bedroom();
}else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
update("Bathing")
foodObj.washroom();
}else{
  update("Hungry")
  foodObj.display();
}
  if(gameState!=="Hungry"){
feed.hide();
addfeed.hide();
dog.remove();
food=createButton("food")
food.position(400,110)
}
  drawSprites();

}
function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);


}

function writeStock(x){
  if (x<=0){x=0}
  else{x=x-1}
  database.ref('/').update({
    Food:x
  });
}
function feedDog(){
dog.addImage(happydogimage)
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
})
}
function addFood(){
foodS++;
database.ref('/').update({
  Food:foodS
})
}

function update(state){
database.ref('/').update({
  gameState:state
})
}