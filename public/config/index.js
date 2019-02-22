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
<link rel="stylesheet" href="css/style.css">
</head>
<body>`,

// ending Data 
htmlEnd:`
<script src="js/main.js"></script>
</body>
</html>
`

}