(function (Backbone, $, _, storage) {
    'use strict';

    // console.log('backbone: ' + Backbone);
    // console.log('jquery: ' + $);
    // console.log('underscore:' + _);

    var userProfile = new Backbone.Model();

    $(function () {
        $('form').on('submit', onIdentification);
    });

    function onIdentification() {
        var userData = {
                name: $(this).find('[name=firstname]').val(),
                level: $(this).find('[name=level]:checked').attr('value')
            };

        if (!userData.name || (userData.level !== 'primaire' && userData.level !== 'college')) {
            console.error('Form validation error (todo)');
            return false;
        }

        userProfile.set(userData);

        return false;
    }

    userProfile.once('change', function () {
        if (!userProfile.has('name') || !userProfile.has('level')) {
            return;
        }

        $('body').html('<h1>Page des thèmes (' + userProfile.get('level') + ', ' + userProfile.get('name') + ')</h1>');
    });

    userProfile.on('change', function () {
        storage.profile = JSON.stringify(userProfile);
    });

}(window.Backbone, window.jQuery, window._, window.localStorage));
