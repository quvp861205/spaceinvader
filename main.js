var juego = new Phaser.Game(370, 490, Phaser.CANVAS, "bloque_juego");
var fondoJuego;
var boton;
var nave;
var cursores;
var balas;
var tiempoBala = 0;
var botonDisparo;
var enemigos;

//DEMO
var estadoPrincipal = {
	//carga todos los componetnes
	preload: function(){
		juego.stage.backgroundColor = "#000";
		//se carga imagen
		juego.load.image("fondo", "img/espacio.jpg");
		juego.load.image("nave", "img/nave.png"); //nave fijo
		juego.load.image("disparo", "img/disparo.png"); 
		juego.load.image("enemigo", "img/enemigo.png"); 
	},

	//se ejecuta una vez que se carga todo
	create: function(){

		//mostrar en pantalla
		fondoJuego = juego.add.tileSprite(0, 0, 370, 550, "fondo");
		nave = juego.add.sprite(juego.width/2,juego.height-30,"nave"); //nave fijo
		nave.anchor.setTo(0.5);		
		nave.scale.setTo(.1,.1);

		cursores = juego.input.keyboard.createCursorKeys();

		//Crea herramientas de fisica como gravedad, colision
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		//Habilita la fisica en flappy
		juego.physics.arcade.enable(nave);
		//No deja salir de la pantalla a flappy
		nave.body.collideWorldBounds = true;

		botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		balas = juego.add.group();
		balas.enableBody = true; //para detectar colision;
		//balas.physicsBodyType = Phase.Physics.ARCADE;

		juego.physics.arcade.enable(balas); //permite detectar colision velocidad entre otros
		balas.createMultiple(20, "disparo"); //creamos posiblidad de crear 20 balas al mismo tiempo
		balas.setAll("anchor.x", 0.5); //asignamos el eje central x en el centro
		balas.setAll("anchor.y", 1);  //asignamos el eje central y en la parte superior
		balas.setAll("outOfBoundsKill", true); //si salen de la pantalla se destruyen
		balas.setAll("checkWorldBounds", true); //valida que este dentro de la pantalla

		enemigos = juego.add.group();
		juego.physics.arcade.enable(enemigos); 
		enemigos.enableBody = true;
		
		for(var y=0; y<4; y++){
			for(var x=0; x<5; x++){
				var enemigo = enemigos.create(x*60, y*40, "enemigo");
				enemigo.anchor.setTo(.5);
				enemigo.scale.setTo(.08);
			}
		}

		enemigos.x = 40;
		enemigos.y = 30;

		//que va hacer
		//cuanto dura
		//efecto
		//??
		//??
		//el tiempo otra vez
		//????
		var animacion = juego.add.tween(enemigos).to({x:100}, 1000, Phaser.Easing.Linear.None, true, 1, 1000, true);

		animacion.onRepeat.add(descender, this);
	},

	//se realizan todas las acciones periodicamente
	update: function(){

		fondoJuego.tilePosition.y += 1;

		if( cursores.right.isDown )
		{
			nave.position.x += 3;
		}
		if( cursores.left.isDown )
		{
			nave.position.x -= 3;
		}
		if( cursores.up.isDown )
		{
			nave.position.y -= 1;
		}
		if( cursores.down.isDown )
		{
			nave.position.y += 1;
		}

		var bala;
		if( botonDisparo.isDown ){

			if( juego.time.now>tiempoBala ){ //si tiempoBala es menor al tiempo transcurrido
				bala = balas.getFirstExists(false); //de las 20 que hay vamos a coger la primera que exista
				
				if( bala ){ //si hubo disponible 1 de las 20 balas
					bala.reset(nave.x, nave.y);
					bala.body.velocity.y = -300; //asignamos velocidad de la bala
					bala.scale.setTo(1,1); //escalamos la bala porque esta muy grande
					tiempoBala = juego.time.now + 500; //no se puede disparar antes de 100 milisengudos
				}
			}
		}

		//cuando un elemento choca con otro
		juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
	}

};

function descender(){
	enemigos.y += 10;
}


function colision(bala, enemigo){
	bala.kill();
	enemigo.kill();
}


juego.state.add("Principal", estadoPrincipal);
juego.state.start("Principal");

