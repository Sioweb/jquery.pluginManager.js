function jquery_plugin_manager() {
	var initCallback = arguments[0]||function(source) {},
			source = $('script[src*="jquery_plugin_manager.js"]').prop('src')
								.replace('jquery_plugin_manager.js','')
								.replace(window.location.origin,'')
								.replace('//','/');

	$.getScript(source+'core/pluginCore.js',function(data,status,xhr) {
		initCallback(source,{data:data,status:status,xhr:xhr});
	});
}
