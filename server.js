const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.static('public'));
app.use("/rsfc", express.static(__dirname + "/rsfc"));
app.use("/", express.static(__dirname + "/public"));
app.listen(PORT,()=>{
    console.log('\x1b[36m%s\x1b[0m', 'Server is listening on port - '+PORT);  //cyan
})