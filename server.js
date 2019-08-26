const express = require('express')
const bcrypt = require('bcrypt');
var dbQuery = require('./db/db');

const app = express()
const port = process.env.port || 5000;

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req, reexs) => res.send('This is SFC APP!'))

// USER METHODS
const request = '---THIS IS A REQUEST---';

//app.get('/api/users', (req, res) => res.send(dbQuery(request)))
app.get('/api/users', async (req, res) => {
    const query = 'SELECT * FROM users';
    var result = await dbQuery(query);
    res.send(result);
})

// Authenticate 

app.post('/api/users', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password; 
    console.log(email, password);
    //console.log(req);
    const query = `SELECT user_id, email, password FROM users WHERE email = '${email}'`;
    var users = await dbQuery(query);
    
    if(users.length > 0)
    {   
        var user = users[0];
        bcrypt.compare(password, user.password).then(function(auth) {
            if(auth) {
                res.json({'email': email, 'user_id': user.user_id, 'auth': true});
            }
            else {
                res.json({'email': email, 'user_id': user.user_id, 'auth': false});
            }
        });
    }
    else if(users.length == 0) { // email doesn't exist
        var result = await addUser(email, password);
        res.send(result);
    }
})

// Add new user
app.put('/api/users', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var result = await addUser(email, password);
    res.send(result);
})

async function addUser(email, password) {
    var hash = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO users (email,password) VALUES ('${email}','${hash}')`;
    var result = await dbQuery(query);
    console.log('ADD USER:', result);
    return result;
}

// MEMOS METHODS
// Get memos by user id
app.get('/api/memos', async (req, res) => {
    var user_id = req.query.user_id;
    const query = `SELECT * FROM memos WHERE user_id = ${user_id}`;
    var result = await dbQuery(query);
    res.json(result);
})
// Edit a memo
app.post('/api/memos/:id', async (req, res) => {
    var memo_id = req.params.id;
    var subject = req.body.subject;
    var body = req.body.body;
    const query = `UPDATE memos SET subject='${subject}', body='${body}' WHERE memo_id = ${memo_id}`;
    var result = await dbQuery(query);
    res.json(result);
})

// Add a memo
app.put('/api/memos/', async (req, res) => {
    var user_id = req.body.user_id;
    var subject = req.body.subject;
    var body = req.body.body;
    const query = `INSERT INTO memos (user_id, subject, body) VALUES (${user_id},'${subject}','${body}')`;
    var result = await dbQuery(query);
    res.json(result);
})

// Delete a memo
app.delete('/api/memos/:id', async (req, res) => {
    var memo_id = req.params.id;
    const query = `DELETE FROM memos WHERE memo_id = ${memo_id}`;
    var result = await dbQuery(query);
    res.json(result);
})

// FILES METHODS
// Get files list by memo id
app.get('/api/files', async (req, res) => {
    var memo_id = req.query.memo_id;
    const query = `SELECT memo_id, file_id, name FROM files WHERE memo_id = ${memo_id}`;
    var result = await dbQuery(query);
    res.json(result);
})

// Get file contents by file id
app.get('/api/files/:id', async (req, res) => {
    var file_id = req.params.file_id;
    const query = `SELECT name, contents FROM files WHERE file_id = ${file_id}`;
    var result = await dbQuery(query);
    res.json(result);
})

// Add a file
app.put('/api/files/:memo_id', async (req, res) => {
    var memo_id = req.params.memo_id;
    var name = req.body.name;
    var contents = req.body.contents;
    const query = `INSERT INTO files (memo_id, name, contents) VALUES (${memo_id},'${name}','${contents}')`;
    var result = await dbQuery(query);
    res.json(result);
})

// Delete a file
app.delete('/api/files/:id', async (req, res) => {
    var file_id = req.params.id;
    const query = `DELETE FROM files WHERE file_id = ${file_id}`;
    var result = await dbQuery(query);
    res.json(result);
})

app.listen(port, () => console.log(`Simple memo app is listening on port ${port}!`))