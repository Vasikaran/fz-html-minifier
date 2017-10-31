import htmlMinifier from './htmlMinifier';

function htmlLoader(source){
    let callback = this.async();
    let { query = {} } = this;
    source = htmlMinifier(Object.assign({}, query, {src: source, isLoader: true}));
    callback(null, 'module.exports="' + source + '"');
}

export default htmlLoader;
