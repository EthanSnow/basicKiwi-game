var myGame = new Kiwi.Game()
var myState = new Kiwi.State( "myState" )
var Point = new Kiwi.Geom.Point(0,0)


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
    this.character.geom = new Kiwi.Geom.Circle(this.character.x, this.character.y, 150)
    this.character.actions = []
    this.character.events = []
    this.character.angle = 0
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
  this.wall2 = new spriteWithPhysics( this, this.textures.wall_horizontal, 0, 0 );
    this.wall2.action = hitedwall_y
    this.wall2.geom = new Kiwi.Geom.Rectangle(this.wall2.x,
                                              this.wall2.y,
                                              this.wall2.width,
                                              this.wall2.height)
  this.wall3 = new spriteWithPhysics( this, this.textures.wall_verticle, 950, 0 );
    this.wall3.action = hitedwall_x
    this.wall3.geom = new Kiwi.Geom.Rectangle(this.wall3.x,
                                              this.wall3.y,
                                              this.wall3.width,
                                              this.wall3.height)
    console.log(this.wall3.geom);
  this.wall4 = new spriteWithPhysics( this, this.textures.wall_horizontal, 0, 950 );
    this.wall4.action = hitedwall_y
    this.wall4.geom = new Kiwi.Geom.Rectangle(this.wall4.x,
                                              this.wall4.y,
                                              this.wall4.width,
                                              this.wall4.height)
  //self-executable function
  var enemyToOtherLoc = gemToStone_F(toOtherLoc, this, "enemy")
  var hitWall1_stone = gemToStone_F(hitedwall_x, this.character, this.wall1, this.character)
    hitWall1_stone =  StoneThenStone(hitWall1_stone, ()=>{this.character.events.push(this.wall1.thelabel);})
    //then output info
  var hitWall2_stone = gemToStone_F(hitedwall_y, this.character, this.wall2, this.character)
  var hitWall3_stone = gemToStone_F(hitedwall_x, this.character, this.wall3, this.character)
  var hitWall4_stone = gemToStone_F(hitedwall_y, this.character, this.wall4, this.character)
  //==========stones==========
  var selfUpdate_stone = gemToStone_F(updateLoc,this.character)

  var checkHitWall1_stone = TopazMergeStone(hitWall1_stone, checkCollideForGeoms, this.character.geom, this.wall1.geom)
  var checkHitWall2_stone = TopazMergeStone(hitWall2_stone, checkCollideForGeoms, this.character.geom, this.wall2.geom)
  var checkHitWall3_stone = TopazMergeStone(hitWall3_stone, checkCollideForGeoms, this.character.geom, this.wall3.geom)
  var checkHitWall4_stone = TopazMergeStone(hitWall4_stone, checkCollideForGeoms, this.character.geom, this.wall4.geom)

  var checkEnemyHide_stone = TopazMergeStone(enemyToOtherLoc, checkCollideForGeoms, this.character.geom, this.enemy.geom)

  var characterHitThings = StoneThenStone(checkHitWall1_stone, checkHitWall2_stone, checkHitWall3_stone, checkHitWall4_stone)



  this.character.actions.push(selfUpdate_stone)
  this.character.actions.push(characterHitThings)
  this.character.actions.push(checkEnemyHide_stone)



  /*
  checkCollideForCircle.circle = this.character.geom
  console.log(checkCollideForCircle.circle);
  console.log(checkCollideForCircle.checkee);
  checkCollideForCircle.checkee = []
  checkCollideForCircle.checkee.push (this.wall1.geom)
  */

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
//=========================================================

  if ( this.downKey.isDown ) {
    action_down(this)
  }
  if ( this.upKey.isDown ) {
    action_up(this)
  }
  if ( this.leftKey.isDown ) {
    action_left(this)
  }
  if ( this.rightKey.isDown ) {
    action_right(this)
  }

  this.character.actions.forEach(x => {x();})

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
    self.geom.setTo(x+25, y+25, 50)
}
var destroy = function(self){
    self.destroy()
}
var remove_elementFromArray = function(array, element){
  var theIndex = array.indexOf(element)
  console.log(theIndex);
  array.splice(theIndex, 1)
}
var action_down = function(self){
  self.character.physics.velocity.add(new Kiwi.Geom.Point( 0, 1 ),self.character.physics.velocity)
}
var action_up = function(self){
  self.character.physics.velocity.add(new Kiwi.Geom.Point( 0, -1 ),self.character.physics.velocity)
}
var action_right = function(self){
  self.character.physics.velocity.add(new Kiwi.Geom.Point( 1, 0 ),self.character.physics.velocity)
}
var action_left = function(self){
  self.character.physics.velocity.add(new Kiwi.Geom.Point( -1, 0 ),self.character.physics.velocity)
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

checkCollideForGeoms = function(){
  this.theArray = arguments
  var tmp = Kiwi.Geom.Intersect.circleToRectangle(this.theArray[0], this.theArray[1])
  if (tmp.result){
    console.log(this.theArray[0]+" hit "+this.theArray[1]);
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
  var f = theArray[0]
  var topaz = theArray[1]
  theArray = theArray.slice(2, theArray.length)
   return function(){
     this.theArguments = theArray
     if(topaz.apply(this, this.theArguments))  f.apply()
   }
}
StoneThenStone = function(){
  var theArray =  Array.from(arguments)
   return function(){
     theArray.forEach(x=>{x();})
   }
}
