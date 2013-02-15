(function ($, _) {
    'use strict';

    var exports = window.MCQ = {}

    exports.Mcq = Mcq;
    exports.McqHtmlWriter = McqHtmlWriter;

    function McqHtmlWriter(mcq) {
        this.mcq = mcq;
        this.onAttempt = null;
    }

    McqHtmlWriter.prototype.write = function(jContainer) {
        var self = this;
        jContainer.html('');
        this.mcq.eachQuestion(function (question, index) {
            question.index = index;
            jContainer.append(build.call(self, question));
        });
    };

    function build(question) {
        var self = this;
        function handleResponse() {
            if (!self.onAttempt || !_(self.onAttempt).isFunction()) {
                return;
            }
            var responseElt = $(this),
                responseIndex = +responseElt.attr('data-response-index'),
                questionIndex = +responseElt.parent().parent().attr('data-question-index');

            self.onAttempt.call(self.mcq, self.mcq.checkResponse(questionIndex, responseIndex), questionIndex, responseIndex);
        }

        var html, questionElt;
        
        html = '<div class="question" data-question-index="' + question.index + '"><span class="question-label">' + question.label + '</span><div class="responses">';
        _(question.responses).each(function (response, index) {
            html += '<span class="response" data-response-index="' + index + '">' + response + '</span>';
        });
        html += '</div></div>';
        questionElt = $(html);

        questionElt.find('.response').on('click', handleResponse);

        return questionElt;
    }

    function Mcq(data) {
        this.title = data.title;
        this.questions = data.questions;
    }

    Mcq.prototype.eachQuestion = function(iterator) {
        return _(this.questions).each(iterator);
    };

    Mcq.prototype.getResponses = function(questionIndex) {
        return _(this.questions[questionIndex].responses).clone();
    };

    Mcq.prototype.checkResponse = function(questionIndex, responseIndex) {
        return _(this.questions[questionIndex].anwsers).contains(responseIndex);
    };

    var testData = {
        title: "MCQ Test",
        questions: [{
            label: "Is it ok?",
            responses: [
                "Yes",
                "No"
            ],
            anwsers: [0]
        }, {
            label: "Is it still ok?",
            responses: [
                "Yes",
                "No"
            ],
            anwsers: [0, 1]
        }]
    };
    
    $(function () {
        window.mcq = new Mcq(testData);
        window.mcqHtmlWriter = new McqHtmlWriter(mcq);
        mcqHtmlWriter.onAttempt = function (successful, questionIndex, responseIndex) {
            console.log('Answered ' + responseIndex + ' on question ' + questionIndex + ': ' + (successful ? 'right' : 'wrong'));
        };
        mcqHtmlWriter.write($('body'));
    });

}(window.jQuery, window._));
