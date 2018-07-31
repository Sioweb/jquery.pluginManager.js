(function ($) {

    "use strict";

    $.coreDefault.head($, 'frontend', {
        options: {},
        customerNumber: /^[0-9]{6}$/
    }, function (core, coreObj, handler, otherplugin) {
        var selfObj = this;

        this.init = function () {
            selfObj = this;
            // Init some things
        };

        this.ready = function() {
            // Will be fired, when all Plugins r ready
        };
        
    });
})(jQuery);