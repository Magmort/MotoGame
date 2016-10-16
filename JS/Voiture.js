// Classe des ennemis à éviter

var Voiture = function(X,Y,V,DEP){
  var sup = new Drawable(X,Y);                  //  Héritage de Drawable
  var l = 120, h = 190;                         //  Largeur et Hauteur de l'image
  var v = V;                                    //  Vitesse de la voiture
  var img = DEP.ressourcesImg[DEP.img_voiture]; //  On récupère l'image de la voiture
  var depasse = false;                          //  Boolean qui indique si la voiture à déjà été dépassée

  // Overwrite de la fonction draw de Drawable
  var superDraw = sup.draw;
  sup.draw = function(){
    if (sup.gy() > DEP.canvas.height || sup.gy()+h < 0){          //  Si la voiture est en dehors du canvas
      return;                                                     //  On ne l'affiche plus
    }
    
    if (sup.gy() > 800 && !depasse){                              //  Si la voiture est dépassée pour la première fois
      depasse = true;                                             //  On indique qu'elle est dépassée
      DEP.score();                                               //  On actualise le score
      DEP.createVoiture(1);                                      //  On ajoute une nouvelle voiture
    }
    
    //  Affichage de la voiture
    
    DEP.ctx.save();
    superDraw(DEP);
 
    DEP.ctx.drawImage(img.htmlImage, -l/2, 0, l, h);
    DEP.ctx.restore();
  };
  
  //  Overwrite la methode move
  var superMove = sup.move;
  sup.move = function(s){                                         //  La voiture reste sur sa voie et sa position Y est calculée en fonction 
    superMove(sup.gx(), sup.gy()+(s-v));                          //  da sa dernière position et de la différence de vitesse entre elle et la moto
  };
  
  //  GET
  sup.getl = function(){
    return l;
  };
  
  sup.geth = function(){
    return h;
  };
  
  sup.getData = function(){
    return img.imgData;
  }

  //  API
  return{
    draw:sup.draw,
    move:sup.move,
    gx:sup.gx,
    gy:sup.gy,
    gl:sup.getl,
    gh:sup.geth,
    imgData:sup.getData
  }
};