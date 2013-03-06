(function ($, _, Mcq, McqHtmlWriter) {
    'use strict';

    var qcmData = {
        title: "Le système digestif",
        id: "qcm-digestif",
        buttonLabel: "Vérifier",
        shuffle: true,
        description: "<p>Pendant la digestion, l'épiglotte s'abaisse, la glotte se relève ce qui ferme la trachée<br />Les enzimes qui interviennent au niveau de l'intestin sont les peptidases, l'amylase, et les lipases.</p>",
        questions: [{
            label: "Quelle(s) voie(s) suivent les aliments absorbés qui ont traversé les villosités intestinales ?",
            responses: [
                "La voie sanguine",
                "La voie lymphatique",
                "Les voies sanguine et lymphatique"
            ],
            anwsers: ["Les voies sanguine et lymphatique"]
        }/*, {
            label: "Quel est le nombre de glandes salivaires ?",
            responses: [
                "une",
                "deux",
                "trois"
            ],
            anwsers: ["trois"]
        }, {
            label: "À quelle partie du tube digestif appartiennent le duodénum, le jéjunum et l'iléon ?",
            responses: [
                "Le colon",
                "Au gros intestin",
                "À l'intestin grêle"
            ],
            anwsers: ["À l'intestin grêle"]
        }, {
            label: "Par quel orifice l'œsophage pénètre-t-il dans l'estomac ?",
            responses: [
                "L'œsophage",
                "Le pylore",
                "Le cardia"
            ],
            anwsers: ["Le cardia"]
        }, {
            label: "Qu'est-ce qui permet la fermeture de la trachée pendant la déglutition ?",
            responses: [
                "La langue",
                "La glotte",
                "La glotte et l'épiglotte"
            ],
            anwsers: ["La glotte et l'épiglotte"]
        }, {
            label: "Quel est le rôle de la luette pendant la déglutition ?",
            responses: [
                "Elle ferme la trachée",
                "Elle ouvre l'esophage",
                "Elle ferme les fosses nasales"
            ],
            anwsers: ["Elle ferme les fosses nasales"]
        }, {
            label: "Où sont situées les glandes salivaires ?",
            responses: [
                "Dans le pharynx",
                "Sur la langue",
                "Dans la bouche"
            ],
            anwsers: ["Dans la bouche"]
        }, {
            label: "Les dents chez l'adulte sont :",
            responses: [
                "4 incisives, 8 canines, 8 prémolaires, 12 molaires",
                "8 incisives, 4 canines. 12 prémolaires, 8 molaires",
                "8 incisives, 4 canines, 8 prémolaires, 12 molaires"
            ],
            anwsers: ["8 incisives, 4 canines, 8 prémolaires, 12 molaires"]
        }, {
            label: "Quel est le nom de la membrane qui entoure les organes digestifs ?",
            responses: [
                "Le péricarde",
                "Le péritoine",
                "La paroi intestinale"
            ],
            anwsers: ["La paroi intestinale"]
        }, {
            label: "Comment appelle-t-on le passage des aliments digérés dans la circulation sanguine ?",
            responses: [
                "La nutrition",
                "La digestion",
                "L'absorption"
            ],
            anwsers: ["L'absorption"]
        }*/]
    };
    
    $(function () {
        var qcm = new Mcq(qcmData),
            writer = new McqHtmlWriter(qcm, function onError(error) {
                if (error.message === 'not_all_checked') {
                    var qcmElt = $('#qcm');

                    qcmElt.find('.question').each(function () {
                        var questionElt = $(this),
                            questionIndex = +questionElt.attr('data-question-index');

                        if (_(error.notChecked).contains(questionIndex)) {
                            questionElt.find('.question-label').addClass('required');
                        } else {
                            questionElt.find('.question-label').removeClass('required');
                        }
                    });
                }
            }, function onCheck(results) {
                console.log(results);
                $('#qcm .question-label').removeClass('required');
                
                $('#qcm .question').each(function () {
                    var questionElt = $(this),
                        questionIndex = +questionElt.attr('data-question-index');

                    questionElt.find('.response').each(function () {
                        var responseElt = $(this),
                            responseLbl = responseElt.find('label').text(),
                            checkedElt = responseElt.find('input:checked');

                        if (checkedElt.length) {
                            if ()
                        }
                    });
                    if (results[questionIndex])
                });

                // _(results).each(function (question) {
                // });
            });
        writer.write($('#qcm'));
    });

}(window.jQuery, window._, window.MCQ.Mcq, window.MCQ.McqHtmlWriter));
