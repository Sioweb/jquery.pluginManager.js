(function ($) {

	var innerObject = null;
	/* Enter PluginOptions */
	$.coreDefault = {};
	$.coreDefault.head = function ($, pluginName, defaultOptions, PluginClass) {
		
		if(pluginName !== 'core') {
			pluginName = innerObject.prefixed(pluginName);
		}
		
		$[pluginName] = $.fn[pluginName] = function (settings) {
			var needs = (function(func) {
					var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
					return args.split(',').map(function (arg) {
						return arg.replace(/\/\*.*\*\//, '').trim();
					}).filter(function (arg) {
						return arg;
					});
				})(PluginClass),
				element = typeof this === 'function' ? $('html') : this,
				newData = arguments[1] || {},
				returnElement = [];
			
			returnElement[0] = element.each(function (k, i) {
				var pluginClass = $.data(this, pluginName),
					elementObj = this,
					setup = function(pluginClass, settings, defaultOptions, elementObj) {
						var newOptions = $.extend(true, {}, defaultOptions, pluginClass);

						if (settings) {
							newOptions = $.extend(true, {}, newOptions, settings);
						}

						pluginClass = $.extend(newOptions, pluginClass);
						/** Initialisieren. */
						elementObj[pluginName] = pluginClass;
						var init = pluginClass.init(elementObj);
						
						if(init !== undefined) {
							innerObject = $.extend(true, {}, innerObject, init());
							$(elementObj).data(innerObject.name+'-namespace', init);
							$(elementObj).data(innerObject.name+'-namespace')().ready();
						}

						if (element.prop('tagName').toLowerCase() !== 'html') {
							$.data(elementObj, pluginName, pluginClass);
						} else {
							returnElement[1] = pluginClass;
						}

						if(pluginClass.setupDone !== undefined) {
							pluginClass.setupDone(pluginClass);
						}
					};
				
				if (!settings || typeof settings === 'object' || settings === 'init') {
					if (!pluginClass) {
						if (settings === 'init') {
							settings = arguments[1] || {};
						}

						if(needs.length) {
							!function(needs,n) {
								var call = arguments.callee;
							    if(n < needs.length) {
									if(needs[n] === 'core') {
										needs[n] = $(elementObj).data(innerObject.name+'-namespace');
										call(needs, n + 1);
										return;
									} else if (needs[n] === 'coreObj') {
										needs[n] = $(elementObj).data(innerObject.name+'-namespace')();
										call(needs, n + 1);
										return;
									} else {
										$(elementObj).data(innerObject.name+'-namespace')().plugin(needs[n], function($plugin, _obj) {
											needs[n] = $plugin;
											call(needs, n + 1);
											return;
										});
									}
							    } else {
									setup(new function() {
										PluginClass.apply(this, needs);
										return this;
									}, settings, defaultOptions, elementObj);
								}
							}(needs, 0);
						} else {
							setup(new PluginClass(), settings, defaultOptions, elementObj);
						}
					} else {
						pluginClass.init(elementObj, 1);
						if (element.prop('tagName').toLowerCase() !== 'html') {
							pluginClass.init(elementObj, 1);
							$.data(elementObj, pluginName, pluginClass);
						} else returnElement[1] = pluginClass;
					}
				} else if (!pluginClass) {
					return;
				} else if (pluginClass[settings]) {
					var method = settings;
					returnElement[1] = pluginClass[method](newData);
				} else {
					return;
				}
			});

			if (returnElement[1] !== undefined) return returnElement[1];
			return returnElement[0];
		};
	};
	
	$.coreDefault.head($, 'core', {
		title: '',
		version: '',

		debug: true,
		enabled: true,
		container: window,
		isHtml: false,

		source: '',
		pluginPath: 'plugins',
		pluginPathCore: 'core',

		name: 'pm',
		prefix: 'pm_',

		corePlugins: {
			i18n: {},
			handler: {},
			config: {}
		},
		
		plugins: {},
		$plugins: {},
		
		pluginLoaded: function () { },
		allPluginsLoaded: function () { },
		pluginStackLoaded: function () { },

		internalEvents: {
			init: {},
			pluginsLoaded: {},

			mousemove: {},
			mousedown: {},
			mouseup: {},
			resize: {}
		}
	}, function () {

		var selfObj = this;

		this.item = false;

		this.resizeWindowTimeout = false;

		this.init = function (elem) {
			selfObj = this;
			
			if (!this.container) {
				this.container = window;
			}
			
			this.elem = elem;
			this.isHTML = this.elem.tagName.toLowerCase() === 'html';

			this.item = $(this.elem);
			if(this.item.data(this.name+'-namespace') === undefined) {
				this.data.bind({selector: this.elem})('namespace', this.uuid());
			}

			if (this.container === 'item') {
				if(this.isHTML) {
					this.container = $('body');
				} else {
					this.container = this.item;
				}
			} else {
				this.container = $(this.container);
			}

			return (function ($, _tmpObj) {
				return (function () {
					var plugin = function (sel) {
						return $.extend(_tmpObj, new plugin.fn.newClass(sel));
						// return $.extend(true, {}, _tmpObj, new plugin.fn.newClass(sel));
					};
					plugin.fn = plugin.prototype = {
						newClass: function (sel) {
							if(sel) {
								this.selector = sel;
							} else if (_tmpObj !== undefined && _tmpObj.elem !== undefined) {
								this.selector = _tmpObj.elem;
							}
							return this;
						}
					};
					
					return plugin;
				})();
			})($, selfObj);
		};

		this.prefixed = function(value) {
			if(value === 'core') {
				return 'core';
			}
			return selfObj.prefix + value;
		},

		this.ready = function() {
			selfObj.load({
				defer: true,
				source: selfObj.source + selfObj.pluginPathCore,
				plugins: selfObj.corePlugins,
				done: function () {
					selfObj.load({
						source: selfObj.source + selfObj.pluginPath,
						plugins: selfObj.plugins,
						done: selfObj.loaded,
						defer: true
					});
				}
			});
		};

		this.get = function(el) {
			return $(el.selector);
		};

		this.data = function(selector) {
			var value = arguments[1]||null,
				$el = selfObj.get(this),
				noRoot = arguments[2]||false;
			
			if(arguments[1] === '') {
				value = '';
			}
			
			if(!noRoot) {
				selector = selfObj.name + '-' + selector;
			}

			if(value === null) {
				return $el.data(selector);
			}
			
			$el.data(selector, value);
			$el[0].setAttribute('data-'+selector, value);
		};

		this.imgLoaded = function(callback) {
			var $el = selfObj.get(this),
				loaded = 1;
			
			if($el.length) {
				$el.bind('load',function() {
					if((loaded++) == $el.length) {
						callback(this);
					}
				}).each(function(){if(this.complete) {$(this).trigger('load');}});
			} else {
				callback(this);
			}
		};

		this.hexToRgb = function(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			if(typeof hex === 'object') {
				return hex;
			}
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		};

		this.uuid = function () {
			var s4 = function () {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		};

		this.diff_objects = function(prev) {
			var diff = {},
				origin = arguments[1]||selfObj;
			
			for (var prop in prev) {
				if (origin[prop] === undefined) {
					diff[prop] = prev[prop];
				}
			}
			return diff;
		};

		this.disable = function () {
			selfObj.enabled = false;
		};

		this.enable = function () {
			selfObj.enabled = true;
		};

		this.loaded = function () {
			for(var p in selfObj.$plugins) {
				if(
					selfObj.$plugins[p].ready !== undefined &&
					typeof selfObj.$plugins[p].ready === 'function'
				) {
					selfObj.$plugins[p].ready();
				}
			}

			selfObj.allPluginsLoaded.apply(selfObj, arguments);

			$(window).resize(function(e) {
				selfObj.fire('resize', {}, e);
			})
		};
		
		this.nl2br = function(str, is_xhtml) {
			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
		};

		this.registrateNewEvent = function (data) {
			selfObj.internalEvents = $.extend(selfObj.internalEvents, data.events);
		};

		this.registrateEvent = function (data) {
			var events = data.event.split(',');

			data.skip = false; // standard skip-Wert damit in this.fire keine Konflikte entstehen
			for (var e in events) {
				if (selfObj.internalEvents[events[e]] !== undefined) {
					if (data.index === undefined) {
						selfObj.internalEvents[events[e]][Object.keys(selfObj.internalEvents[events[e]]).length] = data;
					} else {
						selfObj.internalEvents[events[e]].splice(data.index, 0, data);
					}
				}
			}
		};

		/**
		 * Event-Optionen
		 * - timeout: true||integer; so lange kann das Event nicht ausgeführt werden
		 * - callback: function()
		 * - options: object()
		 */
		this.fire = function (runEvents) {
			var options = arguments[1] || {},
				e = arguments[2] || {},
				runEvents = runEvents.split(',');

			options = $.extend({}, true, options, {});

			options = $.extend({}, true, options, {
				event: ''
			});

			for (var eKey in runEvents) {
				if (selfObj.internalEvents[runEvents[eKey]] !== undefined) {
					options.event = runEvents[eKey];
					$.each(selfObj.internalEvents[runEvents[eKey]], function (internEvent, eventData) {
						if (!eventData.skip && eventData.timeout !== undefined && eventData.timeout) {
							var timeout = eventData.timeout;
							if (typeof timeout === 'boolean') {
								timeout = 1000;
							}

							if (!eventData.skip) {
								eventData.callback(options, e);
							}

							eventData.skip = true;
							setTimeout(function () {
								eventData.skip = false;
							}, timeout);

						} else {
							eventData.callback(options, e);
						}
					});
				}
			}
		};

		this.plugin = function (plugin) {
			var fallback = arguments[1] || function() {};
			if (selfObj.$plugins[plugin] !== undefined) {
				fallback(selfObj.$plugins[plugin]);
				return selfObj.$plugins[plugin];
			} else {
				var load = {
					source: selfObj.source + selfObj.pluginPath,
					plugins: {},
					defer: true,
					done: function(_obj) {
						fallback(selfObj.$plugins[plugin], _obj);
					}
				};

				load.plugins[plugin] = selfObj.plugins[plugin];
				selfObj.load($.extend(true, {}, load));
				return null;
			}
			return null;
		};

		this.promiseCallback = function (promiseCallback, obj) {
			if (typeof promiseCallback !== 'object' || promiseCallback.length !== 2) {
				return false;
			}
			promiseCallback[0](promiseCallback[1], obj);
		};

		this.before = function (callback) {
			callback(selfObj);
			return this;
		};

		this.load = function () {
			var data = arguments[0] || {},
				countPlugins = 0,
				pluginIndex = 0;

			data = $.extend({
				source: '/',
				item: null,
				plugins: {},
				html: false,
				defer: false,
				async: false,
				done: function () {}
			}, data);

			countPlugins = Object.keys(data.plugins).length;

			var loadPlugin = function (plugin, options, data) {
				var loadNext = arguments[3] || false,
					_loader = function() {
						pluginIndex++;
						
						selfObj.innerPluginLoaded(plugin, options, function() {
							if (loadNext && Object.keys(data.plugins)[0] !== undefined) {
								var nextPlugin = Object.keys(data.plugins)[0],
									pluginOptions = $.extend(true, {}, data.plugins[nextPlugin]);
									
								data.plugins[nextPlugin] = null;
								delete data.plugins[nextPlugin];

								if (nextPlugin !== undefined) {
									if (selfObj.$plugins[plugin].promise === undefined) {
										loadPlugin(nextPlugin, pluginOptions, data, true);
									} else {
										selfObj.$plugins[plugin].promise(function (args, pluginObj) {
											loadPlugin.apply(this, args);
										}, [nextPlugin, pluginOptions, data, true]);
									}
								} else if(selfObj.$plugins[plugin].promise !== undefined) {
									selfObj.$plugins[plugin].promise(function() {}, []);
								}
							} else {
								data.done(selfObj);
								selfObj.pluginStackLoaded(data, countPlugins);
								selfObj.fire('pluginsLoaded', {
									data: data,
									countPlugins: countPlugins
								});
							}
						});
					};
				
				if($[selfObj.prefixed(plugin)] !== undefined) {
					_loader();
				} else {
					$.getScript(data.source + '/' + plugin + '.js', function () {
						_loader();
					});
				}
			};

			if (!data.defer) {
				$.each(data.plugins, function (plugin, options) {
					loadPlugin(plugin, options, data);
				});
			} else {
				var nextPlugin = Object.keys(data.plugins)[0],
					nextPLuginOptions = $.extend(true, {}, data.plugins[nextPlugin]);

				data.plugins[nextPlugin] = null;
				delete data.plugins[nextPlugin];

				if (nextPlugin !== undefined) {
					loadPlugin(nextPlugin, nextPLuginOptions, data, true);
				}
			}

			return this;
		};

		this.innerPluginLoaded = function(plugin, options, callback) {
			if (selfObj.$plugins[plugin] === undefined) {
				options.setupDone = function(pluginClass) {
					selfObj.$plugins[plugin] = pluginClass;
					callback();
				}; 
				$(selfObj.item)[selfObj.prefixed(plugin)](options)[0][selfObj.prefixed(plugin)];
				selfObj.pluginLoaded(plugin, options, false);
			} else if(typeof selfObj.$plugins[plugin] === 'function') {
				selfObj.$plugins[plugin](options);
				callback();
				selfObj.pluginLoaded(plugin, options, true);
			} else if(typeof selfObj.$plugins[plugin] === 'object') {
				callback();
			}
		};
	});

})(jQuery);
