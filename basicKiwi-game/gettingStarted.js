var myGame = new Kiwi.Game()
var myState = new Kiwi.State( "myState" )
var Point = new Kiwi.Geom.Point(0,0)

var inputArray =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  inputArray.fill(0)
var visionArray = []




//======================================Input=======================================================
// [0],    [1],    [2],    [3],    [4],    [5],    [6],    [7],    [8],    [9],    [10],    [11],    [12],    [13],
//================================ //=======HitWall_chara==========//==============moves==============//===HP==

//define
var toRadians = 180/Math.PI

myState.preload = function(){
  Kiwi.State.prototype.preload.call(this);
  this.addImage( 'background', 'deepOcean.png', 1000, 1000 );
  this.addSpriteSheet( 'creatureSprite', 'creature-50_50.png', 50, 50 );
  this.addSpriteSheet( 'enemySprite', 'enemy-50_50.png', 50, 50 );
  this.addSpriteSheet( 'wall_verticle', 'wall.png', 50, 1000 );
  this.addSpriteSheet( 'wall_horizontal', 'wall.png', 1000, 50 );
  //this.addSpriteSheet( 'none', 'none.png', 1, 1 );
  this.addImage( 'wall', 'wall.png');

}

myState.create = function (){
  Kiwi.State.prototype.create.call( this );
  this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.background, 0, 0 );
  //===============characters===============
  //next thing must do: "add"
  //this.mainCharacter = new mainCharacter( this, 400, 330 );
  this.character = new spriteWithPhysics( this, this.textures.creatureSprite,300, 330 );
    this.character.thelabel = "main"
    this.character.geom = new Kiwi.Geom.Circle(this.character.x, this.character.y, 50)
    this.character.visionAngle = 0 //just for init
    this.character.visionLength = 1000
    this.character.checkingAngle = [0,45,90,135,180,225,270]
    this.character.geomLine = new Kiwi.Geom.Line(this.character.x, this.character.y,
                                                 this.character.x+(this.character.visionLength*Math.sin(this.character.visionAngle*toRadians)),
                                                 this.character.y+(this.character.visionLength*Math.cos(this.character.visionAngle*toRadians)))
    this.character.actions = []
    this.character.events = []
    this.character.HP = 100
    this.character.maxHP = 100




    //this.character.todo = checkCollide
  //this.characterVision = new Kiwi.Geom.Circle(100, 100, 10)
    //this.character.physics.velocity.setTo(5,5)
  this.enemy = new spriteWithPhysics( this, this.textures.enemySprite, 500, 500 );
    this.enemy.thelabel = "enemy"
    this.enemy.geom = new Kiwi.Geom.Rectangle(this.enemy.x,
                                              this.enemy.y,
                                              this.enemy.width,
                                              this.enemy.height)
  //==wallls
  this.wall1 = new spriteWithPhysics( this, this.textures.wall_verticle, 0, 0 );
    this.wall1.thelabel = "wall"
    this.wall1.action = hitedwall_x
    this.wall1.geom = new Kiwi.Geom.Rectangle(this.wall1.x,
                                              this.wall1.y,
                                              this.wall1.width,
                                              this.wall1.height)
    this.wall1.bound_y = 50


  this.wall2 = new spriteWithPhysics( this, this.textures.wall_horizontal, 0, 0 );
    this.wall2.action = hitedwall_y
    this.wall2.geom = new Kiwi.Geom.Rectangle(this.wall2.x,
                                              this.wall2.y,
                                              this.wall2.width,
                                              this.wall2.height)
    this.wall2.bound_x = 50



  this.wall3 = new spriteWithPhysics( this, this.textures.wall_verticle, 950, 0 );
    this.wall3.action = hitedwall_x
    this.wall3.geom = new Kiwi.Geom.Rectangle(this.wall3.x,
                                              this.wall3.y,
                                              this.wall3.width,
                                              this.wall3.height)
    this.wall3.bound_y = 950

    console.log(this.wall3.geom);
  this.wall4 = new spriteWithPhysics( this, this.textures.wall_horizontal, 0, 950 );
    this.wall4.action = hitedwall_y
    this.wall4.geom = new Kiwi.Geom.Rectangle(this.wall4.x,
                                              this.wall4.y,
                                              this.wall4.width,
                                              this.wall4.height)
    this.wall4.bound_x = 950

  this.trainer = trainer
  this.net = net
  this.net.aVol = new convnetjs.Vol(1,1,102,0.0);
  this.net.state = "idle"
  this.net.output =[]
  this.net.step = 0
  this.net.starvationTrain = ()=>{var theVector = getDirection_from_to(this.character, this.enemy);if(this.net.output[0]){console.log('theVector.x:'+theVector.x);
      this.trainer.train(net.output[0], [theVector.x, -theVector.x, -theVector.y, theVector.y]);}}//[theVector.x, -theVector.x, -theVector.y, theVector.y]


  //self-executable function

    var selfUpdate_stone = gemToStone_F(updateLoc,this.character)
    var decHP =  gemToStone_F(function(self){self.character.HP*=5;},this)
    var giveHPinfo = ()=>{inputArray[12]=this.character.HP/this.character.maxHP;}
  selfUpdate_stone = StoneThenStone(selfUpdate_stone, decHP, giveHPinfo)

  //==========stones==========
  //wall interact with others
    var hitWall1_stone = gemToStone_F(hitedwall_x, this.character, this.wall1, this.character)
      hitWall1_stone =  StoneThenStone(hitWall1_stone, ()=>{inputArray[4]=1;})
    var hitWall2_stone = gemToStone_F(hitedwall_y, this.character, this.wall2, this.character)
      hitWall2_stone =  StoneThenStone(hitWall2_stone, ()=>{inputArray[5]=1;})
    var hitWall3_stone = gemToStone_F(hitedwall_x, this.character, this.wall3, this.character)
      hitWall3_stone =  StoneThenStone(hitWall3_stone, ()=>{inputArray[6]=1;})
    var hitWall4_stone = gemToStone_F(hitedwall_y, this.character, this.wall4, this.character)
      hitWall4_stone =  StoneThenStone(hitWall4_stone, ()=>{inputArray[7]=1;})
    var checkHitWall1_stone = TopazMergeStone(hitWall1_stone, ()=>{var x;}, checkCollideForGeoms, this.character.geom, this.wall1.geom)
    var checkHitWall2_stone = TopazMergeStone(hitWall2_stone, ()=>{var x;}, checkCollideForGeoms, this.character.geom, this.wall2.geom)
    var checkHitWall3_stone = TopazMergeStone(hitWall3_stone, ()=>{var x;}, checkCollideForGeoms, this.character.geom, this.wall3.geom)
    var checkHitWall4_stone = TopazMergeStone(hitWall4_stone, ()=>{var x;}, checkCollideForGeoms, this.character.geom, this.wall4.geom)
  var characterHitWall = StoneThenStone(checkHitWall1_stone, checkHitWall2_stone, checkHitWall3_stone, checkHitWall4_stone)

 //character interact with others
      var indexA = 0
      var endingLengthA = this.character.checkingAngle.length-1
      var changeVisionAngle = () => {
                                      if(indexA== endingLengthA)indexA=-1
                                      indexA++;
                                      this.character.visionAngle = this.character.checkingAngle[indexA]

      }
      var checkHitWall1ForVision = TopazMergeStone(()=>{visionArray.push(Math.abs((this.character.y-this.wall1.bound_y)/this.character.visionLength));}, ()=>{visionArray.push(1)}, checkCollideForGeoms_lineRect,this.character.geomLine, this.wall1.geom)
      var checkHitWall2ForVision = TopazMergeStone(()=>{visionArray.push(Math.abs((this.character.x-this.wall2.bound_x)/this.character.visionLength));}, ()=>{visionArray.push(1)}, checkCollideForGeoms_lineRect,this.character.geomLine, this.wall2.geom)
      var checkHitWall3ForVision = TopazMergeStone(()=>{visionArray.push(Math.abs((this.character.y-this.wall3.bound_y)/this.character.visionLength));}, ()=>{visionArray.push(1)}, checkCollideForGeoms_lineRect,this.character.geomLine, this.wall3.geom)
      var checkHitWall4ForVision = TopazMergeStone(()=>{visionArray.push(Math.abs((this.character.x-this.wall4.bound_x)/this.character.visionLength));}, ()=>{visionArray.push(1)}, checkCollideForGeoms_lineRect,this.character.geomLine, this.wall4.geom)
      var checkHitEnemyForVision = TopazMergeStone(()=>{visionArray.push(Math.abs(((this.character.x-this.enemy.x)^2+(this.character.y-this.enemy.y)^2)/this.character.visionLength));}, ()=>{visionArray.push(0)}, checkCollideForGeoms_lineRect,this.character.geomLine, this.enemy.geom)
    var checkHitWallForVision_Group = StoneThenStone(changeVisionAngle, checkHitWall1ForVision, checkHitWall2ForVision, checkHitWall3ForVision, checkHitWall4ForVision,checkHitEnemyForVision)
  var characterSeeWall = WhileAndStone(()=>{if(indexA!=endingLengthA){return true;}return false;}, checkHitWallForVision_Group)
  characterSeeWall = StoneThenStone(()=>{visionArray =[];},checkHitWallForVision_Group, characterSeeWall)

  //enemy actions
    var enemyToOtherLoc = gemToStone_F(toOtherLoc, this, "enemy")
  var checkEnemyCollide_stone = TopazMergeStone(enemyToOtherLoc, ()=>{var x;}, checkCollideForGeoms, this.character.geom, this.enemy.geom)

  //move according to inputArray
    var moveDown  =  gemToStone_F(action_down, this.character, inputArray,8)
    var moveUp    =  gemToStone_F(action_up, this.character, inputArray,9)
    var moveLeft  =  gemToStone_F(action_left, this.character, inputArray,10)
    var moveRight =  gemToStone_F(action_right, this.character, inputArray,11)
    var checkTooFastA = gemToStone_F(checkTooFast,this.character)
  var moves = StoneThenStone(moveDown, moveUp, moveLeft, moveRight,checkTooFastA)


  this.character.actions.push(selfUpdate_stone)
  this.character.actions.push(characterHitWall)
  //this.character.actions.push(checkEnemyCollide_stone)
  this.character.actions.push(characterSeeWall)
  this.character.actions.push(moves)



  //================groupong================
  this.wallGroup = new Kiwi.Group(this);
  this.wallGroup.addChild(this.wall1)
  this.wallGroup.addChild(this.wall2)
  this.wallGroup.addChild(this.wall3)
  this.wallGroup.addChild(this.wall4)
  //===============animation===============
  this.character.animation.add( "face", [ 0 ], 0.1, false );
  this.character.animation.play( "face" );
  //===============controls===============
  this.leftKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.A );
  this.rightKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.D );
  this.upKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.W );
  this.downKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.S );
  //==============="add"===============
  this.addChild( this.background );
  this.addChild( this.character );
  this.addChild( this.enemy );
  this.addChild( this.wallGroup );
  console.log(this);
}

myState.update = function() {
  Kiwi.State.prototype.update.call(this);
  console.log("update");
  //console.log(inputArray);
//=========================================================
  //inputArray.fill(0)

  if ( this.downKey.isDown ) {
    action_down(this.character, 1)
  }
  if ( this.upKey.isDown ) {
    action_up(this.character, 1)

  }
  if ( this.leftKey.isDown ) {
    action_left(this.character, 1)

  }
  if ( this.rightKey.isDown ) {
    action_right(this.character, 1)

  }

  this.character.actions.forEach(x => {x();})


//==========Promise asyc============because it takes too much time.
if(this.net.state != "idle"){console.log("busy");}

if(this.net.state == "idle"){
  this.netPromise = new Promise(

    function(resolve, reject){
      this.net.state = "pending"
      var theArray = inputArray.concat(visionArray)

      if(this.net.step%10 == 0 && this.character.HP =< 10){
        for(var i=0;i<this.net.aVol.w.length;i++) {
          if( !theArray[i]){ theArray[i]=0}
          this.net.aVol.w[i] = theArray[i];
        }
        this.net.output.length = 0 //empty the array
        this.net.output.push(this.net.aVol)
        this.net.starvationTrain()
      }else {


        //if(theArray.length!=102){return -1}
        for(var i=0;i<this.net.aVol.w.length;i++) {
          if( !theArray[i]){ theArray[i]=0}
          this.net.aVol.w[i] = theArray[i];
        }

        this.y = this.net.forward(this.net.aVol)
        //console.log(this.y);//output
        if(!isNaN(this.y.w[0])){ // if we got a right output
          //console.log(this.y);//output


          inputArray[8]=this.y.w[0]
          inputArray[9]=this.y.w[1]
          inputArray[10]=this.y.w[2]
          inputArray[11]=this.y.w[3]
        }

        //
        //console.log("y" + inputArray);
      }

      //console.log("asyc starts")

      //console.log("pending")

      this.net.step++
      console.log("step: "+this.net.step);
      this.net.state = "idle"
      //console.log("idle")
    }
  );
}


//==========should be asyc============




}
//=========================================================

myGame.stage._width= 2000
myGame.stage._height= 2000
myGame.states.addState( myState );
myGame.states.switchState( "myState" );

//==========================extends=============================
var spriteWithPhysics = function (state, texture, x, y) {
  //==constructor
  Kiwi.GameObjects.Sprite.call( this, state, texture, x, y );

  this.physics = this.components.add( new Kiwi.Components.ArcadePhysics( this, this.box ) );
  this.physics.acceleration = new Kiwi.Geom.Point( 0, 0 );
	this.physics.velocity = new Kiwi.Geom.Point( 0, 0 );

}

Kiwi.extend( spriteWithPhysics, Kiwi.GameObjects.Sprite );


//==========================functions=============================
actinStack = []
var updateLoc = function(self){
    var x = self.x
    var y = self.y
    var lineLength = self.visionLength
    var lineAngle = self.visionAngle
    self.geom.setTo(x+25, y+25, 50)
    self.geomLine.setTo(x+25, y+25,x+25+lineLength*Math.sin(lineAngle*toRadians), y+25+lineLength*Math.cos(lineAngle*toRadians))
}
var destroy = function(self){
    self.destroy()
}
var remove_elementFromArray = function(array, element){
  var theIndex = array.indexOf(element)
  console.log(theIndex);
  array.splice(theIndex, 1)
}
var action_down = function(character, A,B){
  var amount = isNaN(A)?A[B]: A
  //if(amount<0.000001)amount=0
  if(isNaN(amount))amount = 0

  character.physics.velocity.add(new Kiwi.Geom.Point( amount, 0), character.physics.velocity)

}
var action_up = function(character, A,B){
  var amount = isNaN(A)?A[B]: A
  if(isNaN(amount))amount = 0
  //if(amount<0.000001)amount=0
  character.physics.velocity.add(new Kiwi.Geom.Point( -amount, 0), character.physics.velocity)
}
var action_right = function(character, A,B){
  var amount = isNaN(A)?A[B]: A
  //if(amount<0.000001)amount=0
  if(isNaN(amount))amount = 0
  character.physics.velocity.add(new Kiwi.Geom.Point(0, amount), character.physics.velocity)
}
var action_left = function(character, A,B){
  var amount = isNaN(A)?A[B]: A
  //if(amount<0.000001)amount=0
  if(isNaN(amount))amount = 0
  character.physics.velocity.add(new Kiwi.Geom.Point(0, -amount), character.physics.velocity)
}
var checkTooFast = function(character){
  if(character.physics.velocity.x>=50)character.physics.velocity.x>=49
  if(character.physics.velocity.x<=-50)character.physics.velocity.x<=-49
  if(character.physics.velocity.y>=50)character.physics.velocity.y>=49
  if(character.physics.velocity.y<=-50)character.physics.velocity.y<=-49
}
var action_stop_x = function(self){
  self.physics.velocity.x = 0
}
var action_stop_y = function(self){
  self.physics.velocity.y = 0
}
var hitedwall_x = function(self, A, B){
  action_stop_x(self)
  var sign = Math.sign ((A.x-B.x) >0)?1:-1
  B.transform.x += -1*sign
}
var hitedwall_y = function(self, A, B){
  action_stop_y(self)
  var sign = Math.sign ((A.y-B.y) >0)?1:-1
  B.transform.y += -1*sign
}
var getDirection_from_to = function(A, B){
  var x = (B.x-A.x)/1000
  var y = (B.y-A.y)/1000
  return {x, y}
}
var arrayToVol = function(array, length){
  if(!length)length= array.length
  var theVol = new convnetjs.Vol(1,1,length,0.0);
  for(var i=0;i<length;i++){
    theVol.w[i] = array[i]
  }
  return theVol;
}
//useless
var respawn = function(A, respawnDude){
  A = respawnDude
}
//useless
var addElement = function(self, name){
  console.log(self[name])
  var element= self[name]
  self.addChild(element)
  console.log(self)
  self[name].update.call( self );
}
//can this be generic?
var toOtherLoc = function(self, name){
  var newX = Math.floor(50+Math.random()*900)
  var newY = Math.floor(50+Math.random()*900)
  self[name].transform.x = newX
  self[name].transform.y = newY
  var tmp = self[name].geom.setTo(newX, newY, self[name].geom.width, self[name].geom.height)
}

//=============================================================
//  Is it good that I use factory to generate the two below
checkCollideForGeoms = function(){
  this.theArray = arguments
  var tmp = Kiwi.Geom.Intersect.circleToRectangle(this.theArray[0], this.theArray[1])
  if (tmp.result){
    //console.log(this.theArray[0]+" hit "+this.theArray[1]);
    return true
  }
  return false
}

checkCollideForGeoms_lineRect = function(){
  this.theArray = arguments
  var tmp = Kiwi.Geom.Intersect.lineSegmentToRectangle(this.theArray[0], this.theArray[1])
  if (tmp.result){
    //console.log(this.theArray[0]+" hit "+this.theArray[1]);
    return true
  }
  return false
}

// this factory "pin" the specific input to the function
  //and it use a "new" function to do it
checkCollideForCircle_F = function(){
  var theArguments = arguments
   return function(){
     this.theArguments = theArguments
     checkCollideForCircle.apply(this, this.theArguments)
   }
}

gemToStone_F = function(){
  var theArray =  Array.from(arguments)
  var f = theArray[0]
  theArray = theArray.slice(1, theArray.length)
   return function(){
     this.theArguments = theArray
     f.apply(this, this.theArguments)
   }
}

TopazMergeStone = function(){
  var theArray =  Array.from(arguments)
  var success = theArray[0]
  var fail = theArray[1]
  var topaz = theArray[2]
  theArray = theArray.slice(3, theArray.length)
   return function(){
     this.theArguments = theArray
     if(topaz.apply(this, this.theArguments)){success.apply()}
     else {
       fail.apply()
     }
   }
}
StoneThenStone = function(){
  var theArray =  Array.from(arguments)
   return function(){
     theArray.forEach(x=>{x();})
   }
}
WhileAndStone = function(){
  console.log("In");
  var theArray =  Array.from(arguments)
  var c = theArray[0]
  theArray = theArray.slice(1, theArray.length)
   return function(){
      while (c() == true) {
        theArray.forEach(x=>{x();})
      }
   }
}
