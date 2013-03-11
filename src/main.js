(function (Backbone, $, _, storage, pages) {
    'use strict';

    if (!storage.profiles) {
        storage.profiles = '{}';
    }

    var appState = new Backbone.Model({
            page: '',
            pageTime: 0,
            profile: new Backbone.Model({
                visitedPages: {}
            })
        });

    appState.on('change:page', function (state, page) {
        state.get('profile').set('page', page)
    });
    appState.get('profile').on('change', function () {
        var name = appState.get('profile').get('name'),
            profiles = JSON.parse(storage.profiles);

        storage.profile = JSON.stringify(appState.get('profile'));

        if (name) {
            profiles[name] = appState.get('profile');
            storage.profiles = JSON.stringify(profiles);
        }
    });

    function reset() {
        savePageVisit(appState.get('page'));
        appState.get('profile').clear();
        appState.set('page', 'home');
    }
    window.appState = appState;// for console debugging purpose
    window.reset = reset;// for console debugging purpose


    function onIdentification() {
        var landingPage = 'themes',
            profiles = JSON.parse(storage.profiles),
            userData = {
                name: $(this).find('[name=firstname]').val().trim(),
                level: $(this).find('[name=level]:checked').attr('value')
            },
            retrievedProfile;

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

        retrievedProfile = profiles[userData.name];

        if (retrievedProfile) {
            appState.get('profile').set(retrievedProfile);
            if (retrievedProfile.page) {
                landingPage = retrievedProfile.page;
            }
        } else {
            appState.get('profile').set(userData);
        }
        appState.set('page', landingPage);

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
    }

    function savePageVisit(page) {
        var visitedPages = appState.get('profile').get('visitedPages'),
            previousPageInitTime = +appState.get('pageInitTime'),
            previousPageTimeElapsed = (+new Date()) - previousPageInitTime;
        
        if (!page || !visitedPages || !previousPageInitTime) {
            // console.error('page:', page);
            // console.error('visitedPages:', visitedPages);
            // console.error('previousPageInitTime:', previousPageInitTime);
            return;
        }

        if (!visitedPages[page]) {
            visitedPages[page] = { visits: 0, timeElapsed: 0 };
        }
        visitedPages[page].visits += 1;
        visitedPages[page].timeElapsed += previousPageTimeElapsed;
        appState.get('profile').trigger('change');
    }

    appState.on('change:page', function (state, page) {
        var previousPage = state.previous('page'),
            profile = appState.get('profile');

        savePageVisit(previousPage);

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
                if (appState.get('profile').get('level') === 'college') {
                    see_more('texte');
                    $('.see-more').css('display', 'none');
                }
                break;
            default:
                console.error('unknown page `' + page + '`');
                break;
        }

        // On every pages:
        $('.back-home').on('click', appState.set.bind(appState, 'page', 'themes'));
        $('.disconnect').on('click', reset);
        appState.set('pageInitTime', +new Date());
    });

    $(function () {
        var page = 'home',
            profiles = JSON.parse(storage.profiles);

        if (storage.page && storage.profile) {
            page = storage.page;
            appState.get('profile').set(JSON.parse(storage.profile));
        }
        appState.set('page', page);
    });

}(window.Backbone, window.jQuery, window._, window.localStorage, window.pages));
