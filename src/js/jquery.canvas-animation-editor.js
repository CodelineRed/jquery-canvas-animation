(function($) {
    $.fn.canvasAnimationEditor = function(config) {
        var thisCanvas = this;
        var uniqueHashes = [];
        var parentWidthCache = thisCanvas.width().toFixed(0);
        var parentHeightCache = thisCanvas.height().toFixed(0);
        var itemHeightCache = '';
        var itemWidthCache = '';
        var itemTopCache = 0;
        var itemLeftCache = 0;
        var config = $.extend(true, {}, {
            enable: false, // if true: show editor on page
            decimal: 2, // accuracy of numbers
            draggableItems: true, // jQuery UI Draggable is required for this feature
            wrapper: '.jca-editor-container', // editor wrapper class
            labels: {
                top: 'top',
                left: 'left',
                width: 'width',
                height: 'height',
                newItem: 'New: ',
                newItemBlank: 'Blank',
                newItemExt: 'Extended',
                select: 'Select: ',
                selectCss: 'CSS',
                selectHtml: 'HTML',
                remove: 'Remove: ',
                removeItem: 'Item',
                removeStyle: 'Style',
                className: 'CSS class name',
                parentWidth: 'Parent width in px',
                parentHeight: 'Parent height in px',
                itemWidth: 'Item width in px',
                itemHeight: 'Item height in px',
                itemTop: 'Item offset top in px',
                itemLeft: 'Item offset left in px',
                confirmAppendPrepend: 'OK = append item / Cancel = prepend item',
                confirmRemoveItem: 'Are you sure to remove item?',
                confirmRemoveStyle: 'Are you sure to remove style?',
                alertCanvasId: 'Canvas must have attribute "id".'
            },
            template: '<div class="jca-editor-container">' +
                '<div class="jca-container">' +
                    '<div class="jca-col jca-cord-dimension">' +
                        '<div class="jca-box">' +
                            '<div class="jca-label jca-top"></div>' +
                            '<div class="jca-label jca-left"></div>' +
                            '<div class="jca-label jca-width"></div>' +
                            '<div class="jca-label jca-height"></div>' +
                            '<input type="number" step="0.01" name="jca_top" />' +
                            '<input type="number" step="0.01" name="jca_left" />' +
                            '<input type="number" step="0.01" name="jca_width" />' +
                            '<input type="number" step="0.01" name="jca_height" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="jca-col jca-selector-breadcrumb"></div>' +
                    '<div class="jca-col jca-code-col">' +
                        '<div id="jca-html"></div>' +
                        '<div id="jca-css"></div>' +
                    '</div>' +
                    '<div class="jca-col jca-button-col">' +
                        '<span class="jca-new"></span><input type="button" name="jca_new_item" value=""/> <input type="button" name="jca_new_item_ext" value=""/><br/>' +
                        '<span class="jca-select"></span><input type="button" name="jca_html" value=""/> <input type="button" name="jca_css" value=""/><br/>' +
                        '<span class="jca-remove"></span><input type="button" name="jca_remove_item" value=""/> <input type="button" name="jca_remove_style" value=""/><br/><br/>' +
                        '<span class="jca-width"></span> <span class="jca-width-val"></span> <span class="jca-height"></span> <span class="jca-height-val"></span><br/>' +
                        '<span class="jca-top"></span> <span class="jca-top-val"></span> <span class="jca-left"></span> <span class="jca-left-val"></span>' +
                    '</div>' +
                '</div>' +
            '</div>'
        }, config );
        
        if (thisCanvas.attr('id') === 'undefined') {
            alert(config.labels.alertCanvasId);
            return;
        }
        
        $('html').addClass('jca-editor-enable');
        var editorTemplate = $(config.template);
        editorTemplate.find('.jca-label.jca-top').attr('data-label', config.labels.top);
        editorTemplate.find('.jca-label.jca-left').attr('data-label', config.labels.left);
        editorTemplate.find('.jca-label.jca-width').attr('data-label', config.labels.width);
        editorTemplate.find('.jca-label.jca-height').attr('data-label', config.labels.height);
        editorTemplate.find('.jca-button-col .jca-top').text(config.labels.top + ':');
        editorTemplate.find('.jca-button-col .jca-left').text(config.labels.left + ':');
        editorTemplate.find('.jca-button-col .jca-width').text(config.labels.width + ':');
        editorTemplate.find('.jca-button-col .jca-height').text(config.labels.height + ':');
        editorTemplate.find('[name="jca_new_item"]').val(config.labels.newItemBlank);
        editorTemplate.find('[name="jca_new_item_ext"]').val(config.labels.newItemExt);
        editorTemplate.find('[name="jca_css"]').val(config.labels.selectCss);
        editorTemplate.find('[name="jca_html"]').val(config.labels.selectHtml);
        editorTemplate.find('[name="jca_remove_item"]').val(config.labels.removeItem);
        editorTemplate.find('[name="jca_remove_style"]').val(config.labels.removeStyle);
        editorTemplate.find('.jca-new').text(config.labels.newItem);
        editorTemplate.find('.jca-select').text(config.labels.select);
        editorTemplate.find('.jca-remove').text(config.labels.remove);
        thisCanvas.parent().append(editorTemplate);
        
        if (config.decimal < 1) config.decimal = 2;
        editorTemplate.find('[name="jca_top"],[name="jca_left"],[name="jca_width"],[name="jca_height"]').attr('step', 1 / Math.pow(10, config.decimal));
        
        thisCanvas.attr('data-hash', getUniqueHash());
        setSelectorBreadcrumb(thisCanvas);
        setPixelDimensions(thisCanvas);
        
        $('*', thisCanvas).each(function() {
            $(this).attr({
                dataHash: getUniqueHash(),
                dataClass: $(this).attr('class')
            });
            setItemDraggable($(this));
        });
        
        $(thisCanvas).click(function(e) {
            var item = $(e.target);
            
            // hide canvas to get percentages (e.g. item.css('top'))
            thisCanvas.hide();
            $('*', thisCanvas).removeClass('jca-active-element');
            $('*', thisCanvas).css('background-color', '');
            
            if (isCanvas(item)) {
                $('[name="jca_top"],[name="jca_left"],[name="jca_width"],[name="jca_height"]').val('');
                $('#jca-css,#jca-html').html('');
            } else {
                $('[name="jca_top"]').val(parseFloat(item.css('top')));
                $('[name="jca_left"]').val(parseFloat(item.css('left')));
                $('[name="jca_width"]').val(parseFloat(item.css('width')));
                $('[name="jca_height"]').val(parseFloat(item.css('height')));
                item.addClass('jca-active-element');
                item.css('background-color', getRandomColor());
                $('#jca-css').html(getCss(item));
                $('#jca-html').html(getHtml(item));
            }
            
            thisCanvas.show();
            setSelectorBreadcrumb(item);
            setPixelDimensions(item);
            parentWidthCache = item.width().toFixed(0);
            parentHeightCache = item.height().toFixed(0);
            
            if (!isCanvas(item)) {
                setItemDraggable(item);
            }
        });
        
        $('.jca-cord-dimension input').change(function() {
            setItemStyle();
        });
        
        $('.jca-cord-dimension input').keyup(function() {
            setItemStyle();
        });
        
        $('[name="jca_new_item"]').click(function() {
            var className = prompt(config.labels.className);
            addItem(className, '0', '0', '25%', '25%');
        });
        
        $('[name="jca_new_item_ext"]').click(function() {
            var className = prompt(config.labels.className);
            var parentWidth = parentWidthCache = parseInt(prompt(config.labels.parentWidth, parentWidthCache));
            var parentHeight = parentHeightCache = parseInt(prompt(config.labels.parentHeight, parentHeightCache));
            var itemWidth = itemWidthCache = parseInt(prompt(config.labels.itemWidth, itemWidthCache));
            var itemHeight = itemHeightCache = parseInt(prompt(config.labels.itemHeight, itemHeightCache));
            var itemTop = itemTopCache = parseInt(prompt(config.labels.itemTop, itemTopCache));
            var itemLeft = itemLeftCache = parseInt(prompt(config.labels.itemLeft, itemLeftCache));
            addItem(className, (itemTop * 100 / parentHeight).toFixed(config.decimal) + '%', 
                (itemLeft * 100 / parentWidth).toFixed(config.decimal) + '%', 
                (itemWidth * 100 / parentWidth).toFixed(config.decimal) + '%', 
                (itemHeight * 100 / parentHeight).toFixed(config.decimal) + '%');
        });
        
        $('[name="jca_remove_item"]').click(function() {
            if ($('.jca-active-element').length && confirm(config.labels.confirmRemoveItem + ' ' + getIdClass($('.jca-active-element')))) {
                var parent = $('.jca-active-element').parent();
                $('.jca-active-element').remove();
                parent.click();
            }
        });
        
        $('[name="jca_remove_style"]').click(function() {
            if ($('.jca-active-element').length && confirm(config.labels.confirmRemoveStyle + ' ' + getIdClass($('.jca-active-element')))) {
                $('.jca-active-element').attr('style', '');
            }
        });
        
        $('[name="jca_css"]').click(function() {
            selectText('jca-css');
        });
        
        $('[name="jca_html"]').click(function() {
            selectText('jca-html');
        });
        
        $('.jca-selector-breadcrumb').on('click', 'a', function(e) {
            e.preventDefault();
            $('[data-hash="' + $(this).attr('href') + '"]').click();
        });
        
        /**
         * Adds item to canvas
         * 
         * @param {string} className
         * @param {string} top
         * @param {string} left
         * @param {string} width
         * @param {string} height
         * @returns {undefined}
         */
        function addItem(className, top, left, width, height) {
            var item = $('<div class="' + className + '" data-class="' + className + '"></div>');
            item.css({
                position: 'absolute',
                top: top,
                left: left,
                width: width,
                height: height,
                backgroundColor: getRandomColor()
            });
            item.attr('data-hash', getUniqueHash());
            var hashSelector = '[data-hash="' + item.attr('data-hash') + '"]';
            $('head').append('<style>' +hashSelector + '{background-color:' + getRandomColor() + '}</style>');
            
            if (className.length) {
                if ($('.jca-active-element').length) {
                    var parent = $('.jca-active-element');
                } else {
                    var parent = thisCanvas;
                }
                
                if (confirm(config.labels.confirmAppendPrepend)) {
                    parent.append(item);
                } else {
                    parent.prepend(item);
                }
                
                $(hashSelector).click();
            }
            setItemDraggable($(hashSelector));
        }
        
        /**
         * Returns breadcrumb from canvas until item
         * 
         * @param {object} item
         * @returns {string}
         */
        function generateSelectorBreadcrumb(item) {
            var result = '';
            
            if (!isCanvas(item)) {
                result = generateSelectorBreadcrumb(item.parent());
            }
            
            return result + '<a href="' + item.data('hash') + '">' + getIdClass(item) + '</a> <span class="jca-pointer">></span> ';
        }
        
        /**
         * Returns css source code from item
         * 
         * @param {object} item
         * @returns {string}
         */
        function getCss(item) {
            return getIdClass(item) + ' {<br/>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;top: ' + item.css('top') + ';<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;left: ' + item.css('left') + ';<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;width: ' + item.css('width') + ';<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;height: ' + item.css('height') + ';<br>' +
            '}';
        }
        
        /**
         * Returns raw html
         * 
         * @param {object} item
         * @returns {string}
         */
        function getHtml(item) {
            return htmlEscape('<div class="' + item.data('class') + '"></div>');
        }
        
        /**
         * Returns id and classes from item
         * 
         * @param {object} item
         * @returns {string}
         */
        function getIdClass(item) {
            var itemId = item.attr('id');
            var itemClass = item.data('class');
            var itemIdClass = '';
            
            // if has id attribute
            if (typeof itemId !== 'undefined' && itemId.length) {
                itemIdClass += '#' + itemId;
            }
            
            // if has class attribute
            if (typeof itemClass !== 'undefined' && itemClass.length) {
                itemIdClass += '.' + itemClass.replace(/ /ig, '.');
            }
            
            return itemIdClass;
        }
        
        /**
         * Returns random color
         * 
         * @returns {string}
         */
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
        /**
         * Returns a unique hash
         * 
         * @returns {string}
         */
        function getUniqueHash() {
            var hash = '';
            do {
                hash = getRandomColor();
            }
            while (uniqueHashes.indexOf(hash) > -1); 
            uniqueHashes.push(hash);
            
            return hash;
        }
        
        /**
         * Renders selector breadcrumb to view
         * 
         * @param {object} item
         * @returns {undefined}
         */
        function setSelectorBreadcrumb(item) {
            $('.jca-selector-breadcrumb').html(generateSelectorBreadcrumb(item));
        }
        
        /**
         * Sets pixel dimension in jca-button-col
         * 
         * @param {object} item
         * @returns {undefined}
         */
        function setPixelDimensions(item) {
            if (isCanvas(item)) {
                $('.jca-button-col .jca-top-val,.jca-button-col .jca-left-val').text('0px;');
            } else {
                $('.jca-button-col .jca-top-val').text(parseInt(item.css('top')).toFixed(0) + 'px;');
                $('.jca-button-col .jca-left-val').text(parseInt(item.css('left')).toFixed(0) + 'px;');
            }
            
            $('.jca-button-col .jca-width-val').text(item.width().toFixed(0) + 'px;');
            $('.jca-button-col .jca-height-val').text(item.height().toFixed(0) + 'px;');
        }
        
        /**
         * Sets item draggable
         * 
         * @param {object} item
         * @returns {undefined}
         */
        function setItemDraggable(item) {
            if (config.draggableItems && typeof $.fn.draggable === 'function' 
                    && !item.hasClass('ui-draggable')) {
                item.draggable({
                    stop: function(event, ui) {
                        $('*', thisCanvas).removeClass('jca-active-element');
                        item.css('top', (parseFloat(item.css('top')) * 100 / item.parent().height()).toFixed(config.decimal) + '%');
                        item.css('left', (parseFloat(item.css('left')) * 100 / item.parent().width()).toFixed(config.decimal) + '%');
                        $('[name="jca_top"]').val((parseFloat(item.css('top')) * 100 / item.parent().height()).toFixed(config.decimal));
                        $('[name="jca_left"]').val((parseFloat(item.css('left')) * 100 / item.parent().width()).toFixed(config.decimal));
                        thisCanvas.hide();
                        $('[name="jca_width"]').val(parseFloat(item.css('width')));
                        $('[name="jca_height"]').val(parseFloat(item.css('height')));
                        $('#jca-css').html(getCss(item));
                        $('#jca-html').html(getHtml(item));
                        thisCanvas.show();
                        setSelectorBreadcrumb(item);
                        setPixelDimensions(item);
                        if (!$(ui.helper).hasClass('jca-active-element')) $(ui.helper).addClass('jca-active-element');
                    }
                });
            }
        }

        /**
         * Sets input values to item
         * 
         * @returns {undefined}
         */
        function setItemStyle() {
            if ($('.jca-active-element').length) {
                var item = $('.jca-active-element');
                item.css({
                    top: $('[name="jca_top"]').val() + '%',
                    left: $('[name="jca_left"]').val() + '%',
                    width: $('[name="jca_width"]').val() + '%',
                    height: $('[name="jca_height"]').val() + '%'
                });
                thisCanvas.hide();
                $('#jca-css').html(getCss(item));
                thisCanvas.show();
                setPixelDimensions(item);
            } else {
                $('[name="jca_top"],[name="jca_left"],[name="jca_width"],[name="jca_height"]').val('');
                setPixelDimensions(thisCanvas);
            }
        }
        
        /**
         * Selects text in given element
         * 
         * @param {string} item id from item
         * @returns {undefined}
         */
        function selectText(item) {
            var doc = document
                , text = doc.getElementById(item)
                , range, selection
            ;    
            if (doc.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(text);
                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();        
                range = document.createRange();
                range.selectNodeContents(text);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        /**
         * Escapes HTML chars
         * 
         * @param {string} str
         * @returns {string}
         */
        function htmlEscape(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
        
        /**
         * Unescapes HTML chars
         * 
         * @param {string} str
         * @returns {string}
         */
        function htmlUnescape(str){
            return str
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
        }
        
        /**
         * Returns TRUE if given item is canvas
         * 
         * @param {object} item
         * @returns {boolean}
         */
        function isCanvas(item) {
            return typeof item.attr('id') !== 'undefined' && item.attr('id') === thisCanvas.attr('id');
        }
    };
})(jQuery);