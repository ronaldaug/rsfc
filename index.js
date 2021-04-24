const express = require('express')
const { promises: fs } = require("fs")
const path = require("path")
const fse = require('fs-extra')
const { zip } = require('zip-a-folder')
const pretty = require('pretty');

class ZipAFolder {
    static async main(source,dest) {
        await zip(source, dest);
    }
}

async function copyDir(src, dest) {
    const doneCheck = new Promise(async(resolve,reject)=>{

        await fs.mkdir(dest, { recursive: true });
        let entries = await fs.readdir(src, { withFileTypes: true });

        for (let entry of entries) {
            let srcPath = path.join(src, entry.name);
            let destPath = path.join(dest, entry.name);

            entry.isDirectory() ?
                await copyDir(srcPath, destPath) :
                await fs.copyFile(srcPath, destPath);
        }
        resolve('done');
    })
    return doneCheck;
}

const app = express();
app.use(express.json());
const PREFIX = '/api';
const PORT = 3030;
app.use(express.static('public'));
app.use('/components',express.static('components'));
app.use('/assets',express.static('components/assets'));
const { filenames, readFileContents } = require('./builder.js');
const { constructHTML,constructStyle,constructJs } = require('./construct.js');

app.post(`${PREFIX}/orderednames`, async (req,res)=>{
    const {names} = req.body;
    const data = [];
    names.forEach(n=>{
        data.push(readFileContents('components/',n+'.html'));
    })
    const resData = await constructHTML(data,'client');
    res.status(200).send({message:'Successfully generated!',status:200,data:resData})
})

app.post(`${PREFIX}/download`,async (req,res)=>{
    const {names} = req.body;
    const data = [];
    names.forEach(n=>{
        data.push(readFileContents('components/',n+'.html'));
    })



        const tmp = `rsfc-${Date.now()}`;
        const sourceDir = './components/assets';
        const destDir = `./public/download/${tmp}`;
        const assetsDir = `${destDir}/assets`;
        const cssDir = `${assetsDir}/css`;
        const jsDir = `${assetsDir}/js`;

        fse.mkdirSync(destDir);
        fse.mkdirSync(assetsDir);
        fse.mkdirSync(cssDir);
        fse.mkdirSync(jsDir);


        let html = await constructHTML(data);
        html = await pretty(html);

        let css = await constructStyle(data);
        let js = await constructJs(data);
        await fse.outputFileSync(`${cssDir}/style.css`,css)
        await fse.outputFileSync(`${jsDir}/main.js`,js)

        copyDir(sourceDir,`${destDir}/assets`).then(async (e)=>{
            if(e == 'done'){
                fse.outputFileSync(`${destDir}/index.html`,html);
                await ZipAFolder.main(destDir, `${destDir}.zip`);

                // For safety export, delay a bit
                setTimeout(()=>{
                    const resData = {
                        download_link:`download/${tmp}.zip`
                    }
                    res.status(200).send({message:'Successfully generated!',status:200,data:resData})
                },300)
            }
        });

})

app.get(`${PREFIX}/filenames`,(req,res)=>{
    res.status(200).send({message:'Successfully retrieved file names',status:200,data:filenames})
})

app.listen(PORT,()=>console.log(`Listen on port ${PORT}`))