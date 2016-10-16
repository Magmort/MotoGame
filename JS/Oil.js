//  Classe des flaques d'huile

var Oil = function(X,Y,DEP){
  var sup = new Drawable(X,Y);                        //  Héritage de Drawable
  var l = 110, h = 80;                                //  Largeur et hauteur de l'image
  var img = DEP.ressourcesImg[DEP.img_oil];                   //  L'image de la flaque d'huile

  //  Overwrite de la méthode draw
  var superDraw = sup.draw;
  sup.draw = function(){
    if (sup.gy() > DEP.canvas.height || sup.gy()+h < 0){  //  Si l'objet est en dehors du canvas
      return;                                         //  On ne l'affiche pas
    } 
    
    //  Affichage
    DEP.ctx.save();
    superDraw(DEP);
    
    DEP.ctx.drawImage(img.htmlImage, -l/2, 0, l, h);
    DEP.ctx.restore();
  };

  //  Overwrite de la methode move
  var superMove = sup.move;
  sup.move = function(s){
    superMove(sup.gx(), sup.gy()+s);                  //  La flaque d'huile descend à la vitesse de la moto
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