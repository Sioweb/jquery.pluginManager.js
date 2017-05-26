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

  $.pluginCoreDefault.head($,pluginName,function() {

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
	});
  
})(jQuery);
