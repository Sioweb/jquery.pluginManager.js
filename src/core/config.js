(function ($) {

	"use strict";

	$.coreDefault.head($, 'config', {
		options: {},
		useStorage: false
	}, function (core, coreObj, handler) {
		var selfObj = this;

		this.init = function () {
			var config = {};
			selfObj = this;

			selfObj.container = coreObj.prefixed(coreObj.title);

            coreObj.registrateNewEvent({
                events: {
                    setConfig: {}
                }
            });
			
			config = coreObj.item.data(coreObj.name);
			if (selfObj.storage() === null) {
				selfObj.options = selfObj.storage(JSON.stringify(selfObj.options));
			} else {
				selfObj.options = selfObj.storage();
			}

			if(typeof config === 'object') {
				selfObj.options = $.extend(true, {}, config, selfObj.options);
			}
		};

		this.ready = function() {
			var Template;
			if(Object.keys(selfObj.get('configStorage')).length) {
				Template = '<input name="'+selfObj.get('configStorage')+'" value=\''+JSON.stringify(selfObj.get())+'\'>';
				core(handler.add('configStorage', $(Template).appendTo(coreObj.item))).data('config-storage','');
			}
		};

		this.get = function () {
			var data = arguments[0]||null,
				config = {};

			if(data === null) {
				return selfObj.options;
			}

			
			if (typeof data.options === 'object') {
				for (var o in options) {
					if (selfObj.options[o] !== undefined) {
						config[o] = selfObj.options[o];
					}
				}
			} else {
				if (selfObj.options[data] !== undefined) {
					config = selfObj.options[data];
				}
			}

			return config;
		};

		this.set = function (data) {
			if (Object.keys(data).length) {
				for (var o in data) {
					selfObj.options[o] = data[o];
				}
				selfObj.storage(selfObj.options);

				if(handler.get('configStorage') !== false) {
					handler.get('configStorage').attr('value',JSON.stringify(selfObj.get()));
				}

				coreObj.fire('setConfig',{
					data: data,
					config: selfObj.options,
					plugin: selfObj
				})
			}
		};

		this.storage = function () {
			var value = arguments[0] || null,
				data = null,
				evenIfNull = arguments[1] || false;

			if(!selfObj.useStorage) {
				return selfObj.options;
			}

			if (value !== null || evenIfNull) {
				localStorage.setItem(selfObj.container, JSON.stringify(value));
				if(handler.get('configStorage') !== false) {
					handler.get('configStorage').attr('value',JSON.stringify(selfObj.get()));
				}
			}

			data = localStorage.getItem(selfObj.container);
			if (data !== null) {
				data = JSON.parse(data);
				if(data === '{}') {
					return {};
				}
				return data;
			}
			return null;
		};
	});

})(jQuery);
