const fs = require('fs');
const JavaScriptObfuscator = require('/home/jules/.npm/_npx/662517750a20b8e2/node_modules/javascript-obfuscator');

console.log('Building dist/index.html...');
const srcHtml = fs.readFileSync('src/index.html', 'utf8');

const scriptStartTag = '<script>';
const scriptEndTag = '</script>';

const scriptStart = srcHtml.indexOf(scriptStartTag);
const scriptEnd = srcHtml.lastIndexOf(scriptEndTag);

if (scriptStart === -1 || scriptEnd === -1) {
    console.error('Cannot locate <script> tags in src/index.html');
    process.exit(1);
}

const jsCode = srcHtml.substring(scriptStart + scriptStartTag.length, scriptEnd);

console.log('Obfuscating JavaScript...');
const obfuscatedJs = JavaScriptObfuscator.obfuscate(jsCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 8,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
}).getObfuscatedCode();

const distHtml = srcHtml.substring(0, scriptStart + scriptStartTag.length) + '\n' + obfuscatedJs + '\n' + srcHtml.substring(scriptEnd);

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}
fs.writeFileSync('dist/index.html', distHtml);
// Also output to root index.html for direct deployment hosting (GitHub Pages / Firebase Hosting / static host)
fs.writeFileSync('index.html', distHtml);
console.log('Build complete. Generated dist/index.html and updated index.html.');
