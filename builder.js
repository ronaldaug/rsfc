const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


/**
 * Remove duplicated links
 * @param {Array} e
 */
function removeDuplicateLinks(e) { let n = [], u = []; e.map(e => { e.map(e => { n.includes(e.name) || (n.push(e.name), u.push(e)) }) }); return Array.from(new Set(u)) }

/**
 * Get codes inside script tag
 * @param {*} dom
 */
const getScriptCode = (dom) => {
    const allScripts = dom.window.document.querySelectorAll('script');
    let scriptCode = '';
    allScripts.forEach(e => {
        if (!e.innerHTML) return;
        scriptCode = e.innerHTML;
    });
    return scriptCode;
}

/**
 * Get CSS links from HTML file
 * @param {*} dom
 */
const getCSSLinks = (dom) => {
    const links = dom.window.document.querySelectorAll("link");
    const cssLinks = [];
    links.forEach(e => {
        if (!e.getAttribute('href')) return;
        const link = e.getAttribute('href');
        const name = link.split('/').pop();
        if (name.includes('.css')) {
            cssLinks.push({ name, link })
        }
    });
    return cssLinks;
}

/**
 * Get JS links from HTML file
 * @param {*} dom
 */
const getJSLinks = (dom) => {
    const links = dom.window.document.querySelectorAll("script");
    const jsLinks = [];
    links.forEach(e => {
        if (!e.getAttribute('src')) return;
        const link = e.getAttribute('src');
        const name = link.split('/').pop();
        if (name.includes('.js')) {
            jsLinks.push({ name, link })
        }
    });
    return jsLinks;
}


/**
 * Read HTML Files Content
 * @param {String} dir
 */
function readFileContents(dir, filename) {
    const html = fs.readFileSync(dir + filename, 'utf-8')

    const dom = new JSDOM(html);
    const cssLinks = getCSSLinks(dom);
    const jsLinks = getJSLinks(dom);

    const style = dom.window.document.querySelector("style").innerHTML;
    const section = dom.window.document.querySelector("section").outerHTML;
    const scrpt = getScriptCode(dom);

    return {
        filename,
        html: section,
        style,
        scrpt,
        cssLinks,
        jsLinks
    }
}

/**
 * Read HTML Files Content
 * @param {String} dir
 */
function getFileNames(dir) {
    const files = [];
    fs.readdirSync(dir).forEach(filename => {
        if(!filename.includes(".html")) return;
        files.push(filename.split('.')[0]);
    })
    return files;
}

const filenames = getFileNames('components/');

module.exports = {
    filenames,
    readFileContents,
    removeDuplicateLinks
}
