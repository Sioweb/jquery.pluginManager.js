function jquery_plugin_manager(script) {
	var defaultInitialize = function(source, selector) {
			var $Managers = $(selector),

				// !function(n) {
				//     if(n < 10) {
				//         console.log(n);
				//         arguments.callee(n + 1);
				//     };
				// }(0);
		
				loadDefer = function($managerPlugin, $ManagerPlugins, onReadyCallback) {
					$($managerPlugin).core({
						version: 1,
						title: 'pm',
						name: 'pm',
						prefix: 'pm_',
		
						scope: 'backend',
						
						source: source,
						container: 'item', // 'item', CSS-Selector, window
						plugins: {
							frontend: {},
							otherplugin: {}
						},
						allPluginsLoaded: function(coreObj, args) {
							if($ManagerPlugins.length) {
								loadDefer($ManagerPlugins.splice(0,1), $ManagerPlugins, onReadyCallback);
							} else {
								onReadyCallback(coreObj, args);
							}
						}
					});
				};
		
			loadDefer($Managers.splice(0,1), $Managers, function(coreObj) {
				
			});
		},
		initCallback = arguments[1]||defaultInitialize,
		source = script.src
				.replace(/(.*\/).*/,'$1')
				.replace(window.location.origin,'')
				.replace('//','/');

	$(function() {
		$.getScript(source+'core/core.js',function(data,status,xhr) {
			if(typeof initCallback === 'string') {
				defaultInitialize(source, initCallback);
			} else if(typeof initCallback === 'function') {
				initCallback(source,{data:data,status:status,xhr:xhr});
			}
		});
	});
}