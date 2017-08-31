define("ent_game_heros_lover#1.0.3/template" , ["artTemplate#3.0.3"] , function(artTemplate){
   artTemplate = new artTemplate();
   var _template = {};
   _template.helper = function(name, helper){
      artTemplate.helper(name, helper);
   }
   return _template;
});