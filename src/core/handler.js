(function ($) {

    "use strict";

    $.coreDefault.head($, 'handler', {
        handler: {}
    }, function (coreObj) {
        var selfObj = this;

        this.init = function () {
            selfObj = this;
        };

        this.registrate = function() {
            for(var a in arguments) {
                selfObj.handler[arguments[a]] = {};
            }
        };

        this.get = function (handler) {
			if (selfObj.handler['$' + handler] === undefined) {
				if (!selfObj.set(handler)) {
					return false;
				}
			}
			return selfObj.handler['$' + handler];
        };

        this.set = function (handler) {
            var selector = arguments[1] || selfObj.handler[handler];

			if (selfObj.handler[handler] !== undefined) {
				selfObj.handler['$' + handler] = coreObj.container.find(selector);
			} else {
				return;
			}

			if (!selfObj.handler['$' + handler].length) {
				return;
			}

			return true;
        };
        
        this.add = function (handler, $handler) {
            selfObj.handler['$' + handler] = $handler;
			return selfObj.get(handler);
		};
    });

})(jQuery);
