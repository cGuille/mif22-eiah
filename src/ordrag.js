(function (Backbone, $, _) {
    'use strict';

    var TRANSITIONS_DURATION = 75;

    // console.log('backbone: ' + Backbone);
    // console.log('jquery: ' + $);
    // console.log('underscore:' + _);

    $(function () {
        $('.item.droppable').droppable({
            tolerance: 'intersect',
            over: function (event, ui) {
                $(this).toggleClass('highlight', true);
            },
            out: function () {
                $(this).toggleClass('highlight', false);
            },
            drop: function onDrop(event, ui) {
                var draggedElt = ui.draggable,
                    recipientElt = $(this),
                    isRecipientTaken = recipientElt.children(':first').length !== 0;

                if (isRecipientTaken || (recipientElt.attr('data-receive') && recipientElt.attr('data-receive') !== draggedElt.text())) {
                    draggedElt.animate({
                        top: 0,
                        left: 0,
                    }, TRANSITIONS_DURATION);
                } else {
                    draggedElt.appendTo(recipientElt);
                    draggedElt.css({
                        top: 0,
                        left: 0,
                    });
                }
                recipientElt.toggleClass('highlight', false);
            },
        });

        $('.item.draggable').draggable({
            opacity: '0.85',
            cursor: 'move',
            revert: 'invalid',
            revertDuration: TRANSITIONS_DURATION,
        });
    });
}(window.Backbone, window.jQuery, window._));
