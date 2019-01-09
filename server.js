
const express = require('express')
const port = 3000

const app = express(),
      staticServe = express.static(`${ __dirname }/public`);

app.use("/", staticServe);
app.use("*", staticServe);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))