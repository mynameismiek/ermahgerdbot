'use strict';

var util = require('util');
var request = require('request');
var token = "ghWEn36IpyWNLoxSWF5MIEq6";
var URL = "https://hooks.slack.com/services/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";

module.exports = {
    ermahgerd: ermahgerd
};

var checkToken = function (req, res, cb) {
    var keyParam = req.swagger.params.token.value;

    if (keyParam === token) {
        return cb ("", "VERLERD TERKERN RERCERVERD.");
    } else {
        return cb("ERER: SERER, DA TERKERN KER ERS ERNVERLERD.");
    }
};

function ermahgerd(req, res) {
    checkToken(req, res, function(err, reply) {
        if (err) {
            return res.json(err);
        } else if (req.swagger.params.text.value === "") {
            res.json("PLERS ERNTER SERM TERXT TER ERMAHGERD!");
        } else {
            console.log(reply);
            var newText = '@' + req.swagger.params.user_name.value + ' sers, "'
                    + translateText(req.swagger.params.text.value)
                    + '"';
            request.post({
                url: URL,
                body: {
                    "text": newText,
                    "channel": '#' + req.swagger.params.channel_name.value
                },
                json: true
            });
            res.status(200).type('application/json').end();
        }
    });
};

var translateText = function (text) {
    text = text.toUpperCase();
    var lines = text.split("\n");
    var translatedLines = [];

    for (var k in lines) {
        var words = lines[k].split(' ');
        var translatedWords = [];

        for (var j in words) {
            var prefix = words[j].match(/^\W+/) || '';
            var suffix = words[j].match(/\W+$/) || '';
            var word = words[j].replace(prefix, '').replace(suffix, '');

            if (words[j].indexOf('@') != -1) {
                translatedWords.push(words[j]);
            } else if (word) {
                // Is translatable
                translatedWords.push(prefix + translate(word) + suffix);
            } else {
                // Is punctuation
                translatedWords.push(words[j]);
            }
        }

        translatedLines.push(translatedWords.join(' '));
    }

    return translatedLines.join("\n");
};

var str_split = function(string, split_length) {
    // http://kevin.vanzonneveld.net
    // +     original by: Martijn Wieringa
    // +     improved by: Brett Zamir (http://brett-zamir.me)
    // +     bugfixed by: Onno Marsman
    // +      revised by: Theriault
    // +        input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
    // +      revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    // *       example 1: str_split('Hello Friend', 3);
    // *       returns 1: ['Hel', 'lo ', 'Fri', 'end']
    if (split_length === null) {
        split_length = 1;
    }

    if (string === null || split_length < 1) {
        return false;
    }

    string += '';
    var chunks = [],
        pos = 0,
        len = string.length;

    while (pos < len) {
        chunks.push(string.slice(pos, pos += split_length));
    }

    return chunks;
};

var translate = function(word) {
    // Don't translate short words
    if (word.length == 1) {
        return word;
    }

    // Handle specific words
    switch (word) {
        case 'AWESOME':    return 'ERSUM';
        case 'BANANA':     return 'BERNERNER';
        case 'BAYOU':      return 'BERU';
        case 'FAVORITE':
        case 'FAVOURITE':  return 'FRAVRIT';
        case 'GOOSEBUMPS': return 'GERSBERMS';
        case 'LONG':       return 'LERNG';
        case 'MY':         return 'MAH';
        case 'THE':        return 'DA';
        case 'THEY':       return 'DEY';
        case 'WE\'RE':     return 'WER';
        case 'YOU':        return 'U';
        case 'YOU\'RE':    return 'YER';
        case 'TACO':       return 'TERCO';
    }

    // for usernames
    if (word.startsWith('@')) {
        return word;
    }

    // Before translating, keep a reference of the original word
    var originalWord = word;

    // Drop vowel from end of words
    if (originalWord.length > 2) { // Keep it for short words, like "WE"
        word = word.replace(/[AEIOU]$/, '');
    }

    // Reduce duplicate letters
    word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '');

    // Reduce adjacent vowels to one
    word = word.replace(/[AEIOUY]{2,}/g, 'E'); // TODO: Keep Y as first letter

    // DOWN -> DERN
    word = word.replace(/OW/g, 'ER');

    // PANCAKES -> PERNKERKS
    word = word.replace(/AKES/g, 'ERKS');

    // The meat and potatoes: replace vowels with ER
    word = word.replace(/[AEIOUY]/g, 'ER'); // TODO: Keep Y as first letter

    // OH -> ER
    word = word.replace(/ERH/g, 'ER');

    // MY -> MAH
    word = word.replace(/MER/g, 'MAH');

    // FALLING -> FALERNG -> FERLIN
    word = word.replace('ERNG', 'IN');

    // POOPED -> PERPERD -> PERPED
    word = word.replace('ERPERD', 'ERPED');

    // MEME -> MAHM -> MERM
    word = word.replace('MAHM', 'MERM');

    // Keep Y as first character
    // YES -> ERS -> YERS
    if (originalWord.charAt(0) == 'Y') {
        word = 'Y' + word;
    }

    // Reduce duplicate letters
    word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '');

    // YELLOW -> YERLER -> YERLO
    if ((originalWord.substr(-3) == 'LOW') && (word.substr(-3) == 'LER')) {
        word = word.substr(0, word.length - 3) + 'LO';
    }

    return word;
};
