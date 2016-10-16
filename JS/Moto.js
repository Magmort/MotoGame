//  Classe de la moto

var Moto = function(Dep){
  var h = 100, l = 50;                            //  Hauteur et Largeur de l'image
  var sup = new Drawable(400, 650);               //  Hérite de Drawable
  var img = Dep.ressourcesImg[Dep.img_moto];      //  L'image de la moto
  
  //  Deplacement latéral
  var moveX = 0;                                  //  Vitesse de déplacement
  var turnSpeed = 0.2;                            //  Modifieur de la vitesse de déplacement
  
  //  Gestion de la Glissade
  sup.onOil = false;                              //  Est-ce que la moto glisse
  sup.oilTime = 0;                                //  Temps de glissade

  //  Overwrite de la fonction draw pour ajouter l'image
  var superDraw = sup.draw;
  sup.draw = function(){
    Dep.ctx.save();
    superDraw(Dep);

    Dep.ctx.drawImage(img.htmlImage, -l/2, 0, l, h);
    Dep.ctx.restore();
  }

  //  Overwrite de la fonction move
  var superMove = sup.move;
  sup.move = function(X, ms){
    if (sup.onOil){                     //  Si la moto glisse
      if (ms > sup.oilTime){            //    Si la glissade est finie
        sup.onOil = false;              //      Fin de glissade
      }
    } else {                            //  Si la moto de glisse pas
      if(X === 0){                      //    Si le joueur ne tourne pas
        if(moveX > 0){                  //      Et que la moto allait à droite
          moveX -= turnSpeed;           //        On redresse la moto
          if(moveX < 0) moveX = 0;      //        Et on stabilise à 0
        } else if (moveX < 0){          //      Ou que la moto allait à gauche
          moveX += turnSpeed;           //        On redresse la moto
          if (moveX > 0) moveX = 0;     //        Et on stabilise à 0
        }
      } else {                          //    Sinon le joueur tourne
        moveX += X*turnSpeed;           //      La moto tourne de plus en plus vite
      }
    }
      
    //  Calcule de la nouvelle position
    var new_x = sup.gx() + moveX;
    
    //  On verifie que la moto ne sort pas de a route
    if(new_x < 80){
      new_x = 80;
      moveX = 0;
    } 
    if(new_x > 720){
      new_x = 720;
      moveX = 0;
    }
    
    //  Actualisation de la position de la moto
    superMove(new_x, 650);
  }
  
  //  Méthode de détection des colision au pixel près
  sup.collision = function(object){
    //  Hauteur et Largeur de la cible
    var vh = Math.round(object.gh());
    var vl = Math.round(object.gl());
    
    //  Stockage des angles
    //    Angle supérieur gauche de la moto
    var mx = Math.round(sup.gx() - l/2);
    var my = Math.round(sup.gy());
    //    Angle supérieur gauche de la cible
    var vx = Math.round(object.gx() -vl/2);
    var vy = Math.round(object.gy());
    
    //  On vérifie s'il y a risque de collision
    if (vy > my+h || vy+vh < my) return false;

    if (vx > mx+l || vx+vl < mx) return false;

    //  Il y a un risque de collision donc on récupère les pixels des 2 objets
    var motoData = img.imgData;
    var vData = object.imgData();
    
    //  On détermine la zone à vérifier
    var checkZxMin = Math.max(vx, mx);
    var checkZxMax = Math.min(vx+vl, mx+l);
    
    var checkZyMin = Math.max(vy, my);
    var checkZyMax = Math.min(vy+vh, my+h);
    
    //  Pour chaque pixels de cette zone on vérifie si les images se superpose
    for(var px = checkZxMin; px < checkZxMax; px++){
      for(var py = checkZyMin; py < checkZyMax; py++){
        //  On vérfie l'alpha du pixel dans les 2 images
        if ( ( motoData [ ((px-mx ) + (py-my )*l )*4 + 3 ] !== 0 ) && ( vData[ ((px-vx) + (py-vy)*vl)*4 + 3 ] !== 0 )) {  // Si superposition
          return true;                                                                                                    //  Collision !
        }
      }
    }
    return false;
  }
  
  //  Méthode pour activer la glissade
  sup.oil = function(ms){
    sup.onOil = true;
    sup.oilTime = ms + 1000;
  }
  
  sup.isOil = function() {
    return sup.onOil;
  }
  
  sup.restart = function(){
    sup.onOil = false;
    sup.oilTime = 0;
    moveX = 0;
  }

  return{
    gx:sup.gx,
    draw:sup.draw,
    move:sup.move,
    collision:sup.collision,
    onOil:sup.oil,
    isOil:sup.isOil,
    restart:sup.restart
  }
};