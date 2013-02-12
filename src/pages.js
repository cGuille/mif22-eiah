(function () {
    'use strict';
    var pages = window.pages = {};

    pages.home = function () {
        return '<section class="identification"><form><p><label for="firstname">Entre ton prénom :</label><br/><input type="text" name="firstname" id="firstname"/></p><p><input type="radio" name="level" id="primaire" value="primaire" /><label for="primaire">Je suis en primaire</label><br/><input type="radio" name="level" id="college" value="college" /><label for="college">Je suis au collège</label></p><input type="submit" value="Commencer" class="btn"/></form></section>';
    };

    pages.themes = function (profile) {
        return '<h1>Page des thèmes (' + profile.get('level') + ', ' + profile.get('name') + ')</h1>';
    };
}());
