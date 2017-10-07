function jquery_plugin_manager(script) {
	var initCallback = arguments[1]||function(source) {},
		source = script.src
					.replace(/(.*\/).*/,'$1')
					.replace(window.location.origin,'')
					.replace('//','/');

	$.getScript(source+'core/pluginCore.js',function(data,status,xhr) {
		initCallback(source,{data:data,status:status,xhr:xhr});
	});
}
