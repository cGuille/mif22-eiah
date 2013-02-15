(function ($, _) {
    'use strict';

    var exports = window.MCQ = {}

    exports.Mcq = Mcq;
    exports.McqHtmlWriter = McqHtmlWriter;

    function McqHtmlWriter(mcq, errorHandler, callback) {
        this.mcq = mcq;
        this.onError = errorHandler;
        this.callback = callback;
    }

    McqHtmlWriter.prototype.write = function(jContainer) {
        var self = this,
            btn = $('<button>' + (self.mcq.buttonLabel ? self.mcq.buttonLabel : 'Check') + '</button>');

        if (self.mcq.shuffle) {
            self.mcq.shuffleResponses();
        }

        jContainer.html('');
        if (self.mcq.title) {
            jContainer.append($('<h3>' + self.mcq.title + '</h3>'));
        }
        if (self.mcq.description) {
            jContainer.append($('<div class="description">' + self.mcq.description + '</div>'));
        }
        this.mcq.eachQuestion(function (question, index) {
            question.index = index;
            jContainer.append(build.call(self, question));
        });

        btn.on('click', function () {
            var notChecked = [],
                checking = [];

            jContainer.find('dl.question').each(function () {
                var questionElt = $(this),
                    questionIndex = +questionElt.attr('data-question-index'),
                    question = self.mcq.getQuestion(questionIndex),
                    response = questionElt.find('input:checked').val();

                if (!response) {
                    notChecked.push(questionIndex);
                }

                checking.push({
                    questionIndex: questionIndex,
                    questionLabel: question.label,
                    responseLabel: response,
                    anwsers: question.anwsers,
                    correct: self.mcq.checkResponse(questionIndex, response)
                });
            });

            if (notChecked.length) {
                self.onError({
                    message: 'not_all_checked',
                    notChecked: notChecked
                });
            } else {
                self.callback.call(self.mcq, checking);
            }
        });
        jContainer.append(btn);
    };

    function build(question) {
        var html, questionElt;
        
        html = '<dl class="question" data-question-index="' + question.index + '">';
        html += '<dt class="question-label">' + question.label + '</dt>';
        _(question.responses).each(function (response, index) {
            var id = question.index + '-' + index;
            html += '<dd class="response"><input type="radio" name="' + question.index + '" id="' + id + '" value="' + response + '" /><label for="' + id + '">' + response + '</label></dd>';
        });
        html += '</dl>';
        questionElt = $(html);

        return questionElt;
    }

    function Mcq(data) {
        this.title = data.title;
        this.id = data.id;
        this.buttonLabel = data.buttonLabel;
        this.shuffle = data.shuffle ? true : false;
        this.description = data.description;
        this.questions = data.questions;
    }

    Mcq.prototype.shuffleResponses = function () {
        _(this.questions).map(function (question) {
            question.responses = _(question.responses).shuffle();
            return question;
        });
    };

    Mcq.prototype.eachQuestion = function (iterator) {
        return _(this.questions).each(iterator);
    };

    Mcq.prototype.getQuestion = function (questionIndex) {
        return _(this.questions[questionIndex]).clone();
    };

    Mcq.prototype.getResponses = function (questionIndex) {
        return _(this.questions[questionIndex].responses).clone();
    };

    Mcq.prototype.checkResponse = function (questionIndex, response) {
        return _(this.questions[questionIndex].anwsers).contains(response);
    };
}(window.jQuery, window._));
