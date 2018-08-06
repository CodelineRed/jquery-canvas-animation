var caConfig = {
    autoplay: false,
    fontawesomeVersion: 5,
//    infinite: false,
    editor: {
        enable : true
    },
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
    onDone: function() {
//        console.log('foo bar');
    }
};

// jQuery.noConflict();
(function($) {
    $(document).ready(function() {
        $('#canvas').canvasAnimation(caConfig);
    });
})(jQuery);