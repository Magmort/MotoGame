 // Classe de gestion des images
 
 var Images = function(src, l, h, Dep){
  Dep.nbRessource++;                            //  A l'initialisation on indique qu'on charge une nouvelle ressource
  var htmlImage = new Image();                  //  On prépare l'image
  var imgData = null;                           //  On prépare le tableau de pixels
  
  htmlImage.src = src;                          //  On charge l'image
  
  htmlImage.onload = function() {               //  Une fois l'image chargée
    Dep.RessourceLoad++;                        //    On indique qu'une ressource est prêtes
    if (Dep.nbRessource == Dep.RessourceLoad){  //    Si c'était la dernière
      Dep.start();                             //      On lance le jeu
    } 
  };
  
  //  API
  return {
    htmlImage:htmlImage,
    imgData:imgData,
    l:l,
    h:h
  }
};