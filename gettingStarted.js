var myGame = new Kiwi.Game()
var myState = new Kiwi.State( "myState" )
var keyboard = $(document)
                  .asEventStream('keydown')
                  .map( (x)=>{return x.keyCode} )
keyboard.onValue((x) =>{control(x)})

//87 83 65 68
var control = function(x){
  if(x ==87){
    myState.action_array.push(action_up)
  }
  if(x ==83){
    myState.action_array.push(action_down)
  }
  if(x ==65){
    myState.action_array.push(action_left)
  }
  if(x ==68){
    myState.action_array.push(action_right)
  }
  console.log(x)
}
myState.preload = function(){
  Kiwi.State.prototype.preload.call(this);
  this.addImage( 'background', 'deepOcean.png', 1000, 1000 );
  this.addSpriteSheet( 'creatureSprite', 'creature-50_50.png', 50, 50 );

}

myState.create = function (){
  Kiwi.State.prototype.create.call( this );

  this.character = new Kiwi.GameObjects.Sprite( this, this.textures.creatureSprite, 350, 330 );
  this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.background, 0, 0 );

  this.character.animation.add( "face", [ 0 ], 0.1, false );

  this.character.animation.play( "face" );
  this.leftKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.A );
  this.rightKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.D );
  this.upKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.W );
  this.downKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.S );
  this.addChild( this.background );
  this.addChild( this.character );
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

/*
  this.action_array.forEach( (f)=>{f(this)} )

  this.action_array = []
  */
//=========================================================
}
myState.action_array = []

myGame.stage._width= 2000
myGame.stage._height= 2000
myGame.states.addState( myState );
myGame.states.switchState( "myState" );
console.log('done')


actinStack = []

var action_down = function(self){
  self.character.transform.y += 10
}
var action_up = function(self){
  self.character.transform.y -= 10
}
var action_right = function(self){
  self.character.transform.x += 10
}
var action_left = function(self){
  self.character.transform.x -= 10
}
//===================================
var sayHI = function(){
  console.log('say hi');
}
