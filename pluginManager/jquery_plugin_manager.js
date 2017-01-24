function jquery_plugin_manager() {
	var source = $('script[src*="jquery_plugin_manager.js"]').prop('src')
								.replace('jquery_plugin_manager.js','')
								.replace(window.location.origin,'')
								.replace('//','/');

	$.getScript(source+'core/core.js',function() {
		$('#pdf').pluginCore();
	});
}
