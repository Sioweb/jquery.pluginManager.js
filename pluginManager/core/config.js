(function($){

	"use strict";

	var pluginName = 'pm_config',
			PluginClass;


	/* Enter PluginOptions */
	$[pluginName+'Default'] = {
		enabled: true,
		container: window,
		isHtml: false,

		extend: false,
		options: {},
		prefix: 'pm_',
	};
	

	PluginClass = function() {

		var selfObj = this,
				rootObj,style;
				
		this.initOptions = new Object($[pluginName+'Default']);

		this.item = false;
		this.ctx  = null;

		this.init = function(elem) {
			selfObj = this;
			rootObj = selfObj.rootObj;
			style = rootObj.plugin('style');

			if(!this.container)
				this.container = window;
			this.elem = elem;
			this.item = $(this.elem);
			this.container = $(this.container);
			this.isHTML = selfObj.item[0].tagName.toLowerCase() === 'html';

			this.loaded();
		};

		this.disable = function() {
			selfObj.enabled = false;
		};

		this.enable = function() {
			selfObj.enabled = true;
		};

		this.get = function(data) {
			var config = {};

			if(typeof data.options === 'object') {
				for(var o in options) {
					if(selfObj.options[selfObj.prefix+o] !== undefined) {
						config[selfObj.prefix+o] = selfObj.options[selfObj.prefix+o];
					} else {
						config[selfObj.prefix+o] = localStorage.getItem(selfObj.prefix+o);
						if(config[selfObj.prefix+o] !== null)
							config[selfObj.prefix+o] = JSON.parse(data.options[selfObj.prefix+o]);
					}
				}
			} else {
				if(selfObj.options[selfObj.prefix+data] !== undefined) {
					config = selfObj.options[selfObj.prefix+data];
				} else {
					config = localStorage.getItem(selfObj.prefix+data);
					if(config !== null)
						config = JSON.parse(config);
				}
			}
			
			return config;
		};

		this.set = function(data) {
			if(Object.keys(data).length) {
				for(var o in data) {
					localStorage.setItem(selfObj.prefix+o, JSON.stringify(data[o]));
					selfObj.options[selfObj.prefix+o] = data[o];
				}
			}
		};

		this.loaded = function() {};
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
          } else returnElement[1] = pluginClass;
        } else {
          pluginClass.init(this,1);
          if(element.prop('tagName').toLowerCase() !== 'html') {
            $.data(this, pluginName, pluginClass);
          } else returnElement[1] = pluginClass;
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
