(function (Backbone, $, _, storage, pages) {
    'use strict';

    // console.log('backbone: ' + Backbone);
    // console.log('jquery: ' + $);
    // console.log('underscore:' + _);

    if (!storage.profiles) {
        storage.profiles = JSON.stringify({});
    }

    var appState = new Backbone.Model({
            page: '',
            profile: new Backbone.Model()
        });

    appState.on('change:page', function () {
        storage.page = appState.get('page');
    });
    appState.get('profile').on('change', function () {
        var name = appState.get('profile').get('name'),
            profiles = {};

        storage.profile = JSON.stringify(appState.get('profile'));

        if (name) {
            profiles[name] = appState.get('profile');
            storage.profiles = JSON.stringify(profiles);
        }
    });

    function reset() {
        appState.get('profile').clear();
        appState.set('page', 'home');
    }
    window.appState = appState;// for console debugging purpose
    window.reset = reset;// for console debugging purpose


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

        appState.get('profile').set(userData);
        appState.set('page', 'themes');

        return false;
    }

    function goCours() {
        var theme = $(this).attr('id');

        switch (theme) {
            case 'Os':
            case 'Digestif': 
            case 'Respiratoire':
                appState.set('page', 'cours' + theme);
                break;
            default:
                console.error('The course "' + theme + '" is not implemented (yet?).');
                break;
        }
        window.alert('Aller à la page du theme: « ' + theme + ' »');
    }

    appState.on('change:page', function (state, page) {
        var previousPage = state.previous('page'),
            profile = appState.get('profile');

        switch (page) {
            case 'home':
                $('body').html(pages[page](profile));
                $('form').on('submit', onIdentification);
                $('#firstname').focus();
                break;
            case 'themes':
                $('body').html(pages[page](profile));
                $('.cours-btn').on('click', goCours);
                break;
            case 'coursOs':
            case 'coursDigestif':  
            case 'coursRespiratoire':  
                $('body').html(pages[page](profile));
                break;
            default:
                console.error('unknown page `' + page + '`');
                break;
        }

        // On every pages:
        $('.back-home').on('click', appState.set.bind(appState, 'page', 'themes'));
        $('.disconnect').on('click', reset);
    });

    $(function () {
        var page = 'home';

        if (storage.page && storage.profile) {
            page = storage.page;
            appState.get('profile').set(JSON.parse(storage.profile));
        }
        appState.set('page', page);
    });

}(window.Backbone, window.jQuery, window._, window.localStorage, window.pages));
