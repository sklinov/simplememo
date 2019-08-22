const express = require('express')
const app = express()
const port = process.env.port || 5000;

app.get('/api', (req, res) => res.send('This is SFC APP!'))

app.listen(port, () => console.log(`SFC app is listening on port ${port}!`))