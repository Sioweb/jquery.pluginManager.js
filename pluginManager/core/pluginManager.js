(function($){

  "use strict";

  var pluginName = 'pluginManager';

  /* Enter PluginOptions */
  $[pluginName+'Default'] = {
    source: '',
    prefix: 'pdf_',
    plugins: {},
    pluginLoaded: function() {},
    allPluginsLoaded: function() {},

    internalEvents: {
      init: [],
      redraw: [],
      page_init: [],
      pre_redraw: [],
      start_redraw: [],
      pluginsLoaded: [],

      mousemove: [],
      mousedown: [],
      mouseup: []
    },
  };
  
  $.pluginCoreDefault.head($,pluginName,function() {
    var selfObj = this,
        rootObj;

    this.initOptions = new Object($[pluginName+'Default']);
    
    this.init = function(elem) {
      selfObj = this;
      rootObj = $.extend(true,{},selfObj,selfObj.rootObj);
    };

    this.registrateNewEvent = function(data) {
      selfObj.internalEvents = $.extend(selfObj.internalEvents,data.events);
    };

    this.registrateEvent = function(data) {
      var events = data.event.split(',');

      data.skip = false; // standard skip-Wert damit in this.fire keine Konflikte entstehen
      for(var e in events) {
        if(selfObj.internalEvents[events[e]] !== undefined) {
          if(data.index === undefined)
            selfObj.internalEvents[events[e]][selfObj.internalEvents[events[e]].length] = data;
          else selfObj.internalEvents[events[e]].splice(data.index, 0, data);
        }
      }
    };

    /**
     * Event-Optionen
     * - timeout: true||integer; so lange kann das Event nicht ausgeführt werden
     * - callback: function()
     * - options: object()
     */
    this.fire = function(runEvents) {
      var options = arguments[1]||{},
          e = arguments[2]||{},
          runEvents = runEvents.split(',');

      options = $.extend({},true,options,{});

      options = $.extend({},true,options,{
        event: '',
        padding: selfObj.padding,
        offset: $.extend(selfObj.bgSize,{x:selfObj.offsetLeft,y:selfObj.offsetTop}),
      });

      for(var eKey in runEvents) {
        if(selfObj.internalEvents[runEvents[eKey]] !== undefined) {
          options.event = runEvents[eKey];
          $.each(selfObj.internalEvents[runEvents[eKey]],function(internEvent,eventData) {
            if(!eventData.skip && eventData.timeout !== undefined && eventData.timeout) {
              var timeout = eventData.timeout;
              if(typeof timeout === 'boolean')
                timeout = 1000;

              if(!eventData.skip)
                eventData.callback(options,e);

              eventData.skip = true;
              setTimeout(function() {
                eventData.skip = false;
              },timeout);

            } else eventData.callback(options,e);
          });
        }
      }
    };

    this.plugin = function(plugin) {
      var options = arguments[1]||{};
      if(selfObj.plugins[plugin] !== undefined) {
        return selfObj.plugins[plugin];
      }
    };

    this.promiseCallback = function(promiseCallback,obj) {
      if(typeof promiseCallback !== 'object' || promiseCallback.length !== 2) {
        console.log('Promise requires two args with a functions and options: [function(){},[args]]');
        return false;
      }
      promiseCallback[0](promiseCallback[1],obj);
    };

    this.before = function(callback) {
      callback(selfObj);
      return this;
    };

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
              if(selfObj.plugins[plugin].promise === undefined) {
                loadPlugin(nextPlugin,data.plugins[Object.keys(data.plugins)[0]],data,true);
                delete data.plugins[Object.keys(data.plugins)[0]];
              } else selfObj.plugins[plugin].promise(function(args,pluginObj) {
                loadPlugin.apply(this,args);
                delete data.plugins[Object.keys(data.plugins)[0]];
              },[nextPlugin,data.plugins[Object.keys(data.plugins)[0]],data,true])
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
        }).fail(function(jqxhr, settings, exception) {
          // console.log('FAIL',jqxhr, settings, exception);
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
  });
})(jQuery);
