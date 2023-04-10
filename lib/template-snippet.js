/**
 * Basic template parser
 */
var TemplateSnippet = function (template) {
    'use strict';
    // var re = /<%([^%>]+)?%>/g;
    // var re = /<%(.+?)%>/g;
    var re = /\{\{(.+?)\}\}/g;
    var snippet = 'var snippet=[];\n', cursor = 0, match;
    var add = function (line, js) {
        if (line != '') {
            if (js) {
                snippet += 'snippet.push(' + line + ');\n'
            } else {
                snippet += 'snippet.push(\'' + line.replace(/'/g, "\\'") + '\');\n';
            }
        }
    };
    while (match = re.exec(template)) {
        add(template.slice(cursor, match.index));
        add(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(template.substr(cursor, template.length - cursor));
    snippet += 'return snippet.join(\'\');';
    var preprocessor = new Function(snippet.replace(/[\r\t\n]/g, ' '));
    var templateFunction = function (data) {
        try {
            return preprocessor.call(data);
        } catch (err) {
            var error = new Error('TemplateSnippetError(' + err.name + '): ' + err.message);
            error.snippet = snippet;
            throw error;
        }
    };
    templateFunction.getTemplate = function () {
        return template;
    };
    templateFunction.getSnippet = function () {
        return snippet;
    };
    return templateFunction;
};
