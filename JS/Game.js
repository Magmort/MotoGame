// Classe d'instantiation du jeu

function Game(){  
  
  var canvas = document.querySelector("#myCanvas");
  var ctx = canvas.getContext("2d");
  
  var ground = document.querySelector("#ground");
  var ground_ctx = ground.getContext("2d");
  
  var HUD = document.querySelector("#HUD");
  var HUD_ctx = HUD.getContext("2d");
  
  var voies = [238, 400, 564];
  var vitesse = [9, 6, 3];
  var voieBuffer = [[],[],[]];
  var voieJam = [0,0,0];
  
  // Loader
  var nbRessource = 0;
  var RessourceLoad = 0;
  var ressourcesImg = [];
  
  var img_moto = null;
  var img_voiture = null;
  var img_oil = null;
  var img_speedometer1 = null;
  var img_glisse_actif = null;
  var img_game_over = null;
  
  // FPS count var
  var frameCount = 0;  
  var lastTime;  
  var fps = 0;

  // Drawable
  var moto;                 // Accesseur à la moto
  var drawable = [[],[]];   // Tableau contenant [ [Toutes les voitures], [Toutes les flaques] ]

  //  GameMechanics
  var inputStates = { };
  var gameOver = false;     // Fin de partie ?
  //  Gestion de la vitesse
  var speed = 1;            // Vitesse au départ
  var speedMin = 1;         // Vitesse minimum
  var speedMax = 20;        // Vitesse maximum
  var speedAdd = 0.02;      // Multiplicateur à l'acceleration
  //  Pop des flaques d'huile
  var spawnTime = 5000;     // Temps entre 2 pop
  var spawn = 1;            // Compteur pour le pop de flaque
  var lastGameMS = 0;       // On garde en mémoire le temps de l'ancienne partie pour ne pas fausser les pop

  var gameScore = 0;        // Le score de la partie en cours

  var gameLoop = function(ms){  
  
    //  Est-ce qu'il faut faire pop une flaque ?
    if (ms - lastGameMS > spawn*spawnTime){
      createOil();
      spawn += 1 + Math.random()*2; // La prochaine arrivera entre 5 et 10 secondes
    }
    
    //  Si le jeu continue
    if (!gameOver){
      //  On check l'ajout de voiture
      spawnVoiture();
      
      //  On gére les déplacements de la moto
      UpdateMove(ms);

      // Affichage
      // -- HUD -- 
      HUD_ctx.clearRect(0,0, HUD.width, HUD.height);
      HUD_ctx.save();
      HUD_ctx.translate(800,800);
      HUD_ctx.lineWidth = 10;
      
      
      // Indicateur de glisse
      // Fond
      var gradiant = HUD_ctx.createLinearGradient(-100,-225,150,-50);
      gradiant.addColorStop(0,"white");
      gradiant.addColorStop(1,"black");
      HUD_ctx.beginPath();
      HUD_ctx.fillStyle = gradiant;
      HUD_ctx.moveTo(-100, -100);
      HUD_ctx.lineTo(-50, -225);
      HUD_ctx.lineTo(50, -225);
      HUD_ctx.lineTo(100, -100);
      HUD_ctx.fill();
      
      gradiant = HUD_ctx.createLinearGradient(-100,-225,150,-50);
      gradiant.addColorStop(0,"black");
      gradiant.addColorStop(1,"white");
      HUD_ctx.beginPath();
      HUD_ctx.strokeStyle = gradiant;
      HUD_ctx.moveTo(-90, -90);
      HUD_ctx.lineTo(-40, -210);
      HUD_ctx.lineTo(40, -210);
      HUD_ctx.lineTo(90, -90);
      HUD_ctx.stroke();
      
      // Icone
      if (moto.isOil()){
        HUD_ctx.drawImage(ressourcesImg[img_glisse_actif].htmlImage, -25, -210, 50, 50);
      }else{
        //HUD_ctx.drawImage(ressourcesImg[img_glisse_actif].htmlImage, -25, -210, 50, 50);
      }
      
      // Score Panel
      // Fond
      gradiant = HUD_ctx.createLinearGradient(-450,0,-430,200);
      gradiant.addColorStop(0,"white");
      gradiant.addColorStop(1,"black");
      HUD_ctx.beginPath();
      HUD_ctx.fillStyle = gradiant;
      HUD_ctx.moveTo(-450, 100);
      HUD_ctx.lineTo(-400, 0);
      HUD_ctx.lineTo(0,0);
      HUD_ctx.lineTo(0,100);
      HUD_ctx.fill();
      
      gradiant = HUD_ctx.createLinearGradient(-450,0,-430,200);
      gradiant.addColorStop(1,"white");
      gradiant.addColorStop(0,"black");
      HUD_ctx.beginPath();
      HUD_ctx.strokeStyle = gradiant;
      HUD_ctx.moveTo(-435, 105);
      HUD_ctx.lineTo(-390, 15);
      HUD_ctx.lineTo(0,15);
      HUD_ctx.stroke();
      
      // Text
      HUD_ctx.fillStyle = "black";
      //  Score
      HUD_ctx.font = "30px Arial";
      HUD_ctx.fillText("Score :", -380,55);
      
      HUD_ctx.font = "50px Arial";
      HUD_ctx.fillText(gameScore, -275,80);
      
      //  FPS
      HUD_ctx.font = "15px Arial";
      HUD_ctx.fillText("FPS :", -400,80);
      HUD_ctx.fillText(fps, -360,80);
      
      // Compteur
      // Fond
      gradiant = HUD_ctx.createLinearGradient(-150,-150,150,150);
      gradiant.addColorStop(0,"white");
      gradiant.addColorStop(1,"black");
      HUD_ctx.beginPath();
      HUD_ctx.fillStyle = gradiant;
      HUD_ctx.arc(0,0,160, 0, 2*Math.PI);
      HUD_ctx.fill();
      
      gradiant = HUD_ctx.createLinearGradient(-100,-100,100,100);
      gradiant.addColorStop(1,"white");
      gradiant.addColorStop(0,"black");
      HUD_ctx.beginPath();
      HUD_ctx.strokeStyle = gradiant;
      HUD_ctx.arc(0,0,145, 0, 2*Math.PI);
      HUD_ctx.stroke();
      
      HUD_ctx.beginPath();
      gradiant = HUD_ctx.createLinearGradient(-100,100,100,-100);
      gradiant.addColorStop(0,"green");
      gradiant.addColorStop(0.5,"orange");
      gradiant.addColorStop(1,"red");
      HUD_ctx.strokeStyle = gradiant;
      HUD_ctx.arc(0,0,115, 145*Math.PI/180, 315*Math.PI/180);
      HUD_ctx.lineWidth = 20;
      HUD_ctx.stroke();
      
      
      // Aiguille
      HUD_ctx.rotate((-130 + 170*speed/speedMax)*Math.PI/180 );
      HUD_ctx.drawImage(ressourcesImg[img_speedometer1].htmlImage, -9, -105, 18, 112)
      HUD_ctx.restore();
      
      // -- Game --
      ctx.clearRect(0,0, canvas.width, canvas.height);

      // Affichage de tous les objets
      for(var i in drawable){
        for(var d in drawable[i]){
          drawable[i][d].draw();
        }
      }
      
      // + Affichage de la moto;
      moto.draw();
      
    //  Si la partie est finie, affichage du Game Over
    } else {
      // Affichage
      // -- HUD -- 
      HUD_ctx.clearRect(0,0, HUD.width, HUD.height);
      HUD_ctx.save();
      
      //  Mise en place du fond noir
      HUD_ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      HUD_ctx.fillRect(0,0, HUD.width, HUD.height);
      
      //  La tête de mort
      HUD_ctx.drawImage(ressourcesImg[img_game_over].htmlImage, 225, 100, 450, 356);
      
      // Game over
      HUD_ctx.font = '70px metroregular';
      HUD_ctx.fillStyle = "white";
      HUD_ctx.fillText  ('Game Over', 82, 570);
      
      //  Score
      HUD_ctx.font = '50px metroregular';
      HUD_ctx.fillText  ('Score : '+gameScore, 82, 650);
      
      //  Restart
      HUD_ctx.font = '40px metroregular';
      HUD_ctx.fillText  ('Press "Space"', 180, 750);
      HUD_ctx.fillText  ('to restart', 220, 800);
      
      HUD_ctx.restore();
      
      //  Play again ?
      if (inputStates.space){
        restart(ms);
      }
    }
    //  Calcul des FPS
    measureFPS(ms);
    //  Appel récursif de la gameLoop
    requestAnimationFrame(gameLoop);  
  };  

  function restart(ms){
    moto.restart();             // Réinitialise la moto
    voieBuffer = [[],[],[]];    // On clear les voitures en attente
    voieJam = [0,0,0];          // On clear les timers de spawn de voiture
    drawable = [[],[]];         // On retire tous les objets
    inputStates = { };          // On clear les inputs
    speed = 1;                  // On remet la vitesse à la vitesse de base
    spawn = 1;                  // On remet le compteur de pop de flaque à 1
    lastGameMS = ms;            // On stock le temps
    gameOver = false;           // La partie repart
    gameScore = 0;              // Avec un score de 0
    createVoiture(3);           // Et les 3 premières voitures
  }
  
  //  Methode de gestion des déplacements
  var UpdateMove = function(ms){
    //  Déplacement de la moto
    var sX = 0;
    if (!moto.isOil()){
      //  Déplacement à gauche
      if (inputStates.left){
        sX -= 1;
      }
      
      //  Déplacement à droite
      if (inputStates.right){
        sX += 1;
      }
      
      //  Accélération
      if (inputStates.up){
        speed += speed*speedAdd;
      } 
      //  Deccélération
      else {
        speed -= (speed/2)*speedAdd;
      }
      
      //  Freinage
      if (inputStates.down){
        speed -= speed*speedAdd;
      }
    }
    
    //  On vérifie que la vitesse reste entre le minimum et le maximum
    if (speed < speedMin) speed = speedMin;
    if (speed > speedMax) speed = speedMax;

    moto.move(sX, ms);
    
    //  On déplace le reste des objets
    for(var i in drawable){
      for(var d in drawable[i]){
        drawable[i][d].move(speed);
        //  Et on vérifie s'ls entrent en collision avec la moto
        if (moto.collision(drawable[i][d])){  //  Si collision
          if (i == 1){                        //    Avec une voiture
            gameOver = true;                  //      GameOver
          }
          if (i == 0){                        //    Avec une flaque
            moto.onOil(ms);                   //      Glissade de la moto
          }
        }
      }
    }
  };
  
  //  Méthode de gestion du pop des voitures
  var spawnVoiture = function(){
    for (var voie in voieBuffer){                               //  Pour chaqu'une des 3 voies
      if (voieBuffer[voie].length != 0 && voieJam[voie] <= 0){  //    S'il y a une voiture en attente et que la voie n'est pas bloquée
        var v = voieBuffer[voie].shift();                       //      On récupère la premère voiture du buffer
        drawable[1].push(v);                                    //      On l'ajoute à la liste des objets en jeu
        voieJam[voie] = 250;                                    //      On bloque la voie
      } else {                                                  //    Sinon
        voieJam[voie] -= speed -vitesse[voie];                  //      On attent que la voie se libère
      }
    }
  }
  
  //  Méthode d'ajout de voiture en jeu
  function createVoiture(n){
    for(var i = 0; i < n; i++){                                 //  Pour chaque voiture à ajouter
      var voie = parseInt(Math.random()*voies.length);          //    On lui attribue une voie aléatoirement
      var v = vitesse[voie];                                    //    On définie sa vitesse

      var b = new Voiture(voies[voie],-250,v, gameDep);                  //    On instancie une voiture
      voieBuffer[voie].push(b);                                 //    On l'ajoute au buffer de la voie correspondante
    }
  }
  
  //  Méthode d'ajout de flaque
  function createOil(){
    //  On place la flaque plus ou mins devant la moto
    var x = moto.gx()-100 + Math.random()*200;
    
    //  On s'assure qu'elle ne sorte pas de la route
    if (x < 55)
      x = 55;
    
    if (x > 610)
      x = 610;
    
    //  On créer une flaque et on l'ajoute à la liste des flaques en jeu
    var o = new Oil(x,-250, gameDep);
    drawable[0].push(o);
  }

  //  Initialisation de la partie
  var init = function(){ 
  //  Chargement des images
  //    Moto
  ressourcesImg.push(new Images("IMG/Bike.png", 50, 100, gameDep));
  gameDep.img_moto = img_moto = ressourcesImg.length -1;
  //    Voiture
  ressourcesImg.push(new Images("IMG/Car.png", 120, 190, gameDep));
  gameDep.img_voiture = img_voiture = ressourcesImg.length -1;
  //    Flaque d'huile
  ressourcesImg.push(new Images("IMG/Oil.png", 50,50, gameDep));
  gameDep.img_oil = img_oil = ressourcesImg.length -1;
  //    Aiguille du compteur
  ressourcesImg.push(new Images("IMG/speedmeter01.png", 18,112, gameDep));
  gameDep.img_speedometer1 = img_speedometer1 = ressourcesImg.length -1;
  //    Indicateur de glisse
  ressourcesImg.push(new Images("IMG/chaussee-glissante-arago.png", 50,50, gameDep));
  gameDep.img_glisse_actif = img_glisse_actif = ressourcesImg.length -1;
  //    GameOver
  ressourcesImg.push(new Images("IMG/Dead.png", 400,316, gameDep));
  gameDep.img_game_over = img_game_over = ressourcesImg.length -1;
  
    // Réalisation de la route
    ground_ctx.fillRect(50,0,700,900);
    ground_ctx.fillStyle = "darkgrey";
    ground_ctx.fillRect(55,0,690,900);
    ground_ctx.fillStyle = "yellow";
    ground_ctx.fillRect(145,0,5,900);
    ground_ctx.fillRect(155,0,5,900);

    ground_ctx.fillRect(655,0,5,900);
    ground_ctx.fillRect(645,0,5,900);

    ground_ctx.fillRect(321,0,5,900);

    ground_ctx.fillRect(483,0,5,900);

    //  Mise en place des premiers éléments
    moto = new Moto(gameDep);
    createVoiture(3);


    //add the listener to the main, window object, and update the states  
    window.addEventListener('keydown', function(event){  
      if (event.keyCode === 37) {  
        inputStates.left = true;  
      } else if (event.keyCode === 38) {  
        inputStates.up = true;  
      } else if (event.keyCode === 39) {  
        inputStates.right = true;  
      } else if (event.keyCode === 40) {  
        inputStates.down = true;  
      }  else if (event.keyCode === 32) {  
        inputStates.space = true;  
      }  
    }, false);  

    //if the key will be released, change the states object   
    window.addEventListener('keyup', function(event){  
      if (event.keyCode === 37) {  
        inputStates.left = false;  
      } else if (event.keyCode === 38) {  
        inputStates.up = false;  
      } else if (event.keyCode === 39) {  
        inputStates.right = false;  
      } else if (event.keyCode === 40) {  
        inputStates.down = false;  
      } else if (event.keyCode === 32) {  
        inputStates.space = false;  
      }
      
    }, false);   
  };
  
  //  Lancement de la prtie
  var start = function(){
    //  On charge les tableaux de pixels
    ressourcesImg.forEach(function(img, k){
      ctx.drawImage(img.htmlImage, 0, 0, img.l, img.h);
      img.imgData = ctx.getImageData(0, 0, img.l, img.h).data;
      ctx.clearRect(0,0,canvas.width, canvas.height);
    });
    
    //  On lance la gameLoop
    requestAnimationFrame(gameLoop);  
  };     
  
  //  Méthode d'incrémentation du score
  var score = function(){
    //  On vérifie que la moto n'est pas sur une bande d'arrêt d'urgence
    var mx = moto.gx();
    if (mx < 145 || mx > 655) return;
    
    //  On incrémente le score en foncton de la vitesse de la moto
    gameScore += Math.round(3 * speed/speedMax);
  }

  var measureFPS = function(newTime){  

    // test for the very first invocation  
    if(lastTime === undefined) {  
      lastTime = newTime;   
      return;  
    }  

    //calculate the difference between last & current frame  
    var diffTime = newTime - lastTime;   

    if (diffTime >= 1000) {  
      fps = frameCount;      
      frameCount = 0;  
      lastTime = newTime;  
    }  

    //and display it in an element we appended to the   
    // document in the start() function   
    frameCount++;  
  }; 
  
  //API
   var gameDep = {
    canvas : canvas,
    ctx : ctx,
    voies : voies,
    vitesse : vitesse,
    voieBuffer : voieBuffer,
    voieJam : voieJam,
    
    // Loader
    nbRessource : nbRessource,
    RessourceLoad : RessourceLoad,
    ressourcesImg : ressourcesImg,
    
    img_moto : img_moto,
    img_voiture : img_voiture,
    img_oil : img_oil,
    img_speedometer1 : img_speedometer1,
    img_glisse_actif : img_glisse_actif,
    img_game_over : img_game_over,
    
    start: start,
    createVoiture:createVoiture,
    score:score
  }
  
  return {  
    init: init
  };  
}
