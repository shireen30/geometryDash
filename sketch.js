var PLAY = 1;
var END = 0;
var gameState = PLAY;

var block, blockImage;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3 ;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
 
  
  groundImage = loadImage("floor.png");
  blockImage = loadImage("cube.png")
 
  
  obstacle1 = loadImage("spike1.png");
  obstacle2 = loadImage("spike2.png");
  obstacle3 = loadImage("spike3.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
 
  
  ground = createSprite(200,100,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  block = createSprite(50,160,20,50);
  block.addImage(blockImage)

  block.scale = 0.1
  ;
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup()

  
  block.setCollider("rectangle",0,0,block.width,block.height);
  block.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& block.y >= 160) {
        block.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    block.velocityY = block.velocityY + 0.8
  
  
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(block)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
    
     
     
      ground.velocityX = 0;
      block.velocityY = 0
      if(mousePressedOver(restart)) {
        reset();
      }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     
   }
  
 
  //stop trex from falling down
  block.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  gameState=PLAY
  restart.visible=false
  gameOver.visible=false
obstaclesGroup.destroyEach()
score=0

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.27;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}



