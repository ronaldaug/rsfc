var zip = new JSZip();
var files = [];
var settingToggle = document.querySelector(".setting-toggle");
var settingSideNav = document.querySelector('.setting');
var spinnerText = document.querySelector(".spinner p");
var allEditors = document.querySelectorAll(".code");
var iframeDoc = document.getElementById('preview-frame').contentWindow.document;

  var htmlE = document.querySelector("#index-result .code");
var htmlEditor = ace.edit(htmlE);
htmlEditor.setTheme(htmlE.getAttribute("ace-theme"))
htmlEditor.getSession().setMode(htmlE.getAttribute("ace-mode"));

// css editor 
var cssE = document.querySelector("#css-result .code");
var cssEditor = ace.edit(cssE);
cssEditor.setTheme(cssE.getAttribute("ace-theme"))
cssEditor.getSession().setMode(cssE.getAttribute("ace-mode"));

// js editor
var jsE = document.querySelector("#js-result .code");
var jsEditor = ace.edit(jsE);
jsEditor.setTheme(jsE.getAttribute("ace-theme"))
jsEditor.getSession().setMode(jsE.getAttribute("ace-mode"));


    function getIdfromHTML(html) {
        return new RegExp(/<([^\s]+).*?id="([^"]*?)".*?>(.+?)<\/\1>/).exec(html);
    }

    function message(msg,type,isStop){
      let err = document.createElement('p');
      err.innerText = msg;
      err.style.color = type=="error"?"red":"green";
      err.style.fontSize = "11px";
      document.querySelector('.setting').insertBefore(err,stepTwo)
      if(isStop){
        return
      }
        setTimeout(()=>{
            err.setAttribute('style','display:none');
        },3000)
    }

    function domParse(data){
      var el = document.createElement('html');
      el.innerHTML = data;
      return el;
    }
    
    function resetData(){
      var conf = confirm("Are you sure you want to reset all data!");
      if(!conf){return}
      var spinn = document.querySelector('.spinner');
      if(spinn){
        spinn.setAttribute('style','display:none');
      }
      document.querySelector("#index-result").textContent = '';
      document.querySelector("#js-result").textContent = '';
      document.querySelector("#css-result").textContent = '';
      localStorage.clear();
      window.location.reload();
    }

    function getName(name){
      let string = name.split(".")[0];
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

var dirInput = document.getElementById("get-dirs");
// Access and handle the files 
let stepOne = document.querySelector(".step-one");
let stepTwo = document.querySelector(".step-two");
function getfiles(){
        files = [];
        for (i = 0; i < dirInput.files.length; i++) {
            files.push(dirInput.files[i].name);
        }

if(!files){return}
stepOne.setAttribute("style","display:none");
stepTwo.setAttribute("style","display:block");

let sectionList = files.map(e=>`<li id="${getName(e)}">${getName(e)} section</li>`).join("");
 let pickable = document.querySelector('.section-pickable');
 pickable.innerHTML = sectionList;
 sortableJS();

}
// Onclick Events
const appendData = () =>{
  htmlEditor.setValue(generateIndex(files))
  jsEditor.setValue(generateJS())
  cssEditor.setValue(generateStyle())
}

const generateIndex = (files) =>{
  let jsArr = JSON.parse(localStorage.getItem('scripts'));
  let cssArr = JSON.parse(localStorage.getItem('links'));
  let sectionArr = JSON.parse(localStorage.getItem('sections'));
var htmlData = '';
    htmlData += Config.htmlHead(); // header
    htmlData += `
    <!-- all CSS Links -->
    `;
    const ifNoCSS = cssArr||[];
    htmlData += ifNoCSS.join("\n");
    htmlData += Config.headerEnd;
    const ifNoHTML = sectionArr||[];
    let htmlSections = ifNoHTML.map((section,index)=>{
      if(!section){return}
       return `
       <!-- ${getName(files[index])} -->
       ${section}
       <!-- end ${getName(files[index])} -->
       `;
    });
    htmlData += htmlSections.join("");
    htmlData += `
    <!-- all JS scripts -->
    `;
    const ifNoJS = jsArr||[];
    htmlData += ifNoJS.join("\n");
    htmlData += Config.htmlEnd;
    return htmlData;
}

// ================
      // all css codes
      const getCSSLinks = ()=>{

        const getC = new Promise((resolve,reject)=>{
         // all css links
         const getAllLinks = new Promise((resolve,reject)=>{
          var links = [];
          var finalArr = [];
          for(let i=0;i<files.length;i++){
          var link = fetch('/components/'+files[i]).then(e=>e.text()).then(res=>{
          var dom = domParse(res);
          var linkData = dom.querySelectorAll("link");
                  linkData.forEach(e=>{
                       if(!e){return}
                        links.push(e.outerHTML)
                  })
                  return links
                  })
                  finalArr.push(link)
              }
         resolve(finalArr);
        })

        getAllLinks.then(allL=>{
          let realL = [];
          allL.forEach((l,x)=>{
            if(x==(allL.length -1)){
                l.then(e=>{
                  if(!e){return}
                  localStorage.setItem('links',JSON.stringify([...new Set(e)]))
                  resolve('done')
                })
            }
          })
        })

      })
      return getC;
      }


// store HTML sections in localStorage
    const getHTML = ()=>{
          var htmlcodes = [];
            for(let i=0;i<files.length;i++){
              fetch('/components/'+files[i]).then(e=>e.text()).then(res=>{
          var dom = domParse(res);
              var ht = dom.querySelector("section");
              if(!ht){
                  message(`Please provide <section> tag for  ${files[i]}.`,"error",true)
              }
               htmlcodes.push(ht.outerHTML);
                localStorage.setItem('sections',JSON.stringify(htmlcodes));
            })
          }
  }

//  store js codes in localStorage
const getJSCodes = ()=>{
              var jsCodes = [];
          for(let i=0;i<files.length;i++){
          fetch('/components/'+files[i]).then(e=>e.text()).then(res=>{
          var dom = domParse(res);
              let allScript = dom.querySelectorAll("script");
              allScript.forEach(e=>{
                if(!e){return}
                if(!e.outerHTML.toString().includes("<script src")){
                      jsCodes.push(e.innerHTML);
                  }
               })
                localStorage.setItem('jscodes',JSON.stringify(jsCodes));
            })
          }
      }

//  store css codes in localStorage
    const getCSScodes = ()=>{
          var cssCodes = [];
          for(let i=0;i<files.length;i++){
          fetch('/components/'+files[i]).then(e=>e.text()).then(res=>{
          var dom = domParse(res);
              let allScript = dom.querySelectorAll("style");
              if(allScript.length == 0){
                  message(`Please add at least one <style> tag for  ${files[i]}.`,"error",true);
                  return;
              }
              allScript.forEach(e=>{
                    if(!e){return}
                      cssCodes.push(e.innerHTML);
               })
                localStorage.setItem('csscodes',JSON.stringify(cssCodes));
            })
          }
        }

 // get all javascript Links
  const getJSLinks = () =>{
        // all js scripts
        const getAllScript = new Promise((resolve,reject)=>{
          var links = [];
          var finalArr = [];
          for(let i=0;i<files.length;i++){
          var link = fetch('/components/'+files[i]).then(e=>e.text()).then(res=>{
          var dom = domParse(res);
          var linkData = dom.querySelectorAll("script");
                  linkData.forEach(e=>{
                    if(!e){return}
                        if(e.outerHTML.toString().includes("<script src=")){
                            links.push(e.outerHTML)
                        }
                  })
                  return links
                  })
                  finalArr.push(link)
              }
         resolve(finalArr);
        })
        getAllScript.then((allL)=>{
          allL.forEach((l,x)=>{
            if(x==(allL.length -1)){
                l.then(e=>{
                  if(!e){return}
                  localStorage.setItem('scripts',JSON.stringify([...new Set(e)]))
                })
            }
          })
    })
 }


//  generate style.css codes
const generateStyle = () =>{
  let csscodes = JSON.parse(localStorage.getItem('csscodes'));
  if(!csscodes){return}
  let CSSdata =  csscodes.map((css,index)=>{
return `
/* ========================== */
/* ${getName(files[index])}
/* =========================== */
  ${css}
`;
})
  return CSScontent(csscodes) + CSSdata.join('')
}


// Table of content for JS
const JScontent = (jscodes)=>{
  var jscData = `
// ==========================
// Table of content for JS
// ---------------------------------------------`;
jscodes.forEach((js,i)=>{
    jscData += `
//  ${i+1} - ${getName(files[i])}`;
  })
  let endContent = `
// ==========================`
  return jscData + endContent
}

// Table of content for CSS
const CSScontent = (csscodes)=>{
  var csscData = `
/* ========================== /
Table of content for CSS
/ ---------------------------------------------- /`;
csscodes.forEach((css,i)=>{
  csscData += `
  ${i+1} - ${getName(files[i])}`;
  })
  let endContent = `
/ ========================== */
`
  return csscData + endContent
}

//  generate main.js codes
 const generateJS = () =>{
  let jscodes = JSON.parse(localStorage.getItem('jscodes'));
  if(!jscodes){return}
  let jsData = jscodes.map((js,index)=>{
return `
// ==========================
// ${getName(files[index])}
// ==========================
  ${js}
`;
})
return JScontent(jscodes) + jsData.join("");
}

const  download = () =>{
  // Create zip file
zip.file("index.html", htmlEditor.getValue());

 // create js folder
 let jsFolder = zip.folder("js");
jsFolder.file("main.js",  jsEditor.getValue());

 // create css folder
 let cssFolder = zip.folder("css");
cssFolder.file("style.css", cssEditor.getValue());

  zip.generateAsync({type:"blob"})
    .then(function(content) {
    // see FileSaver.js
    const timestamp = Date.now();
    saveAs(content, `export-${timestamp}.zip`);
   });
}
 
 // ================= 
const appendToIframe = ()=>{
  var cssEl = document.createElement("style");
  cssEl.innerHTML = cssEditor.getValue();
  var jsEl = document.createElement("script");
  jsEl.innerHTML = jsEditor.getValue();
  let dom = domParse(htmlEditor.getValue());
  dom.querySelector("head").appendChild(cssEl);
  dom.querySelector("body").appendChild(jsEl);
  iframeDoc.open();
  iframeDoc.write(dom.outerHTML);
  iframeDoc.close();
}
 const Init = ()=>{
    document.querySelector(".spinner").setAttribute("style","display:block");
        if(files){
          setTimeout(()=>{
            getHTML();
            spinnerText.innerText = 'Generate HTML sections..'
          },200)
           setTimeout(()=>{
            getCSSLinks();
            spinnerText.innerText = 'Generate CSS Links..'
          },400)
          setTimeout(()=>{
            getJSLinks();
            spinnerText.innerText = 'Generate Javascript Links..'
          },600)
          setTimeout(()=>{
            getJSCodes();
            spinnerText.innerText = 'Generate Javascript codes..'
          },800)
          setTimeout(()=>{
            getCSScodes();
            spinnerText.innerText = 'Generate CSS codes..'
          },1000)
          setTimeout(()=>{
            document.querySelector(".spinner").setAttribute("style","display:none");
            appendData();
          },1200)
        }
}


// Drag and Drop - Sort Sections
function sortableJS(){
    /// sortable option
sortable('.section-sortable', {
    acceptFrom:".section-pickable,.section-sortable",
    forcePlaceholderSize: true,
})
sortable('.section-pickable', {
    forcePlaceholderSize: true,
    acceptFrom:".section-sortable",
})


//  Sort Stopped
sortable('.section-sortable')[0].addEventListener('sortstop', function() {
let serialized = sortable('.section-sortable', 'serialize');
if(serialized[0].items.length == 0){
       message("Please add at least one component.","error")
}
files = [];
serialized[0].items.forEach(e=>{
    let seName = getIdfromHTML(e.html)[2].toLocaleLowerCase()+'.html';
    files.push(seName);
});
Init();

setTimeout(()=>{
  appendToIframe();
},2000)

})

}

// Toggle Setting
settingToggle.addEventListener('click',()=>{
    let aniCSS = `transform:translateX(100%);box-shadow:none;`
    if(settingSideNav.hasAttribute("style")){
        settingSideNav.removeAttribute("style")
    }else{
        settingSideNav.setAttribute("style",aniCSS)
    }
})

// Preview codes
function viewsource() {
document.querySelector(".edit-source").setAttribute("style","transform:translateY(0%);opacity:1;top:0;left:0;");
}

function closePreview(){
  document.querySelector(".edit-source").setAttribute("style","transform:translateY(-180%);opacity:0;");
  appendToIframe();
}