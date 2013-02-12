(function () {
    'use strict';
    var pages = window.pages = {};

    pages.home = function () {
        return '<div id="main"><header><div id="logo"><div id="logo_text"></div></div><nav><div id="menu_container"></div></nav></header><div id="site_content"><div class="content"><section class="identification"><form><p><label for="firstname">Entre ton prénom :</label><br/><input type="text" name="firstname" id="firstname"/></p><p><input type="radio" name="level" id="primaire" value="primaire" /><label for="primaire">Je suis en primaire</label><br/><input type="radio" name="level" id="college" value="college" /><label for="college">Je suis au collège</label></p><input type="submit" value="Commencer" class="btn"/></form></section></div></div><footer></footer></div><p>&nbsp;</p>';
    };

    pages.themes = function (profile) {
        return '<h1>Page des thèmes (' + profile.get('level') + ', ' + profile.get('name') + ')</h1>';
    };
}());
