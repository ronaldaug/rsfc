const Config = {
// Website title
webTitle: 'Resuable single component',

// Header Data 
htmlHead:()=>{
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <meta http-equiv="X-UA-Compatible" content="ie=edge">
         <title>${Config.webTitle}</title>
    `
},

// header End
headerEnd: `
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>`,

// ending Data 
htmlEnd:`
<script src="assets/js/main.js"></script>
</body>
</html>
`,

globalCSS: `
/* ========================
Global CSS
=========================*/
body{
    margin:0;
    font-size:16px;
    color:#728496;
    font-family: 'Roboto', sans-serif;
    font-weight:300;
    overflow-x:hidden;
    box-sizing:border-box;
    background:#f6f7f9;
}
section{
    padding:40px 0 40px;
}
.section-title{
    color:#262e41;
    margin:40px 0 40px;
  }

  @media (max-width:576px;){
      .section-title{
          margin:20px 4px 20px;
      }
      section{
          padding:20px 4px 20px;
      }
  }
`,

overwriteCSS: '',

}