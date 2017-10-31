import md5 from 'md5';
import fs from 'fs';

var patterns = {};
var token = '__FZ_HTML_MINIFIER__';

let resolvePatterns = (src, pattern, subPattern)=>{
    let matches = src.match(pattern);
    if (matches){
        matches.forEach(match=>{
            if (subPattern){
                match = resolvePatterns(match, subPattern);
            }
            let hash = md5(match);
            patterns[hash] = match;
            match = match.replace(/([<>*()?$][{}|])/g, '\\$1');
            src = src.replace(new RegExp(match, 'g'), hash);
        })
    }
    return src;
}

let patchPatterns = (src, ignorePatterns) => {
    if (typeof ignorePatterns === 'object') {
        ignorePatterns = [ignorePatterns];
    } else if (!Array.isArray(ignorePatterns)) {
        throw new Error('type of ignorePatterns would being a string or an array');
    }
    ignorePatterns.forEach(pattern => {
        src = resolvePatterns(src, pattern);
    });
    return src;
};

let retrivePatterns = (src) => {
    Object.keys(patterns).forEach(hash => {
        let value = patterns[hash] === ' ' ? ' ' : patterns[hash].trim();
        src = src.replace(new RegExp(hash, 'g'), value);
    });
    return src;
};

let quotesHandler = (src)=>{
    src = resolvePatterns(src, /\".*?\"/g, /\'.*?\'/g);
    return resolvePatterns(src, /\'.*?\'/g);
}

let minifyHtml = (src) => {
    src = quotesHandler(src);
    src = src.replace(/(\s{2,}|\s)/g, token);
    patterns[token] = ' ';
    return src;
};

let htmlMinifier = (options = {}) => {
    let { isPath = false, src, isLoader = false } = options;
    if (isPath) {
        let { srcPath } = options;
        src = fs.readFileSync(srcPath).toString();
    } else if (!src) {
        throw new Error('atleast give file source or file path with options');
    }
    let { ignorePatterns, outputPath } = options;
    if (ignorePatterns) {
        src = patchPatterns(ignorePatterns);
    }
    src = minifyHtml(src);
    if (Object.keys(patterns).length) {
        src = retrivePatterns(src);
    }
    if (isLoader){
        src = src.replace(/"/g, '\\"');
    }
    if (outputPath) {
        fs.writeFileSync(outputPath, src);
    } else {
        return src;
    }
};

export default htmlMinifier;
