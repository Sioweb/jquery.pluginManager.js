(function($){

  "use strict";

  var pluginName = 'pm_url';

  /* Enter PluginOptions */
  $[pluginName+'Default'] = {
    parameters: {}
  };
  
  $.viewerDefault.head($,pluginName,function() {

    var selfObj = this,
        rootObj;
    this.initOptions = new Object($[pluginName+'Default']);
    
    this.init = function(elem) {
      selfObj = this;
      rootObj = selfObj.rootObj;
    };

    this.setParameter = function(param,value) {
      var paramValue = selfObj.get(param),
          location = window.location.href,
          regex = new RegExp(param+'=[^&]*'),
          newURL = location.replace(regex,param+'='+value);

      if(newURL.indexOf(param+'=') === -1)
        newURL += (newURL.indexOf('?') === -1?'?':'')+param+'='+value;

      history.pushState({}, "", newURL);
    };

    this.setParameters = function(data) {};

    this.setUrl = function() {};

    this.getParameterByName = function(name, url) {
      return selfObj.get(name, url);
    };

    /**
     * Get URL-Parameter
     * Bsp.: Seiten-Zahl mit ?page=1 würde 1 zurückgeben
     */
    this.get = function(name, url) {
      if(!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
      
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
  });
  
})(jQuery);
