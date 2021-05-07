var config = {
    type: Phaser.AUTO,
    width:850,
    height:600,
    physics:{
        default:'arcade',
        arcade:{
            debug: true,
            gravity:{y:0}
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

var game = new Phaser.Game(config);

var dinero=0;
var comida=0;

var direccion1=1;
var direccion2=1;

var cd=0;
var cd2=100;
var mensaje=0;
var scorecd=0;
var final=20;
var inicio=0;
var cd3=0;

var finalconversacion=true;

var velocidad=200;

var seguir=false;

var vidaenemigo=true;
var golpeneemigo=0;
var cdenemigo=0;
var pieza=0;

var llave=false;
function preload() {

    this.load.image('gameTiles', 'tileset/NatureTileset.png');

    this.load.tilemapTiledJSON('tilemap', 'maps/nivellago.json');

    this.load.atlas('attack','assets/attack.png', 'assets/attack_atlas.json');

    this.load.image('moneda', 'assets/monedas.png');

    this.load.image('cerdo', 'assets/cerdo.png');

    this.load.image('inventario', 'assets/inventario.png');

    this.load.image('chuleta', 'assets/chuleta.png');

    this.load.image('NPC', 'assets/NPC.png');

    this.load.image('texto', 'assets/bafarada1.png');

    this.load.image('texto2', 'assets/bafarada2.png');

    this.load.image('enemigo', 'assets/enemigo.png');

    this.load.image('estatuaapagada', 'assets/estatuaapagada.png');
    this.load.image('estatuaencendida', 'assets/estatuaencendida.png')

    this.load.image('cofre', 'assets/cofre.png');

    this.load.image('antorcha', 'assets/antorcha.png');

    this.load.image('antorchaencendida', 'assets/antorchaencendida.png');
      
    this.load.image('tanque', 'assets/tanque.png');
}
   
function create() {

    map = this.make.tilemap({key:'tilemap'});

    tileset = map.addTilesetImage('nature','gameTiles');

    capa = map.createDynamicLayer(0, tileset);

    obstaculos = map.createDynamicLayer(1, tileset);
    obstaculos.setCollisionByProperty({colisiones: true});

    KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    SPACE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    KeyE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    KeyQ=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    player = this.physics.add.sprite(2600,2365, 'attack').setScale(0.1);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key:'attack',
        frames: this.anims.generateFrameNames('attack', {
            prefix: 'attack',
            start: 0,
            end: 10,
        }),
        repeat:0,
        frameRate:15
    });

    cartera = this.add.sprite(40,50,'moneda').setScale(0.1);

    monedaList = this.physics.add.group();

    this.physics.add.overlap(player, monedaList, recolectar, null, this);

    dineros = this.add.text(70, 50,+ dinero, { fontSize: '20px', fill: 'white' });

    cerdo1 = this.physics.add.sprite(2140,2365,'cerdo').setScale(0.2);
    this.physics.add.overlap(player, cerdo1, ataque1, null, this);

    cerdo2 = this.physics.add.sprite(2120,2430,'cerdo').setScale(0.1);
    this.physics.add.overlap(player, cerdo2, ataque2, null, this);

    this.cameras.main.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.physics.world.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);

    inventario = this.add.sprite(700,80, 'inventario').setScale(0.3);
    chuleta = this.add.sprite(595,40, 'chuleta').setScale(0.3);
    scoreText1 = this.add.text(605, 45,+ chuleta, { fontSize: '20px', fill: 'white' });

    this.physics.add.collider(player, obstaculos);

    //Sprites del NPC
    NPC = this.physics.add.sprite(1800,1800, 'NPC');
    NPC.setScale(0.2);
    NPC.body.setSize(900,900);

    //Colision con el final de la pantalla
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(100, 300, 50, 25);

//Interacciones entre el player y el NPC
    this.physics.add.overlap(player, NPC, interaccion, null, this);
    this.physics.add.overlap(player, NPC, hablar, null, this);
    this.physics.add.overlap(player, NPC, pasar, null, this);

    enemigo = this.physics.add.sprite(1900,1500,'tanque').setScale(0.8);
    enemigo.body.setSize(300,300);

    this.physics.add.overlap(player,enemigo,perseguir, null, this);
    this.physics.add.overlap(player, enemigo, matar, null, this);

    this.physics.add.collider(enemigo, obstaculos);

    antorcha1 = this.physics.add.sprite(1730,1030, 'antorcha').setScale(0.8);
    antorcha2 = this.physics.add.sprite(2340,810, 'antorcha').setScale(0.8);
    antorcha3 = this.physics.add.sprite(1695,195, 'antorcha').setScale(0.8);
    antorcha4 = this.physics.add.sprite(2180,355, 'antorcha').setScale(0.8);

    this.physics.add.overlap(player,antorcha1,puzle1, null, this);
    this.physics.add.overlap(player,antorcha2,puzle2, null, this);
    this.physics.add.overlap(player,antorcha3,puzle3, null, this);
    this.physics.add.overlap(player,antorcha4,puzle4, null, this);

    enemigo2 = this.physics.add.sprite(1600,1400,'enemigo').setScale(0.15);
    enemigo2.body.setSize(1200,1200);
    this.physics.add.overlap(player,enemigo2,matarpeque, null, this);

}

function update()
{
    if(cd>0)
    {
        cd=cd-1;
    }

    if(cd3==1) 
    {
        scorecd=scorecd-1;
    }

    if (KeyA.isDown)
    {
        player.setVelocityX(-200);
    }
    else if(KeyD.isDown)
    {
        player.setVelocityX(200);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (KeyW.isDown)
    {
        player.setVelocityY(-200);
    }
    else if (KeyS.isDown)
    {
        player.setVelocityY(200);
    }
    else
    {
        player.setVelocityY(0);
    }


     if (KeyQ.isDown)
    {
        player.play('attack');
    }

    if (SPACE.isDown && finalconversacion==false)
    {
        final=final-1;
        if (SPACE.isDown && final<=0 )
        {
            destruir();
            final=10;
        }
    } 

    movercerdo();
    girar();
    movercerdo2();
    girar2();
    atacar();
}

function recolectar(objeto1, objeto2)
{
    objeto2.destroy();
    var aleatorio = Phaser.Math.Between(1, 10);
    dinero=dinero+aleatorio;
    dineros = dineros.setText(+ dinero);
    comida=comida+1;
    scoreText1 = scoreText1.setText(+ comida);
}

function recolectar2(objeto1, objeto2)
{
    objeto2.destroy();
    var aleatorio = Phaser.Math.Between(1, 10);
    dinero=dinero+aleatorio;
    dineros = dineros.setText(+ dinero);
    comida=comida+1;
    scoreText1 = scoreText1.setText(+ comida);
}

function ataque1(objeto1, objeto2)
{
    if(KeyQ.isDown)
    {
        objeto2.destroy();
        var moneda2 = monedaList.create(cerdo1.x,cerdo1.y,'moneda').setScale(0.08);
    }
}

function ataque2(objeto1, objeto2)
{
    if(KeyQ.isDown)
    {
        objeto2.destroy();
        var moneda2 = monedaList.create(cerdo2.x,cerdo2.y,'moneda').setScale(0.08);
    }
}
    
function movercerdo()
{  
    if(direccion1==1)
    {
        cerdo1.y=cerdo1.y-1;

        if(cerdo1.y==2000)
        {
            direccion1=0;
        }
    }
}

function girar()
{
    if(direccion1==0)
    {
        cerdo1.y=cerdo1.y+1;

        if(cerdo1.y==2400)
        { 
            
            direccion1=1;
        }
    }
}

function movercerdo2()
{  
    if(direccion2==1)
    {
        cerdo2.y=cerdo2.y-1;

        if(cerdo2.y==2000)
        {
            direccion2=0;
        }
    }
}

function girar2()
{
    if(direccion2==0)
    {
        cerdo2.y=cerdo2.y+1;

        if(cerdo2.y==2400)
        { 
            
            direccion2=1;
        }
    }
}

//Funcion para iniciar conversación
function hablar()
{
    if(KeyE.isDown && cd==0 && mensaje==0 && inicio==0)
    {
        texto = this.physics.add.sprite(NPC.x+50, NPC.y-100, 'texto');
        texto.setScale(0.3);
        cd=100;
        mensaje=1;
        inicio=1;
    }
}

//Funcion para pasar de frase
function pasar()    
{
    if(SPACE.isDown && mensaje==1)
    {
        texto.destroy();
        scoreText.destroy();
        texto2 = this.physics.add.sprite(NPC.x+50, NPC.y-100, 'texto2');
        texto2.setScale(0.3);
        cd2=200;
        mensaje=0;
        finalconversacion=false;
    }   
}

//Funcion para que aparezca el texto de ayuda 
function interaccion()
{
    if(scorecd<=0)
    {
        scoreText = this.add.text(NPC.x-220, NPC.y + 50, 'Pulsa E para hablar y SPACE para continuar', { fontSize: '20px', fill: 'white' });
        scorecd=100;
        cd3=0;
    }
}

//Funcion para eliminar cualquier texto
function destruir()
{
    scoreText.destroy();
    texto2.destroy();
    inicio=0;
    cd3=1;
    finalconversacion=true;
}

function perseguir()
{
   if(vidaenemigo==true)
    {
        seguir=true;
        if(cdenemigo>0)
        {
            cdenemigo=cdenemigo-1;
        }
    }
}

function atacar()
{
   if(seguir==true) 
    {
        enemigo.direccion = new Phaser.Math.Vector2(player.x-enemigo.x, player.y-enemigo.y);
        enemigo.direccion.normalize();
        enemigo.setVelocityX(velocidad * enemigo.direccion.x);
        enemigo.setVelocityY(velocidad * enemigo.direccion.y);
    }
}

function matar()
{
    
    if (KeyQ.isDown & cdenemigo==0)
    {

        if(golpeneemigo==0)
        {
            golpeneemigo=1;
            cdenemigo=50;
        }
        else if(golpeneemigo==1)
        {
            golpeneemigo=2;
            cdenemigo=50;
        }
        else if(golpeneemigo==2)
        {
        enemigo.destroy();
        seguir=false;
        vidaenemigo=false;
        }
    }
}

function puzle1()
{
    if(KeyE.isDown && pieza==0)
    {
        pieza=1;
        //antorcha1.destroy;
        antorchae1 = this.physics.add.sprite(1730,1030, 'antorchaencendida').setScale(0.8);
    }
}

function puzle2()
{
    if(KeyE.isDown && pieza==1)
    {
        pieza=2;
        antorcha2.destroy;
        antorchae2 = this.physics.add.sprite(2340,810, 'antorchaencendida').setScale(0.8);
    }
}

function puzle3()
{
    if(KeyE.isDown && pieza==2)
    {
        pieza=3;
        antorcha3.destroy;
        antorchae3 = this.physics.add.sprite(1695,195, 'antorchaencendida').setScale(0.8);
    }
}

function puzle4()
{
    if(KeyE.isDown && pieza==3)
    {
        pieza=4;
        antorcha4.destroy;
        antorchae4 = this.physics.add.sprite(2180,355, 'antorchaencendida').setScale(0.8);
        cofre = this.physics.add.sprite(1860, 470, 'cofre').setScale(0.4);
    }
}

function matarpeque()
{
    if(KeyQ.isDown)
    {
        enemigo2.destroy();
    }
}