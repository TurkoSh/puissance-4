(function($) {
    $.fn.p4 = function(options)
    {
        var defaults = 
        {
            lignes: [6],
            colonnes: [7],
            J1color: ["red"],
            J2color: ["yellow"],
        };
        var parameters = $.extend(defaults, options);
        const p4 = new P4('#game', parameters);
    }

})(jQuery);