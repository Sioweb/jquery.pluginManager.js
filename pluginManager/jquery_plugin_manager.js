function jquery_plugin_manager() {
	var initCallback = arguments[]||function() {},
			source = $('script[src*="jquery_plugin_manager.js"]').prop('src')
								.replace('jquery_plugin_manager.js','')
								.replace(window.location.origin,'')
								.replace('//','/');

	$.getScript(source+'core/pluginCore.js',initCallback);
}
