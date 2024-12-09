const port = 8080;
const app = require('express')();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
var express = require('express')

const criminals = [
    { 
        Id: 1,
        Name: "John Doe", Gender: "Male", Offence: "Robbery"
    },
    { 
        Id: 2, 
        Name: "Diddy", Gender: "Male", Offence: "Murder"
    },
    { 
        Id: 3, 
        Name: "Jeffrey Epstein", Gender: "Male", Offence: "Pedophilia"
    } 
]

const users = [
    {
        ID: 1,
        Username: "MariLii",
        Firstname: "Mari",
        Lastname: "Lii",
        Email: "mari@example.com",
        SecureLevel: 0,
        LevelKey: "0-0"
    },
    {
        ID: 2,
        Username: "LiinaTiina",
        Firstname: "Liina",
        Lastname: "Tiina",
        Email: "liina@example.com",
        SecureLevel: 0,
        LevelKey: "0-1"
    },
    {
        ID: 3,
        Username: "KustiLusti",
        Firstname: "Kusti",
        Lastname: "Lusti",
        Email: "kusti@example.com",
        SecureLevel: 0,
        LevelKey: "1-0"
    },
    {
        ID: 4,
        Username: "Admin",
        Firstname: "Admin",
        Lastname: "Administraator",
        Email: "admin@example.com",
        SecureLevel: 1,
        LevelKey: "0-0"
    },
]

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

// WORKS
app.get("/criminals", (req, res) => { res.send(criminals)})
app.get("/criminals/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Check if the ID is a valid number
    if (isNaN(id)) {
        return res.status(400).send({error: "Invalid criminal ID"});
    }

    // Check if the criminal exists
    if (typeof criminals[id - 1] === "undefined") {
        return res.status(404).send({error: "Criminal not found"});
    }

    res.send(criminals[id - 1]);
})

app.post('/criminals', (req, res) => {
    if (!req.body.Name || 
        !req.body.Gender ||
        !req.body.Offence) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }

    let criminal = {
        Id: criminals.length +1,
        Name: req.body.Name,
        Gender: req.body.Gender,
        Offence: req.body.Offence
    }
    criminals.push(criminal);
    res.status(201)
        .location(`${getBaseURL(req)}/criminals/${criminals.length}`)
        .send(criminal);
})

app.put('/criminals/:id', (req, res) => {
    if (req.params.id == null) {
        return res.status(404).send({error: "Criminal not found"});
    }
    if (!req.body.Name || 
        !req.body.Gender ||
        !req.body.Offence) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }
    let criminal = {
        Id: req.body.id,
        Name: req.body.Name,
        Gender: req.body.Gender,
        Offence: req.body.Offence
    }
    criminals.splice((req.body.id-1), 1, criminal);
    res.status(201)
        .location(`${getBaseURL(req)}/criminals/${criminals.length}`)
        .send(criminal);

})


app.delete('/criminals/:id', (req, res) => {
    if(typeof criminals[req.params.id -1] === 'undefined') {
        return res.status(404).send({error: "Criminal not found"});
    }
    criminals.splice(req.params.id-1, 1);

    res.status(204).send({error: "No Content"});
 
})

app.get("/users", (req, res) => { res.status(200).send(users)})

app.get("/users/:id", (req, res) => {
    if (typeof users[req.params.id -1] === "undefined") {
        return res.status(404).send({error: "User not found"});
    }
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid user ID specified"});
    }
    res.status(200).send(users[req.params.id-1])
})
app.post('/users', (req, res) => {
    // ID: 1,
    //     Username: "xXtittyslayer666Xx",
    //     Firstname: "Mihkel",
    //     Lastname: "Jaakson",
    //     Email: "mihkel@example.com",
    //     SecureLevel: 0,
    //     LevelKey: "0-0"
    if (!req.body.Username ||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.Email||
        !req.body.SecureLevel||
        !req.body.LevelKey) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }

    let user = {
        ID: users.length +1,
        Username: req.body.Username,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        SecureLevel: req.body.SecureLevel,
        LevelKey: req.body.LevelKey,
    }
    users.push(user);
    res.status(201)
        .location(`${getBaseURL(req)}/users/${users.length}`)
        .send(user);
})

app.put('/users/:id', (req, res) => {
    if (req.params.id == null) {
        return res.status(404).send({error: "User not found"});
    }
    if (!req.body.Username ||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.Email||
        !req.body.SecureLevel||
        !req.body.LevelKey) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }
    let user = {
        ID: parseInt(req.body.id+1),
        Username: req.body.Username,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        SecureLevel: req.body.SecureLevel,
        LevelKey: req.body.LevelKey,
    }
    user.ID = parseInt(req.body.ID);
    users.splice((req.body.ID-1), 1, user);
    res.status(201)
        .location(`${getBaseURL(req)}/users/${users.length}`)
        .send(user);
})

app.delete('/users/:id', (req, res) => {
    if(typeof users[req.params.id -1] === 'undefined') {
        return res.status(404).send({error: "User not found"});
    }
    users.splice(req.params.id-1, 1);

    res.status(204).send({error: "No Content"});
})

app.listen(port, () => {console.log(`Api on saadaval aadressil: http://localhost:${port}`);});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ? "https" : "http" + `://${req.headers.host}`;
}