import Fighter from './Fighter';
import { TILE, ACTION, SOUND } from '../Constants';
import GameState from "../ui/GameState";
import { KID_INMORTAL } from '../Config';
import { convertBlockXtoX, convertBlockYtoY, convertXtoBlockX, convertX, distanceToEdgeFromX } from '../Utils';
// Import jaxpi
import jaxpi from '../../main';

const MAX_GRAB_FALLING_SPEED = 32;

class Kid extends Fighter {

    constructor(scene, level, location, direction, room) {

        super(scene, level, location, direction, room, 'kid');

        this.scene = scene;
        
        this.fallingBlocks = 0;
        
        this.pickupSword = false;
        this.pickupPotion = false;
        
        this.allowCrawl = true;
        this.inJumpUP = false;
        this.charRepeat = false;
        this.recoverCrop = false;

        this.specialLand = false;
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.ZKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.AKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.SKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        this.registerCommand(0xFD,this.CMD_UP);
        this.registerCommand(0xFC,this.CMD_DOWN);
        this.registerCommand(0xF8,this.CMD_SETFALL);
        this.registerCommand(0xF7,this.CMD_IFWTLESS);
        this.registerCommand(0xF5,this.CMD_JARU);
        this.registerCommand(0xF4,this.CMD_JARD);
        this.registerCommand(0xF3,this.CMD_EFFECT);
        this.registerCommand(0xF1,this.CMD_NEXTLEVEL);
        
        this.maxHealth = GameState.kidMaxHealth;
        this.health = GameState.kidHealth;
        
        this.hasSword = GameState.kidHasSword;
        this.flee = false;
        
        this.allowAdvance = true;
        this.allowRetreat = true;
        this.allowBlock = true;
        this.allowStrike = true;

    }

    CMD_UP() {
    
        if (this.charBlockY == 0) {
                
            this.charY += 189;
            this.baseY -= 189;
            this.charBlockY = 2;
            this.room = this.level.rooms[this.room].links.up;
            this.emit('changeroom', this.room);
    
        }
        
    }
    
    CMD_DOWN() {
        
        if (this.charBlockY > 2) {
                
            this.charY -= 189;
            this.baseY += 189;
            this.charBlockY = 0;
            this.room = this.level.rooms[this.room].links.down;
            this.emit('changeroom', this.room);
    
        } 
        
    }
    
    CMD_SETFALL(data) {
        
        this.charXVel = data.p1 * this.charFace;
        this.charYVel = data.p2;
        
    }
    
    CMD_IFWTLESS() {
        
    }

    CMD_TAP() {
        
        this.scene.requestSoundPlay(SOUND.FOOTSTEP);
        
    }
    
    CMD_EFFECT() {
        if (this.getAction() == 'pickupsword') {
            this.scene.swordFlash();
            this.scene.sound.playAudioSprite('music','10-victory-2');
        }
        if (this.getAction() == 'drinkpotion') {
            this.scene.potionFlash();
            this.scene.sound.playAudioSprite('music','08-potion-1');
            this.recoverLive();
        }
    }
    
    CMD_JARU() {
        
        this.level.shakeFloor(this.charBlockY - 1, this.room);
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY - 1,this.room);
        if (tile.tileType == TILE.LOOSE_BOARD) tile.shake(true);
        
    }
    
    CMD_JARD() {
        
        this.level.shakeFloor(this.charBlockY, this.room);
        
    }
    
    CMD_NEXTLEVEL() {
        
        this.emit('nextlevel');
        
    }
    
    /*followOponent() {
        
        if (this.opponent != null) {
            
            this.opponent.following = true;
            
        }
        
    };*/
    
    recoverLive() {
        
        if (this.health < this.maxHealth) {
            
            this.health++;
            this.emit('updatehealth');
            
        }
        
    }
    
    
    addLive() {
        
        this.maxHealth++;
        this.emit('updatehealth');
        
    }
    
    
    updateActor() {
        
        this.updateBehaviour();
        this.processCommand();
        this.updateAcceleration();
        this.updateVelocity();
        this.checkFight();
        this.checkSpikes();
        this.checkChoppers();
        this.checkBarrier();
        this.checkFloor();
        this.checkRoomChange();
        this.updateCharPosition();
        this.updateSwordPosition();
        this.updateSplashPosition();
        this.maskAndCrop();
        
    }
    
    drinkPotion() {

        jaxpi.used(true).item("potion")
        
        this.setAction('drinkpotion');
        this.pickupPotion = false;
        this.allowCrawl = true;
        this.level.removeObject(this.charBlockX + this.charFace, this.charBlockY, this.room);
        
    }
    
    gotSword() {

        jaxpi.equipped().item("sword")
        
        this.setAction('pickupsword');
        this.pickupSword = false;
        this.allowCrawl = true;
        this.level.removeObject(this.charBlockX + this.charFace, this.charBlockY, this.room);
        this.hasSword = true;
        
    }
    
    updateBehaviour() {
        
        if ( !this.keyL() && this.faceL() ) this.allowCrawl = this.allowAdvance = true;
        if ( !this.keyR() && this.faceR() ) this.allowCrawl = this.allowAdvance = true;
        if ( !this.keyL() && this.faceR() ) this.allowRetreat = true;
        if ( !this.keyR() && this.faceL() ) this.allowRetreat = true;
        if ( !this.keyU() ) this.allowBlock = true;
        if ( !this.keyS() ) this.allowStrike = true;
        
        switch (this.getAction()) {
        
            case 'stand':
                if ( !this.flee && this.canEngarde() ) return this.engarde(); 
                if ( this.flee && this.keyS() && this.canEngarde() ) return this.engarde();
                if ( this.keyL() && this.faceR() ) return this.turn();
                if ( this.keyR() && this.faceL() ) return this.turn();
                if ( this.keyL() && this.keyU() && this.faceL() ) return this.standjump();
                if ( this.keyR() && this.keyU() && this.faceR() ) return this.standjump();
                if ( this.keyL() && this.keyS() && this.faceL() ) return this.step();
                if ( this.keyR() && this.keyS() && this.faceR() ) return this.step();
                if ( this.keyL() && this.faceL() ) return this.startrun();
                if ( this.keyR() && this.faceR() ) return this.startrun();
                if ( this.keyU() ) return this.jump();
                if ( this.keyD() ) return this.stoop();
                if ( this.keyS() ) return this.tryPickup();
                break;
            
            case 'startrun':
                if ( this.keyU() ) return this.standjump();
                break;
            
            case 'running':
                if ( this.keyL() && this.faceR() ) return this.runturn();
                if ( this.keyR() && this.faceL() ) return this.runturn();
                if ( !this.keyL() && this.faceL() ) return this.runstop();
                if ( !this.keyR() && this.faceR() ) return this.runstop();
                if ( this.keyU() ) return this.runjump();
                if ( this.keyD() ) return this.rdiveroll();
                break;
            
            case 'turn':
                if ( this.keyL() && this.faceL() && this.frameID(48) ) return this.turnrun();
                if ( this.keyR() && this.faceR() && this.frameID(48) ) return this.turnrun();
                break;
            
            case 'stoop':
                if ( this.pickupSword && this.frameID(109) ) return this.gotSword();
                if ( this.pickupPotion && this.frameID(109) ) return this.drinkPotion();
                if ( !this.keyD() && this.frameID(109) ) return this.standup();
                if ( this.keyL() && this.faceL() && this.allowCrawl ) return this.crawl();
                if ( this.keyR() && this.faceR() && this.allowCrawl ) return this.crawl();
                break;
            
            case 'hang':
                var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
                if ( tile.tileType == TILE.WALL ) { this.setAction('hangstraight'); }
            case 'hangstraight':
                if ( this.keyU() ) return this.climbup();
                if ( !this.keyS() ) return this.startFall();
                break;
            
            case 'jumpfall':
            case 'rjumpfall':
            case 'bumpfall':
                if ( this.keyS() ) return this.tryGrabEdge();
                break;

            case 'freefall':
                if ( this.keyS() ) return this.tryGrabEdge();
                break;
            
            case 'engarde':
                if ( this.keyL() && this.faceL() && this.allowAdvance ) return this.advance();
                if ( this.keyR() && this.faceR() && this.allowAdvance ) return this.advance();
                if ( this.keyL() && this.faceR() && this.allowRetreat ) return this.retreat();
                if ( this.keyR() && this.faceL() && this.allowRetreat ) return this.retreat();
                if ( this.keyU() && this.allowBlock ) return this.block();
                if ( this.keyS() && this.allowStrike ) return this.strike();
                if ( this.keyD() ) return this.fastsheathe();
                break;
            
            case 'advance':
            case 'blockedstrike':
                if ( this.keyU() && this.allowBlock ) return this.block();
                break;
            
            case 'retreat':
            case 'strike':
            case 'block':
                if ( this.keyS() && this.allowStrike ) return this.strike();
                break;
                
        }
        
    }
    
    checkSpikes() {
        
        if ( this.distanceToEdge() < 5 )
        {
            this.trySpikes(this.charBlockX + this.charFace, this.charBlockY);
        }
        this.trySpikes(this.charBlockX, this.charBlockY);
    }
    
    checkChoppers() {
        
        
        this.level.activateChopper(-1,this.charBlockY,this.room);
        
        
    }
    
    tryEngarde() {
     
        console.log('try_engarde!!');
        if (!this.hasSword) return;
        if (this.opponent.alive && ( this.opponentDistance() < 90 ) ) {
            
            this.engarde();
            this.flee = false;
            
        }
        
    }

    canEngarde() {
     
        return this.hasSword && this.opponent && this.opponent.alive && (this.opponentDistance() < 90 );
        
    }
    
    trySpikes(x,y) {
        
        while (y < 3)
        {
            var tile = this.level.getTileAt(x, y,this.room);
            if (tile.tileType == TILE.SPIKES) { tile.raise(); }
            if (tile.tileType != TILE.SPACE) { return; }
            //if (this.getAction() == 'standjump' ) console.log((this.charBlockX + this.charFace) + ' ' + y);
            y++;
    
        }
    
    }
    
    tryGrabEdge() {

        this.updateBlockXY();
        if (this.charYVel > MAX_GRAB_FALLING_SPEED) return;

        //const blockX = convertXtoBlockX(this.charX - 8 * this.charFace);

        if (this.distanceToEdge() > 8 + ((this.getAction() == 'stepfall') ? 3 : 0)) return;
        if ((this.actionCode == ACTION.IN_MIDAIR) && (this.distanceToTopFloor() < -50)) return;
        if ((this.actionCode == ACTION.FREE_FALL) && (this.distanceToFloor() <= -3)) return;

        var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
        var tileTF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room);
        var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);

        if (tileTF.isWalkable() && tileT.isSpace()) {
            this.grab(this.charBlockX);
        } else {
            if (tileT.isWalkable() && tileTR.isSpace()) {
                this.grab(this.charBlockX - this.charFace);
            }
        }
        
    }
    
    grab(x) {
        
        if (this.faceL()) {
            this.charX = convertBlockXtoX(x) - 2;
        } else {
            this.charX = convertBlockXtoX(x + 1) + 2;  
        }
        this.charY = convertBlockYtoY(this.charBlockY);
        this.charXVel = 0;
        this.charYVel = 0;
        this.fallingBlocks = 0;
        this.updateBlockXY();
        this.setAction('hang');
        this.processCommand();
        this.scene.requestSoundPlay(SOUND.GRAB);
        
    }
    
    nearBarrier() {
      
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
        
        return ( ( tileF.tileType == TILE.WALL ) || 
               ( ( tileF.tileType == TILE.GATE ) && this.faceL() && !tileF.canCross(this.height) ) ||
               ( ( tile.tileType == TILE.GATE ) && this.faceR() && !tile.canCross(this.height) ) ||
               ( ( tile.tileType == TILE.TAPESTRY ) && this.faceR() ) ||
               ( ( tileF.tileType == TILE.TAPESTRY ) && this.faceL() ) ||
               ( ( tileF.tileType == TILE.TAPESTRY_TOP ) && this.faceL() ) );
        
    }
    
    checkBarrier() {
        
        if ( this.getAction() == 'jumphanglong') return;
        if ( this.getAction() == 'climbup' ) return;
        if ( this.getAction() == 'climbdown' ) return;
        if ( this.getAction() == 'climbfail' ) return;
        //if ( this.getAction() == 'stand' ) return;
        if ( this.getAction() == 'turn' ) return;
        if ( this.getAction().substring(0,4) == 'step' ) return;
        if ( this.getAction().substring(0,4) == 'hang' ) return;

        super.checkBarrier();
    
        var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
        
        if ( ( this.getAction() == 'freefall' ) && ( tileT.tileType == TILE.WALL ) ) {
            
            if (this.faceL())
            {
    
                this.charX = convertBlockXtoX(this.charBlockX + 1) - 1;
    
    
            } else {
    
                this.charX = convertBlockXtoX(this.charBlockX);
    
            }
            this.updateBlockXY();
            this.bump();
            return;
        }
        
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        
        if ( this.faceR() && tile.isBarrier()  ) {
         
            if ( Phaser.Geom.Intersects.RectangleToRectangle(tile.getBounds(), this.getCharBounds()) ) {
                
                console.log(this.getAction());
                this.charX = convertBlockXtoX(this.charBlockX) + 10;
                this.updateBlockXY();
                this.bump();
                
            }
            
        } else {
        
            var blockX = convertXtoBlockX( this.charX + this.charFdx * this.charFace );
            var tileNext = this.level.getTileAt(blockX,this.charBlockY,this.room);
    
            if ( tileNext.isBarrier() )
            {
    
                switch (tileNext.tileType) {
    
                    case TILE.WALL:
                        
                        if ( this.getAction() == 'stand' ) return;
                        if (this.faceL())
                        {
                
                            this.charX = convertBlockXtoX(blockX + 1) - 1;
                        
                            
                        } else {
    
                            this.charX = convertBlockXtoX(blockX);
                            
                        }
                        this.updateBlockXY();
                        this.bump();
                        break;
    
                    case TILE.GATE:
                        
                        if (this.faceL() && Phaser.Geom.Intersects.RectangleToRectangle(tileNext.getBounds(), this.getCharBounds())) 
                        {
                            
                            if ( ( this.getAction() == 'stand' ) && (tile.tileType == TILE.GATE ) ) {
                                
                                this.charX = convertBlockXtoX(this.charBlockX) + 3;
                                this.updateBlockXY();
                                
                            } else {
                                
                                this.charX = convertBlockXtoX(blockX + 1) - 1;
                                this.updateBlockXY();
                                this.bump();
                                
                            }
                            
                        }
                        break;
                        
                    case TILE.TAPESTRY:
                    case TILE.TAPESTRY_TOP:
                    
                        if ( this.getAction() == 'stand' ) return;
                        if (this.faceL())
                        {
                
                            this.charX = convertBlockXtoX(blockX + 1) - 1;
                            this.updateBlockXY();
                            this.bump();
                            
                        }
                        
                        break;
                        
                }
    
            }
            
        }
    
    }
    
    getCharBounds() {
    
        var f = this.scene.textures.getFrame('kid', 'kid-' + this.charFrame);
        
        var x = convertX(this.charX + this.charFdx * this.charFace);
        var y = this.charY + this.charFdy - f.height;
        
        if (this.faceR()) {
            x -= f.width;
        }
        
        if ((this.charFood && this.faceL()) || (!this.charFood && this.faceR())) {
            
            x += 1;
            
        }
        
        return new Phaser.Geom.Rectangle(x,y,f.width,f.height);
        
    }
    
    bump() {
        
        console.log('bumping...');
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        
        if ( tile.isSpace() ) {
            
            this.charX -= 2 * this.charFace;
            this.bumpFall();
            
        } else {
            
            var y = this.distanceToFloor(this.charBlockY);
            console.log('to floor:' + y + ' ' + this.charBlockY + ' ' + this.charY + ' ' + this.charFdy);
            if ( y >= 5 )
            {
                this.bumpFall();
                console.log('distance: ' + y);
                
            } else {
                
                this.scene.requestSoundPlay(SOUND.BUMPED);

                if ( this.frameID(24,25) || this.frameID(40,42) || this.frameID(102,106) ) {
                    
                    this.charX -= 5 * this.charFace;
                    this.fallingBlocks = 0;
                    this.land();
                    
                    
                } else {
                    
                    this.setAction('bump');
                    this.processCommand();
                    
                }
            }
        }

        
    }
    
    bumpFall() {
      
        if ( this.actionCode == ACTION.FREE_FALL) {
            this.charX -= this.charFace;
            this.charXVel = 0;
        } else {
            this.charX -= 2 * this.charFace;
            this.setAction('bumpfall');
            this.processCommand();
        }
        
    }
    
    fastsheathe() {
      
        this.flee = true;
        this.setAction('fastsheathe');
        this.swordDrawn = false;
        if (this.opponent) this.opponent.refracTimer = 9;
        
    }
    
    block() {
      
        if ( this.frameID(158) || this.frameID(165) ) {
            
            if (this.opponent && this.opponent.frameID(18)) return;
            this.setAction('block');
            if (this.opponent && this.opponent.frameID(3)) this.processCommand();
            
        } else {
            
            if (!this.frameID(167)) return;
            this.setAction('striketoblock');
            
        }
        
        this.allowBlock = false;
        
    }
    
    checkFloor() {
    
        switch (this.actionCode) {
                
            case ACTION.STAND:    
            case ACTION.RUN_JUMP: 
            case ACTION.BUMP:
            case ACTION.TURN:
    
                if  (((this.getAction() == 'climbup') && this.frameID(135,140)) ||
                    ((this.getAction() == 'climbdown') && (this.frameID(136) || this.frameID(91))) ||
                    (this.getAction() == 'hang') || (this.getAction() == 'hangstraight')) {

                    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY - 1,this.room);
                    if (tile.isButton()) tile.push();

                }

                if (this.charFcheck) {
                    
                    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY,this.room);
                    
                    switch (tile.tileType) {
    
                        case TILE.SPACE:
                            if ( this.actionCode == ACTION.BUMP ) return;
                            if (this.getAction() == 'climbup') return;
                            if (this.getAction() == 'climbdown') return;        
                            this.startFall();
                            this.recoverCrop = true;
                            this.inJumpUP = false;
                            break;
    
                        case TILE.LOOSE_BOARD:
                            tile.shake(true);
                            break;
    
                        case TILE.RAISE_BUTTON:
                        case TILE.DROP_BUTTON:
                            tile.push();
                            break;
    
                        case TILE.SPIKES:
                            tile.raise();
                            break;
    
                    }
    
                }

            case ACTION.HANG_CLIMB:
            case ACTION.HANG_STRAIGHT:

                var tile = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
                if (tile.isButton() && (this.frameID(80) || this.getAction() == 'hang')) tile.push();
                break;
                     
            case ACTION.IN_MIDAIR:
            case ACTION.FREE_FALL: 
            
                console.log('charY: ' + this.charY + ' fdy: ' + this.charFdy);
                if ( this.charY > convertBlockYtoY(this.charBlockY) ) {
                    
                    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        
                    if ( tile.isWalkable() ) {
                        
                        this.land();
                        
                    } else {
                        
                        this.fallingBlocks++;
                        console.log(this.fallingBlocks);
                        
                    }
    
                }
                break;
                       
        }
    
    }
    
    checkRoomChange() {
        
        if ( !this.inCurrentRoom() &&  this.faceR() ) {
            
            var room = this.room;
            if (this.charBlockX == 9) room = this.level.rooms[this.room].links.right;
            this.emit('changeroom', room);
            
        }
        
        var footX = this.charX + ( this.charFdx * this.charFace );
        
        if ( (convertXtoBlockX(footX) == 8) && this.faceL() ) {
            
            this.emit('changeroom', this.room);
        
        }
        
        if (this.charY > 192) {
            //this.game.camera.y += 189*2;
            this.charY -= 192;
            this.baseY += 189;
            this.room = this.level.rooms[this.room].links.down;
            this.emit('changeroom', this.room);
        }
        
    }
    
    
    maskAndCrop() {
         
        // mask climbing
        if ( this.faceR() && (this.charFrame > 134) && (this.charFrame < 145)) { this.setFrame(this.frame.name + 'r').setOrigin(0,1); }
        
        // mask hanging
        if ( this.faceR() && (this.getAction().substring(0,4) == 'hang') ) { 
            
            this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room); 
        
        }
        if ( this.faceR() && (this.getAction() == 'climbdown') && this.frameID(91)) { 
            
            this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room); 
        
        }
            
        // unmask falling / hangdroping
        if ( this.frameID(15) ) { this.level.unMaskTile(); }
        
        // crop in jumpup
        if ( this.recoverCrop ) {
            
            this.setCrop(); 
            this.recoverCrop = false;
            
        }
        
        if ( this.inJumpUP && this.frameID(79) ) { 
            
            this.setCrop( 0, 7, this.width, this.height); 
        
        }    
        
        if ( this.inJumpUP && this.frameID(81) ) {
            this.setCrop( 0, 3, this.width, this.height); 
            this.inJumpUP = false; 
            this.recoverCrop = true; 
        
        }
          
    }
    
    tryPickup() {
    
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
        
        this.pickupSword = (tile.tileType == TILE.SWORD) || (tileF.tileType == TILE.SWORD);
        this.pickupPotion = (tile.tileType == TILE.POTION) || (tileF.tileType == TILE.POTION);
        
        if ( this.pickupPotion || this.pickupSword ) { 
            
            if (this.faceR())
            {
                if ((tileF.tileType == TILE.POTION) || (tileF.tileType == TILE.SWORD))  { this.charBlockX++;}
                this.charX = convertBlockXtoX(this.charBlockX) + ( 1 * this.pickupPotion );
            }
            if (this.faceL())
            {
                if ((tile.tileType == TILE.POTION) || (tile.tileType == TILE.SWORD)) { this.charBlockX++;}
                this.charX = convertBlockXtoX(this.charBlockX) - 3;
            }
            this.setAction('stoop'); 
            this.allowCrawl = false;
        
        }
        
    }
    
    keyL() {
        
        return this.cursors.left.isDown;
        
    }
    
    keyR() {
        
        return this.cursors.right.isDown;
        
    }
    
    keyU() {
        
        return this.cursors.up.isDown;
        
    }
    
    keyD() {
        
        return this.cursors.down.isDown;
        
    }
    
    keyS() {
        
        return this.shiftKey.isDown;
        
    }
    
    turn() {
        
        if ( !this.hasSword || this.canSeeOpponent() < 1 || this.opponentDistance() > 0 ) {
            
            this.setAction('turn');
            
        } else {
            
            this.setAction('turndraw');
            this.flee = false;
            
        }
        
    }
    
    standjump() {
        
        this.setAction('standjump');
        jaxpi.jumped(1, "1").character("kid");
        
    }
    
    startrun() {
        
        if ( this.nearBarrier() ) return this.step();
        this.setAction('startrun');
        
    }
    
    runturn() {
        
        this.setAction('runturn');
        
    }
    
    turnrun() {
        
        if ( this.nearBarrier() ) return this.step();
        this.setAction('turnrun');
        
    }
    
    runjump() {
        
        jaxpi.jumped(1, "1").character("kid");
        // adjust jump to edge
        const xpos = this.charX + 4 * this.charFace;
        const block = convertXtoBlockX(xpos);
        const tileF = this.level.getTileAt(block + this.charFace, this.charBlockY, this.room);
        let dis = 0;
        if (tileF.isSpace() || tileF.tileType == TILE.SPIKES) {

            dis = distanceToEdgeFromX(xpos);
            if (this.faceR()) dis = 13 - dis;
            dis += 4 - 14;

        } else {
            const tileFF = this.level.getTileAt(block + 2 * this.charFace, this.charBlockY, this.room);
            if (tileFF.isSpace() || tileFF.tileType == TILE.SPIKES) {

                dis = distanceToEdgeFromX(xpos);
                if (this.faceR()) dis = 13 - dis;
                dis += 4;    

            }
        }
        if ((dis < -8) || (dis > 1)) return;
        this.charX += dis * this.charFace;
        this.setAction('runjump');
        
    }
    
    rdiveroll() {
        
        this.setAction('rdiveroll');
        this.allowCrawl = false;
        
    }
    
    standup() {
        
        this.setAction('standup');
        this.allowCrawl = true;
        
    }
    
    land() {
        
        console.log('land: ' + this.fallingBlocks);
        this.charY = convertBlockYtoY(this.charBlockY);
        this.charXVel = 0;
        this.charYVel = 0;
        
        if (this.fallingBlocks <  2 ) {
    
            if (this.specialLand) {

                this.setAction('medland');
                this.specialLand = false;
                this.scene.sound.playAudioSprite('music','06-danger');

            } else {
                this.setAction('softland');
                this.scene.requestSoundPlay(SOUND.SOFT_LAND);
            }

        }
    
        if (this.fallingBlocks == 2 ) {

            this.setAction('medland');
            this.scene.requestSoundPlay(SOUND.MEDIUM_LAND);
            this.hit(1);

        }

        if (this.fallingBlocks >  2 ) {

            this.setAction(KID_INMORTAL ? 'medland':'dropdead');
            this.hit(this.health);

        }
        
        this.processCommand();
        
    }
    
    crawl() {
        
        this.setAction('crawl');
        this.allowCrawl = false;
        
    }

    engarde() {
        super.engarde();
        this.flee = false;
    }
    
    runstop() {
        
        if ( this.frameID(7) || this.frameID(11) ) this.setAction('runstop');
        
    }
    
    distanceToEdge() {
    
        if (this.faceR()) {
            return convertBlockXtoX(this.charBlockX + 1) - 1 - this.charX - this.charFdx + this.charFfoot;
        } else {
            return this.charX + this.charFdx + this.charFfoot - convertBlockXtoX(this.charBlockX);
        }
    
    }
    
    distanceToFloor() {
    
        return convertBlockYtoY(this.charBlockY) - this.charY - this.charFdy;
    
    }

    distanceToTopFloor() {
    
        return convertBlockYtoY(this.charBlockY - 1) - this.charY - this.charFdy;
    
    }
    
    step() {
        
        var px = 11;
        
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
        
        if ( this.nearBarrier() || ( tileF.tileType == TILE.SPACE ) || 
           ( tileF.tileType == TILE.POTION ) || ( tileF.tileType == TILE.LOOSE_BOARD ) ||
           ( tileF.tileType == TILE.SWORD ) )
        {
        
            px = this.distanceToEdge();
            console.log('dtoedge' + px);
            
            if ( ( (tile.tileType == TILE.GATE) || (tile.tileType == TILE.TAPESTRY) ) && this.faceR() ) {
                
                px -= 6;
                if (px <= 0) { this.setAction('bump'); return; }
                
            } else {
            
                if ( tileF.isBarrier() ) {
                    
                    px -= 2;
                    if (px <= 0) { this.setAction('bump'); return; }
                
                } else {
    
                    if ((px == 0) && (( tileF.tileType == TILE.LOOSE_BOARD) || (tileF.tileType == TILE.SPACE))) {
    
                        if (this.charRepeat) {
                            this.charRepeat = false;
                            px = 11;
                        } else {
                            this.charRepeat = true;
                            this.setAction('testfoot');
                            return;
                        }
                    }
                }
                
            }
            
        }
        this.setAction('step' + px);
            
    }
    
    startFall() {
        
        this.fallingBlocks = 0;
        
        if (this.getAction().substring(0,4) == 'hang') {
            
            var blockX = this.charBlockX;
            if ( this.getAction() == 'hangstraight' ) blockX -= this.charFace;
    
            var tile = this.level.getTileAt(blockX,this.charBlockY,this.room);
    
            if (tile.tileType != TILE.SPACE) {
    
                tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
                
                if ( tile.tileType == TILE.WALL ) {
    
                    this.charX -= 7 * this.charFace;
    
                }
                this.setAction('hangdrop');
    
            } else {
    
                this.setAction('hangfall');
                this.processCommand();
    
            }
            
        } else {
         
            var act = 'stepfall';
            
            if ( this.frameID(44) ) { act = 'rjumpfall'; }
            if ( this.frameID(26) ) { act = 'jumpfall'; }
            if ( this.frameID(13) ) { act = 'stepfall2'; }
    
            if ( this.faceL() ) { 
                this.level.maskTile(this.charBlockX + 1, this.charBlockY, this.room); 
            }
            this.setAction(act);
            this.processCommand();   
            
        }
        
    }
    
    stoop() {
        
        var tileR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
        
        if (tileR.tileType == TILE.SPACE) {
            
            if (this.faceL()) {
                
                if ( ( this.charX - convertBlockXtoX(this.charBlockX) ) > 4 ) return this.climbdown();
    
            } else {
    
                if ( ( this.charX - convertBlockXtoX(this.charBlockX) ) < 9 ) return this.climbdown();
    
            }
            
        } 
        
        this.setAction('stoop');
        
    }
    
    climbdown() {
        
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        
        if ( this.faceL() && (tile.tileType == TILE.GATE) && !tile.canCross(10) ) {
            
            this.charX = convertBlockXtoX(this.charBlockX) + 3;
            
        } else {
            
            if (this.faceL())
            {
                this.charX = convertBlockXtoX(this.charBlockX) + 6;
    
            } else {
    
                this.charX = convertBlockXtoX(this.charBlockX) + 7;
    
            }
            this.setAction('climbdown');
            
        }
        
    }
    
    climbup() {
        
        var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
        
        if ( this.faceL() && (tileT.tileType == TILE.GATE) && !tileT.canCross(10) ) {
            
            this.setAction('climbfail');
            
        } else {
            
            this.setAction('climbup');
            if ( this.faceR() ) {
    
                this.level.unMaskTile();
            }
            
        }
        
    }
    
    jumpup() {
        
        console.log('Jump up');
        this.setAction('jumpup');
        this.inJumpUP = true;
        
    }
    
    highjump() {
        
        var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
        
        this.setAction('highjump');
        if ( this.faceL() && tileTR.isWalkable() ) { 
            
            this.level.maskTile(this.charBlockX + 1,this.charBlockY - 1,this.room);
            
        }
        
    }
    
    jumpbackhang() {
        
        // patch x
        if (this.faceL())
        {
            
            this.charX = convertBlockXtoX(this.charBlockX) + 7;
            
        } else {
            
            this.charX = convertBlockXtoX(this.charBlockX) + 6;
            
        }
        this.setAction('jumpbackhang');
        if ( this.faceR() ) { 
            
            this.level.maskTile(this.charBlockX,this.charBlockY - 1,this.room);
            
        }
        
    }
    
    jumphanglong() {
        
        // patch x
        if (this.faceL())
        {
            this.charX = convertBlockXtoX(this.charBlockX) + 1;
            
        } else {
            
            this.charX = convertBlockXtoX(this.charBlockX) + 12;
            
        }
        this.setAction('jumphanglong');
        if ( this.faceR() ) { 
            this.level.maskTile(this.charBlockX + 1,this.charBlockY - 1,this.room);
        }
        
    }
    
    
    climbstairs() {
      
        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY,this.room);
        
        if (tile.tileType == TILE.EXIT_RIGHT) {
            
            this.charBlockX--;
            
        } else {
            
            tile = this.level.getTileAt(this.charBlockX + 1, this.charBlockY,this.room);
            
        }
        
        if (this.faceR()) {
         
            this.charFace *= -1;
            this.scaleX *= -1;
            
        }
        
        this.charX = convertBlockXtoX(this.charBlockX) + 3;
        tile.mask();
        this.setAction('climbstairs');
        
    }
    
    jump() {
       

        var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
        var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
        var tileTF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room);
        var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
        var tileR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
        
        if (tile.isSpace()) return;

        if ( tile.isExitDoor() ) {
            
            if (tile.tileType == TILE.EXIT_LEFT) {
             
                tile = this.level.getTileAt(this.charBlockX + 1, this.charBlockY,this.room);
                
            }
         
            if ( tile.isOpen() ) return this.climbstairs();
            
        }

        // Jaxpi call after checking jump is possible
        jaxpi.jumped(1, "1").character("kid");
        
        if ( tileT.isSpace() && tileTF.isWalkable() )
        {
            return this.jumphanglong();
        }
        
        if ( tileT.isWalkable() && tileTR.isSpace() && tileR.isWalkable() )
        {
            if ( this.faceL() && (( convertBlockXtoX(this.charBlockX + 1) - this.charX ) < 11 ))
            {
                this.charBlockX++;
                return this.jumphanglong();
            }
            if ( this.faceR() && (( this.charX - convertBlockXtoX(this.charBlockX) ) < 9 ))
            {
                this.charBlockX--;
                return this.jumphanglong();
            }
            return this.jumpup();
        } 
        
        if ( tileT.isWalkable() && tileTR.isSpace() )
        {
            if ( this.faceL() && (( convertBlockXtoX(this.charBlockX + 1) - this.charX ) < 11 ) )
            {
                return this.jumpbackhang();
            }
            if ( this.faceR() && (( this.charX - convertBlockXtoX(this.charBlockX)) < 9 ) )
            {
                return this.jumpbackhang();
            }
            return this.jumpup();
        }
        
        if ( tileT.isSpace() )
        {
           
            return this.highjump();
            
        } 
        
        this.jumpup();
        
    }

    inCurrentRoom() {
        return Phaser.Geom.Intersects.RectangleToRectangle(this.level.getRoomBounds(this.room), this.getBounds());
    }
}

export default Kid;


