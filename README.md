# Plugin Manager

This basic framework base on [jQuery Modul Dummy](https://github.com/Sioweb/jQueryModulDummy) which can be used to create fully configurable jQuery Plugins in no time with callbacks and methods.

First things first, you need to include `/pluginManager/jquery_plugin_manager.js`. You can change the path but never change the Filename. Do not merge the file into a uglyfied Script. It's required to get the correct plugin path.

After including the file, you can initalize it:

```
jquery_plugin_manager(function(source,responseData){
  /* just do here what you want */
  $('.some.selectors').pluginCore({
    /* required */
    source: source
    
    /* core settings, but not required */
    corePlugins: {},
    plugins: {},
    
    /* default callbacks */
    pluginsLoaded: function(plugins,coreObj) {
      /* fired when all plugins loaded - every time all plugins loaded */ 
    },
    
    /* Some Settings you can define later in the core itself */
  });
});

## Architecture

You will have two kind of plugins. Core plugins and plugins. Core plugins will be required for your own system. They can be used every where. The other plugins are optional. There is no need for them to be in, but they can upgrade ur functionality. As example you have a Toolbar core plugin, maybe in an editor. Then you can add some optional plugins to extend the toolbar and the toolbar plugin will manage all plugin callbacks.
