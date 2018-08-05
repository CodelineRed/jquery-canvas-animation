(function($) {
    $.fn.canvasAnimationEditor = function(config) {
        var thisCanvas = this;
        var uniqueHashes = [];
        var parentWidthCache = '';
        var parentHeightCache = '';
        var itemHeightCache = '';
        var itemWidthCache = '';
        var itemTopCache = 0;
        var itemLeftCache = 0;
        var config = $.extend({
            enable: false,
            labels: {
                top: 'top',
                left: 'left',
                width: 'width',
                height: 'height',
                newItemBlank: 'New Item (Blank)',
                newItemExt: 'New Item (Extended)',
                selectCss: 'Select CSS',
                selectHtml: 'Select HTML',
                removeItem: 'Remove Item',
                className: 'CSS class name',
                parentWidth: 'Parent width in px',
                parentHeight: 'Parent height in px',
                itemWidth: 'Item width in px',
                itemHeight: 'Item height in px',
                itemTop: 'Item offset top in px',
                itemLeft: 'Item offset left in px',
                confirmAppendPrepend: 'OK = append item / Cancel = prepend item'
            },
            template: '<div class="jca-editor">' +
                '<div class="jca-container">' +
                    '<div class="jca-col jca-cord-dimension">' +
                        '<div class="jca-box">' +
                            '<div class="jca-label jca-top"></div>' +
                            '<div class="jca-label jca-left"></div>' +
                            '<div class="jca-label jca-width"></div>' +
                            '<div class="jca-label jca-height"></div>' +
                            '<input type="number" step="0.1" name="jca_top" />' +
                            '<input type="number" step="0.1" name="jca_left" />' +
                            '<input type="number" step="0.1" name="jca_width" />' +
                            '<input type="number" step="0.1" name="jca_height" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="jca-col jca-selector-breadcrumb"></div>' +
                    '<div class="jca-col">' +
                        '<div id="jca-html"></div>' +
                        '<div id="jca-css"></div>' +
                    '</div>' +
                    '<div class="jca-col">' +
                        '<input type="button" name="jca_new_item" value=""/> <input type="button" name="jca_new_item_ext" value=""/><br/>' +
                        '<input type="button" name="jca_html" value=""/> <input type="button" name="jca_css" value="Select CSS"/><br/>' +
                        '<br/>' +
                        '<input type="button" name="jca_remove_item" value=""/><br/>' +
                    '</div>' +
                '</div>' +
            '</div>'
        }, config );
        var editorTemplate = $(config.template);
        editorTemplate.find('.jca-label.jca-top').attr('data-label', config.labels.top);
        editorTemplate.find('.jca-label.jca-left').attr('data-label', config.labels.left);
        editorTemplate.find('.jca-label.jca-width').attr('data-label', config.labels.width);
        editorTemplate.find('.jca-label.jca-height').attr('data-label', config.labels.height);
        editorTemplate.find('[name="jca_new_item"]').val(config.labels.newItemBlank);
        editorTemplate.find('[name="jca_new_item_ext"]').val(config.labels.newItemExt);
        editorTemplate.find('[name="jca_css"]').val(config.labels.selectCss);
        editorTemplate.find('[name="jca_html"]').val(config.labels.selectHtml);
        editorTemplate.find('[name="jca_remove_item"]').val(config.labels.removeItem);
        $('body').prepend(editorTemplate);
        
        thisCanvas.attr('data-hash', getUniqueHash());
        $('.jca-selector-breadcrumb').html(getSelectorBreadcrumb(thisCanvas));
        
        $('*', thisCanvas).each(function() {
            $(this).attr('data-hash', getUniqueHash());
        });
        
        $(thisCanvas).click(function(e) {
            var item = $(e.target);
            
            // hide canvas to get percentages (e.g. item.css('top'))
            thisCanvas.hide();
            $('*', thisCanvas).removeClass('jca-active-element');
            $('*', thisCanvas).css('background-color', '');
            
            if (typeof item.attr('id') === 'undefined' 
                    || (typeof item.attr('id') !== 'undefined' 
                    && item.attr('id') !== thisCanvas.attr('id'))) {
                $('[name="jca_top"]').val(parseFloat(item.css('top')));
                $('[name="jca_left"]').val(parseFloat(item.css('left')));
                $('[name="jca_width"]').val(parseFloat(item.css('width')));
                $('[name="jca_height"]').val(parseFloat(item.css('height')));
                item.addClass('jca-active-element');
                item.css('background-color', getRandomColor());
                $('#jca-css').html(getCss(item));
                $('#jca-html').html(getHtml(item));
            } else {
                $('[name="jca_top"]').val('');
                $('[name="jca_left"]').val('');
                $('[name="jca_width"]').val('');
                $('[name="jca_height"]').val('');
                $('#jca-css').html('');
                $('#jca-html').html('');
            }
            
            thisCanvas.show();
            $('.jca-selector-breadcrumb').html(getSelectorBreadcrumb(item));
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
            addItem(className, (itemTop * 100 / parentHeight).toFixed(1) + '%', (itemLeft * 100 / parentWidth).toFixed(1) + '%', (itemWidth * 100 / parentWidth).toFixed(1) + '%', (itemHeight * 100 / parentHeight).toFixed(1) + '%');
        });
        
        $('[name="jca_remove_item"]').click(function() {
            if ($('.jca-active-element').length && confirm('Are you sure to remove ' + getIdClass($('.jca-active-element')) + '?')) {
                $('.jca-active-element').remove();
                thisCanvas.click();
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
         * @param {String} className
         * @param {String} top
         * @param {String} left
         * @param {String} width
         * @param {String} height
         * @returns {void}
         */
        function addItem(className, top, left, width, height) {
            var item = $('<div class="' + className + '"></div>');
            item.css('position', 'absolute');
            item.css('top', top);
            item.css('left', left);
            item.css('width', width);
            item.css('height', height);
            item.attr('data-hash', getUniqueHash());
            item.css('background-color', getRandomColor());
            var hashSelector = '[data-hash="' + item.attr('data-hash') + '"]';
            $('head').append('<style>' +hashSelector + '{background-color:' + getRandomColor() + '}</style>');
            
            if (className.length) {
                if ($('.jca-active-element').length) {
                    var parent = $('.jca-active-element').parent();
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
        }
        
        /**
         * Returns css source code from item
         * 
         * @param {object} item
         * @returns {String}
         */
        function getCss(item) {
            item.toggleClass('jca-active-element');
            var sourceCode = getIdClass(item) + ' {<br/>';
            sourceCode += '&nbsp;&nbsp;&nbsp;&nbsp;top: ' + item.css('top') + ';<br>';
            sourceCode += '&nbsp;&nbsp;&nbsp;&nbsp;left: ' + item.css('left') + ';<br>';
            sourceCode += '&nbsp;&nbsp;&nbsp;&nbsp;width: ' + item.css('width') + ';<br>';
            sourceCode += '&nbsp;&nbsp;&nbsp;&nbsp;height: ' + item.css('height') + ';<br>';
            sourceCode += '}';
            
            item.toggleClass('jca-active-element');
            return sourceCode;
        }
        
        /**
         * Returns raw html
         * 
         * @param {object} item
         * @returns {String}
         */
        function getHtml(item) {
            var item = item.clone();
            item.removeAttr('data-hash');
            item.removeAttr('style');
            item.removeClass('jca-active-element');
            return htmlEscape(item[0].outerHTML);
        }
        
        /**
         * Returns id and classes from item
         * 
         * @param {object} item
         * @returns {String}
         */
        function getIdClass(item) {
            var itemId = item.attr('id');
            var itemClass = item.attr('class');
            var itemIdClass = '';
            
            // if has jca-active-element -> remove class from output
            if (item.hasClass('jca-active-element')) {
                item.toggleClass('jca-active-element');
                itemClass = item.attr('class');
                item.toggleClass('jca-active-element');
            }
            
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
         * @returns {String}
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
         * Returns breadcrumb from canvas until item
         * 
         * @param {object} item
         * @returns {String}
         */
        function getSelectorBreadcrumb(item) {
            var itemId = item.attr('id');
            var result = '';
            
            if (typeof itemId === 'undefined' 
                    || (typeof itemId !== 'undefined' 
                    && itemId !== thisCanvas.attr('id'))) {
                result = getSelectorBreadcrumb(item.parent());
            }
            
            return result + '<a href="' + item.data('hash') + '">' + getIdClass(item) + '</a> > ';
        }
        
        /**
         * Returns a unique hash
         * 
         * @returns {String}
         */
        function getUniqueHash() {
            var hash = '';
            do {
                hash = getRandomColor();
            }
            while (hash in uniqueHashes); 
            uniqueHashes[hash] = 1;
            
            return hash;
        }

        /**
         * Sets input values to item
         * 
         * @returns {void}
         */
        function setItemStyle() {
            thisCanvas.hide();
            var item = $('.jca-active-element');
            item.css('top', $('[name="jca_top"]').val() + '%');
            item.css('left', $('[name="jca_left"]').val() + '%');
            item.css('width', $('[name="jca_width"]').val() + '%');
            item.css('height', $('[name="jca_height"]').val() + '%');
            $('#jca-css').html(getCss(item));
            thisCanvas.show();
        }
        
        /**
         * Selects text in given element
         * 
         * @param {String} element
         * @returns {void}
         */
        function selectText(element) {
            var doc = document
                , text = doc.getElementById(element)
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
         * @param {String} str
         * @returns {String}
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
         * @param {String} str
         * @returns {String}
         */
        function htmlUnescape(str){
            return str
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
        }
    };
})(jQuery);