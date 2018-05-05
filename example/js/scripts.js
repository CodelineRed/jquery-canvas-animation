var caConfig = {
    autoplay: false,
    controls_fa: 5,
//    infinity: false,
    steps: [
        {
            addClass: 'ca-1'
        },
        {
            addClass: 'ca-2',
            duration: 800
        },
        {
            addClass: 'ca-3',
            duration: 800
        },
        {
            addClass: 'ca-4',
        }
    ],
    callback_done: function() {
//        console.log('foo bar');
    }
};

// jQuery.noConflict();
(function($) {
    $(document).ready(function() {
        $('#canvas').canvasAnimation(caConfig);
    });
})(jQuery);