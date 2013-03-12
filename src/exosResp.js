          function allowDrop(ev)
          {
                  if(ev.target.id=="box_inf" || ev.target.id=="box_sup"){
                                        ev.preventDefault();
                }
          }

          function drag(ev)
          {
                  ev.dataTransfer.setData("Text",ev.target.id);
          }

          function drop(ev)
          {
                  ev.preventDefault();
                  var data=ev.dataTransfer.getData("Text");
                  ev.target.appendChild(document.getElementById(data));
                                  
          }

          function validation()
          {
            var error = 0;
            var child = document.getElementById('box_sup').childNodes;
            var nb = child.length;
            for(var i = 0; i < nb; i++){
              if(child[i].nodeType==1){
                //alert(child[i].nodeType +"/"+ child[i].childNodes[0].nodeValue);
                var id = child[i].getAttribute('id');//recup l'id de la div
                  if(id=="item1" || id=="item2" || id=="item3" || id=="item4"){ 
                    document.getElementById(id).style.color='green';//modif la couleur de l'element
                  }
                  else{
                    document.getElementById(id).style.color='red';//modif la couleur de l'element
                    error += 1;
                  }
                }else{//main div
                //alert(child[i].nodeType +"-"+ child[i].nodeValue);
                }
            child[i].draggable = false;
            }

            var child_inf = document.getElementById('box_inf').childNodes;
            var nb = child_inf.length;
            for(var i = 0; i < nb; i++){
              if(child_inf[i].nodeType==1){
                //alert(child_inf[i].nodeType +"/"+ child_inf[i].childNodes[0].nodeValue);
                var id = child_inf[i].getAttribute('id');//recup l'id de la div
                  if(id=="item5" || id=="item6" || id=="item7" || id=="item8" || id=="item9"){ 
                    document.getElementById(id).style.color='green';//modif la couleur de l'element
                  }
                  else{
                    document.getElementById(id).style.color='red';//modif la couleur de l'element
                    error += 1;
                  }
                }else{//main div
                //alert(child[i].nodeType +"-"+ child[i].nodeValue);
                }
            child_inf[i].draggable = false;
            }
            //alert(error);
            reportScore(error);
                        if (confirm("Tu as fait "+error+" erreurs!\n[Ok] = Continuer\n[Annuler] = Retour aux thèmes")){
                                //document.location.href='...';
                        }
                        else{
                                //document.location.href='...';
                        }
          }