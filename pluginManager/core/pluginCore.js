(function($){

	"use strict";

	var pluginName = (typeof window.PluginClassPrefix !== 'undefined'?window.PluginClassPrefix+'_':'')+'pluginCore',
			PluginClass;

	/* Enter PluginOptions */
	$[pluginName+'Default'] = {
		debug: true,
		enabled: true,
		container: window,
		isHtml: false,

		source: '',
		pluginPath: 'plugins',
		pluginPathCore: 'core',

		corePlugins: {
			url: {
				parameters: {
					pages: 'page',
				}
			},
			style: {},
			config: {},
			toolbar: {},
			bookflip: {},
			pagination: {},
			contextmenu: {},
			page: {},
			edit: {}
		},

		plugins: {
			share: {},
			zoomable: {},
			fullscreen: {},
			media: {}
		},
	};
	

	PluginClass = function() {

		var selfObj = this,
				style,
				pluginManager;

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

			$.getScript(selfObj.source+selfObj.pluginPathCore+'/pluginManager.js',function() {
				if(selfObj.plugins) {
					pluginManager = $.pluginManager({
						rootObj: selfObj,
						source: selfObj.source
					})
					.load({
						defer: true,
						source: selfObj.source+selfObj.pluginPathCore,
						plugins: selfObj.corePlugins,
						done: function(managerObj) {
							managerObj.load({
								source: selfObj.source+selfObj.pluginPath,
								plugins: selfObj.plugins,
								done: selfObj.loaded
							});
						}
					});
				}
			});
		};

		this.disable = function() {
			selfObj.enabled = false;
		};

		this.enable = function() {
			selfObj.enabled = true;
		};

		this.loaded = function() {
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
					if(element.prop('tagName').toLowerCase() !== 'html')
						$.data(this, pluginName, pluginClass);
				} else {
					pluginClass.init(this,1);
					if(element.prop('tagName').toLowerCase() !== 'html')
						$.data(this, pluginName, pluginClass);
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
