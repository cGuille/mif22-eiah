(function (Backbone, $, _, storage) {
    'use strict';

    // console.log('backbone: ' + Backbone);
    // console.log('jquery: ' + $);
    // console.log('underscore:' + _);

    var userProfile = new Backbone.Model();

    $(function () {
        $('form').on('submit', onIdentification);
        $('#firstname').focus();
    });

    function onIdentification() {
        var userData = {
                name: $(this).find('[name=firstname]').val().trim(),
                level: $(this).find('[name=level]:checked').attr('value')
            };

        $('label[for=firstname]').removeClass('validation-error');
        $('label[for=primaire], label[for=college]').removeClass('validation-error');

        if (!userData.name || (userData.level !== 'primaire' && userData.level !== 'college')) {
            if (!userData.name) {
                console.error('No name specified');
                $('label[for=firstname]').addClass('validation-error');
            }
            if (userData.level !== 'primaire' && userData.level !== 'college') {
                console.error('No level specified');
                $('label[for=primaire], label[for=college]').addClass('validation-error');
            }

            console.error('form validation error');
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
