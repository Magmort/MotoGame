// Classe Abstraite 
// Définie la base de tous les Objets affichés dans le jeu

var Drawable = function(X,Y){
  var x = X;
  var y = Y;

  // Fonction d'affichage appelée dans la game-loop
  var draw = function(DEP){
    DEP.ctx.translate(x,y);
  }

  // Accesseur aux coordonnées pour déplacer un objet
  var move = function(X, Y){
    x = X;
    y = Y;
  }

  // Les getteurs pour les coordonnées de l'objet
  var getX = function(){
    return x;
  }

  var getY = function(){
    return y;
  }
  
  // API
  return {
    draw:draw,
    move:move,
    gx:getX,
    gy:getY
  }
};