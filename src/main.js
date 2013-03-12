(function (Backbone, $, _, storage, pages) {
    'use strict';

    if (!storage.profiles) {
        storage.profiles = '{}';
    }

    var appState = new Backbone.Model({
            page: '',
            pageTime: 0,
            profile: new Backbone.Model({
                visitedPages: {},
                scores: {}
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
            retrievedProfile.level = userData.level; // We allow the user choose to change his level
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

    function go(type) {
        return function () {
            var theme = $(this).parent().attr('data-theme');

            switch (theme) {
                case 'Digestif':
                    appState.set('page', type + theme);
                    if (type === 'exos') {
                        if (appState.get('profile').get('level') === 'college') {
                            $('#help').css('display', 'none');
                        }
                    }
                    break;
                case 'Os':
                case 'Respiratoire':
                    appState.set('page', type + theme);
                    break;
                default:
                    console.error(type + theme + '" is not implemented (yet?)');
                    break;
            }
        };
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
                evaluate();
                guide();
                $('.cours-btn').on('click', go('cours'));
                $('.exos-btn').on('click', go('exos'));
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
            case 'exosOs':
            case 'exosDigestif':  
            case 'exosRespiratoire':  
                $('body').html(pages[page](profile));
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

    function evaluate() {
        evaluateCours();
        evaluateExos();
    }
    function evaluateCours() {
        var coursNames = ['Os', 'Respiratoire', 'Digestif'],
            profile = appState.get('profile'),
            visitedPages = profile.get('visitedPages');

        if (!visitedPages) {
            return;
        }

        _(coursNames).each(function (coursName) {
            var delay = 10,
                fullName = 'cours' + coursName,
                stats = visitedPages[fullName];

            if (!stats) {
                return;
            }

            var coursBtnElt = $('div[data-theme=' + coursName + ']').children('.cours-btn'),
                averageTimeElapsed = stats.visits > 0 ? stats.timeElapsed / stats.visits : 0;

            if (stats.visits > 0) {
                if (stats.timeElapsed > delay * 1000) {
                    coursBtnElt.removeClass('bad');
                    coursBtnElt.addClass('good');
                } else {
                    coursBtnElt.removeClass('good');
                    coursBtnElt.addClass('bad');
                }
            }
        });
    }
    function evaluateExos() {
        var themes = ['Os', 'Respiratoire', 'Digestif'],
            profile = appState.get('profile'),
            themesScores = profile.get('scores');

        if (!themesScores) {
            return;
        }

        _(themes).each(function (theme) {
            var delay = 10,
                fullName = 'exos' + theme,
                scores = themesScores[fullName];

            if (!scores) {
                return;
            }

            var exosBtnElt = $('div[data-theme=' + theme + ']').children('.exos-btn');

            switch (theme) {
                case 'Os':var lastScore = _(scores).last();
                    if (lastScore >= 6) {
                        exosBtnElt.removeClass('good');
                        exosBtnElt.addClass('bad');
                    } else {
                        exosBtnElt.removeClass('bad');
                        exosBtnElt.addClass('good');
                    }
                    break;
                case 'Respiratoire':
                    var lastScore = _(scores).last();
                    if (lastScore >= 4) {
                        exosBtnElt.removeClass('good');
                        exosBtnElt.addClass('bad');
                    } else {
                        exosBtnElt.removeClass('bad');
                        exosBtnElt.addClass('good');
                    }
                    break;
                case 'Digestif':
                    var lastScore = _(scores).last();
                    if (lastScore < 50) {
                        exosBtnElt.removeClass('good');
                        exosBtnElt.addClass('bad');
                    } else {
                        exosBtnElt.removeClass('bad');
                        exosBtnElt.addClass('good');
                    }
                    break;
            }
        });
    }

    function guide() {
        var guideContainer = $('#evaluation'),
            profile = appState.get('profile'),
            visitedPages = profile.get('visitedPages'),
            isFirstConnection = visitedPages ? !visitedPages.themes : false,
            output = '';

        if (isFirstConnection) {
            output += '<p>Bienvenue !<br /> Pour bien démarrer, je te conseille d\'aller lire les cours en cliquant sur le bouton "Apprendre" de la catégorie de ton choix.</p>';
        } else {
            var wellReadCours = $('.cours-btn.good'),
                wellReadThemes = [];
            
            wellReadCours.parent().each(function () {
                wellReadThemes.push($($(this).children()[0]).text());
            });

            if (!_(wellReadThemes).size()) {
                output = '<p>Bonjour ! Tu peux cliquer sur "Apprendre" pour lire les cours.</p>';
            } else {
                output = '<p>Bravo, je vois que tu as bien travaillé !</p>';
                if (_(wellReadThemes).size() === 1) {
                    output += '<p>Pourquoi n\'essaierais-tu pas de tester tes connaissances dans la catégorie "' + wellReadThemes[0] + '" ?</p>';
                } else {
                    output += '<p>Pourquoi n\'essaierais-tu pas de tester tes connaissances dans les catégories que tu as bien révisé :<br /> - ' + wellReadThemes.join('<br /> - ');
                }
            }
        }

        guideContainer.html(output);
    }

    window.reportScore = function (score) {
        var profile = appState.get('profile'),
            exoName = profile.get('page'),
            scores = profile.get('scores');

        if (!scores[exoName]) {
            scores[exoName] = [];
        }

        scores[exoName].push(score);
    };

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
