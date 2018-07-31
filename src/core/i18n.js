(function ($) {

    "use strict";

    $.coreDefault.head($, 'i18n', {
        language: {}
    }, function (coreObj) {
        var selfObj = this;

        this.init = function () {
            selfObj = this;
        };

        this.get = function () {
			var lang = $.extend(true, {}, selfObj.language);

			for (var a in arguments) {
				if (lang[arguments[a]] === undefined) {
					return '';
				}
				if (typeof lang[arguments[a]] === 'function') {
					lang = lang[arguments[a]]();
				} else {
					lang = lang[arguments[a]];
				}
			}
			return lang;
        };
    });

})(jQuery);
