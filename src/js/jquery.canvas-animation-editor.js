(function($) {
    $.fn.canvasAnimationEditor = function(config) {
        var thisCanvas = this;
        $('*', thisCanvas).click(function() {
            thisCanvas.hide();
            $('*', thisCanvas).removeClass('jca-active-element');
            $('[name="jca_top"]').val(parseFloat($(this).css('top')));
            $('[name="jca_left"]').val(parseFloat($(this).css('left')));
            $('[name="jca_width"]').val(parseFloat($(this).css('width')));
            $('[name="jca_height"]').val(parseFloat($(this).css('height')));
            $(this).addClass('jca-active-element');
            thisCanvas.show();
        });
    };
})(jQuery);