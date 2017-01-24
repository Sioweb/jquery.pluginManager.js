(function($){

  "use strict";

  var pluginName = 'pm_url',
      PluginClass;


  /* Enter PluginOptions */
  $[pluginName+'Default'] = {
    debug: true,
    enabled: true,
    container: window,
    isHtml: false,

    parameters: {}
  };
  

  PluginClass = function() {

    var selfObj = this;
    this.item = false;
    this.initOptions = new Object($[pluginName+'Default']);
    
    this.init = function(elem) {
      selfObj = this;

      if(!this.container)
        this.container = window;
      this.elem = elem;
      this.item = $(this.elem);
      this.container = $(this.container);
      this.isHTML = selfObj.elem.tagName.toLowerCase() === 'html';

      this.loaded();
    };

    this.disable = function() {
      selfObj.enabled = false;
    };

    this.enable = function() {
      selfObj.enabled = true;
    };

    this.loaded = function() {
    };



    /**
     * Get URL-Parameter
     * Bsp.: Get page number with ?page=1 würde 1 zurückgeben
     */
    this.getParameterByName = function(name, url) {
      if(!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
      
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    };


  };

  $[pluginName] = $.fn[pluginName] = function(settings) {
    var element = typeof this === 'function'?$('html'):this,
        newData = arguments[1]||{},
        returnElement = [];
        
    returnElement[0] = element.each(function(k,i) {
      var pluginClass = $.data(this, pluginName);

      if(!settings || typeof settings === 'object' || settings === 'init') {

        if(!pluginClass) {
          if(settings === 'init')
            settings = arguments[1] || {};
          pluginClass = new PluginClass();

          var newOptions = new Object(pluginClass.initOptions);

          /* Space to reset some standart options */

          /***/

          if(settings)
            newOptions = $.extend(true,{},newOptions,settings);
          pluginClass = $.extend(newOptions,pluginClass);
          /** Initialisieren. */
          this[pluginName] = pluginClass;
          pluginClass.init(this);
          if(element.prop('tagName').toLowerCase() !== 'html') {
            $.data(this, pluginName, pluginClass);
          } else {
            returnElement[1] = pluginClass;
          }
        } else {
          pluginClass.init(this,1);
          if(element.prop('tagName').toLowerCase() !== 'html') {
            $.data(this, pluginName, pluginClass);
          } else {
            returnElement[1] = pluginClass;
          }
        }
      } else if(!pluginClass) {
        return;
      } else if(pluginClass[settings]) {
        var method = settings;
        returnElement[1] = pluginClass[method](newData);
      } else {
        return;
      }
    });

    if(returnElement[1] !== undefined) return returnElement[1];
      return returnElement[0];

  };
  
})(jQuery);
