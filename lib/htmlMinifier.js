'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patterns = {};
var token = '__FZ_HTML_MINIFIER__';

var resolvePatterns = function resolvePatterns(src, pattern, subPattern) {
    var matches = src.match(pattern);
    if (matches) {
        matches.forEach(function (match) {
            if (subPattern) {
                match = resolvePatterns(match, subPattern);
            }
            var hash = (0, _md2.default)(match);
            patterns[hash] = match;
            match = match.replace(/([<>*()?$][{}|])/g, '\\$1');
            src = src.replace(new RegExp(match, 'g'), hash);
        });
    }
    return src;
};

var patchPatterns = function patchPatterns(src, ignorePatterns) {
    if ((typeof ignorePatterns === 'undefined' ? 'undefined' : _typeof(ignorePatterns)) === 'object') {
        ignorePatterns = [ignorePatterns];
    } else if (!Array.isArray(ignorePatterns)) {
        throw new Error('type of ignorePatterns would being a string or an array');
    }
    ignorePatterns.forEach(function (pattern) {
        src = resolvePatterns(src, pattern);
    });
    return src;
};

var retrivePatterns = function retrivePatterns(src) {
    Object.keys(patterns).forEach(function (hash) {
        var value = patterns[hash] === ' ' ? ' ' : patterns[hash].trim();
        src = src.replace(new RegExp(hash, 'g'), value);
    });
    return src;
};

var quotesHandler = function quotesHandler(src) {
    src = resolvePatterns(src, /\".*?\"/g, /\'.*?\'/g);
    return resolvePatterns(src, /\'.*?\'/g);
};

var minifyHtml = function minifyHtml(src) {
    src = quotesHandler(src);
    src = src.replace(/(\s{2,}|\s)/g, token);
    patterns[token] = ' ';
    return src;
};

var htmlMinifier = function htmlMinifier() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$isPath = options.isPath,
        isPath = _options$isPath === undefined ? false : _options$isPath,
        src = options.src,
        _options$isLoader = options.isLoader,
        isLoader = _options$isLoader === undefined ? false : _options$isLoader;

    if (isPath) {
        var srcPath = options.srcPath;

        src = _fs2.default.readFileSync(srcPath).toString();
    } else if (!src) {
        throw new Error('atleast give file source or file path with options');
    }
    var ignorePatterns = options.ignorePatterns,
        outputPath = options.outputPath;

    if (ignorePatterns) {
        src = patchPatterns(ignorePatterns);
    }
    src = minifyHtml(src);
    if (Object.keys(patterns).length) {
        src = retrivePatterns(src);
    }
    if (isLoader) {
        src = src.replace(/"/g, '\\"');
    }
    if (outputPath) {
        _fs2.default.writeFileSync(outputPath, src);
    } else {
        return src;
    }
};

exports.default = htmlMinifier;