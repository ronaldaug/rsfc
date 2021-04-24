
const { removeDuplicateLinks } = require('./builder.js');
const { Config } = require('./config.js');

const CF = new Config();

/**
 * construct css style.css
 * @param {*} data
 */
const constructStyle = (data) =>{

    return CF.globalCSS() + data.map(d => {
        if(!d.style) return;
return `\n/* ==== Start ${d.filename.split(".")[0]} css */
        ${d.style}
/* ==== End ${d.filename.split(".")[0]} css */`;
    }).join("\n");

}

/**
 * construct js main.js
 * @param {*} data
 */
const constructJs = (data) =>{

    return CF.globalJS() + data.map(d =>{
        if(!d.scrpt) return;
return `\n/* ==== Start ${d.filename.split(".")[0]} js ==== */
        ${d.scrpt}
/* ==== End ${d.filename.split(".")[0]} js  ==== */`;
    }).join("\n");

}

/**
 * construct html index.html
 * @param {*} data
 * @param {String} type | client or server
 */
const constructHTML = async(data,type) => {

    let css = await constructStyle(data);
    let styles = type == 'client'?`<style>${CF.globalCSS()}${css}</style>`:'';
    let js = await constructJs(data);
    let scrpts = type == 'client'?`<script>${CF.globalJS()}${js}</script>`:'';

    const body = data.map(d =>{
        if(!d.html) return;
return `\n<!-- ==== Start ${d.filename.split(".")[0]} section  ==== -->
        ${d.html}
        <!-- ====  End ${d.filename.split(".")[0]} section ==== -->`;
    }).join("\n");

    let cssLinks = data.map(d => d.cssLinks);
    cssLinks = removeDuplicateLinks(cssLinks);
    cssLinks = cssLinks.map(c => `<link rel="stylesheet" href="${c.link}">`).join("\n");

    let jsLinks = data.map(d => d.jsLinks);
    jsLinks = removeDuplicateLinks(jsLinks);
    jsLinks = jsLinks.map(c => `<script src="${c.link}"><\/script>`).join("\n");

    return `${CF.htmlHead()}
    ${cssLinks}
    ${styles}
    ${CF.headerEnd()}
    ${body}
    ${jsLinks}
    ${scrpts}
    ${CF.htmlEnd()}`;
}

module.exports = {
    constructHTML,
    constructStyle,
    constructJs
};