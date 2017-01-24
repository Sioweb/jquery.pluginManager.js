(function($){

  "use strict";

  var pluginName = 'pluginManager',
      PluginClass;


  /* Enter PluginOptions */
  $[pluginName+'Default'] = {
    debug: true,
    enabled: true,
    container: window,
    isHtml: false,

    source: '',
    prefix: 'pm_',
    plugins: {},
    pluginLoaded: function() {},
    allPluginsLoaded: function() {},

    internalEvents: {
      init: [],
      redraw: [],
      pre_redraw: [],
      start_redraw: [],
      pluginsLoaded: [],

      mousemove: [],
      mousedown: [],
      mouseup: []
    },
  };
  

  PluginClass = function() {

    var selfObj = this,
        rootObj;
    this.item = false;
    this.initOptions = new Object($[pluginName+'Default']);
    
    this.init = function(elem) {
      selfObj = this;
      rootObj = $.extend(true,{},selfObj,selfObj.rootObj);

      if(!this.container)
        this.container = window;
      this.elem = elem;
      this.item = $(this.elem);
      this.container = $(this.container);
      this.isHTML = selfObj.elem.tagName.toLowerCase() === 'html';
    };

    this.disable = function() {
      selfObj.enabled = false;
    };

    this.enable = function() {
      selfObj.enabled = true;
    };

    this.loaded = function() {

    };

    this.registrateNewEvent = function(data) {
      selfObj.internalEvents = $.extend(selfObj.internalEvents,data.events);
    };

    this.registrateEvent = function(data) {
      var events = data.event.split(',');

      for(var e in events) {
        if(selfObj.internalEvents[events[e]] !== undefined) {
          selfObj.internalEvents[events[e]][selfObj.internalEvents[events[e]].length] = data.callback;
        }
      }
    };

    this.fire = function(runEvents) {
      var options = arguments[1]||{},
          e = arguments[2]||{},
          runEvents = runEvents.split(',');

      options = $.extend({},true,options,{});

      options = $.extend({},true,options,{
        padding: selfObj.padding,
        offset: $.extend(selfObj.bgSize,{x:selfObj.offsetLeft,y:selfObj.offsetTop}),
      });

      for(var eKey in runEvents) {
        if(selfObj.internalEvents[runEvents[eKey]] !== undefined) {
          $.each(selfObj.internalEvents[runEvents[eKey]],function(internEvent,callback) {
            callback(options,e);
          });
        }
      }
    };

    this.plugin = function(plugin) {
      var options = arguments[1]||{};
      if(selfObj.plugins[plugin] !== undefined) {
        return selfObj.plugins[plugin];
      }
    }

    this.load = function() {
      var data = arguments[0]||{},
          countPlugins = 0,
          pluginIndex = 0;

      data = $.extend({
        source: '/',
        item: null,
        plugins: {},
        html: false,
        defer: false,
        async: false,
        done: function() {}
      },data);

      countPlugins = Object.keys(data.plugins).length;

      var loadPlugin = function(plugin,options,data) {
        var loadNext = arguments[3]||false;
        $.getScript(data.source+'/'+selfObj.prefix+plugin+'.js',function() {
          pluginIndex++;
          options.selector = '#'+rootObj.elem.id+' .'+plugin;
          options.rootObj = rootObj;

          if(selfObj.plugins[plugin] === undefined) {
            selfObj.plugins[plugin] = $[selfObj.prefix+plugin](options);
            selfObj.pluginLoaded(plugin,options,false);
          } else {
            selfObj.plugins[plugin](options);
            selfObj.pluginLoaded(plugin,options,true);
          }

          if(loadNext) {
            var nextPlugin = Object.keys(data.plugins)[0];
            if(nextPlugin !== undefined) {
              loadPlugin(nextPlugin,data.plugins[Object.keys(data.plugins)[0]],data,true);
              delete data.plugins[Object.keys(data.plugins)[0]];
            }
          }

          if(pluginIndex === countPlugins) {
            data.done(selfObj);
            selfObj.allPluginsLoaded(data,countPlugins);
            selfObj.fire('pluginsLoaded',{
              data:data,
              countPlugins:countPlugins
            });
          }
        });
      };

      if(!data.defer) {
        $.each(data.plugins,function(plugin,options) {
          loadPlugin(plugin,options,data);
        });
      } else {
        var nextPlugin = Object.keys(data.plugins)[0];
        if(nextPlugin !== undefined) {
          loadPlugin(nextPlugin,data.plugins[Object.keys(data.plugins)[0]],data,true);
          delete data.plugins[Object.keys(data.plugins)[0]];
        }
      }

      return this;
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
