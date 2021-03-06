'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _htmlMinifier = require('./htmlMinifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function htmlLoader(source) {
    var callback = this.async();
    var _query = this.query,
        query = _query === undefined ? {} : _query;

    source = (0, _htmlMinifier2.default)(Object.assign({}, query, { src: source, isLoader: true }));
    callback(null, 'module.exports="' + source + '"');
}

exports.default = htmlLoader;