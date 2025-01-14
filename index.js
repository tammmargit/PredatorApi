require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const cors = require('cors');
const nodemailer = require('nodemailer');
const knex = require('./database/db-config');

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

// GET kõik kurjategijad
app.get("/criminals", async (req, res) => {
  try {
    const criminals = await knex('criminals')
      .select('Id', 'Name', 'Gender', 'Offence', 'City', 'InPrison');
    res.json(criminals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET üks kurjategija
app.get("/criminals/:id", async (req, res) => {
  try {
    const criminal = await knex('criminals')
      .where('Id', req.params.id)
      .first();
    
    if (!criminal) {
      return res.status(404).json({ error: "Criminal not found" });
    }
    res.json(criminal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST uus kurjategija
app.post('/criminals', async (req, res) => {
  try {
    if (!req.body.Name || !req.body.Gender || !req.body.Offence || !req.body.City) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const [id] = await knex('criminals').insert({
      Name: req.body.Name,
      Gender: req.body.Gender,
      Offence: req.body.Offence,
      City: req.body.City,
      InPrison: req.body.InPrison || false
    });

    const newCriminal = await knex('criminals').where('Id', id).first();
    res.status(201).json(newCriminal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT kurjategija muutmine
app.put('/criminals/:id', async (req, res) => {
  try {
    if (!req.body.Name || !req.body.Gender || !req.body.Offence || !req.body.City) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const count = await knex('criminals')
      .where('Id', req.params.id)
      .update({
        Name: req.body.Name,
        Gender: req.body.Gender,
        Offence: req.body.Offence,
        City: req.body.City,
        InPrison: req.body.InPrison
      });

    if (count === 0) {
      return res.status(404).json({ error: "Criminal not found" });
    }

    const updatedCriminal = await knex('criminals')
      .where('Id', req.params.id)
      .first();
    res.json(updatedCriminal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE kurjategija
app.delete('/criminals/:id', async (req, res) => {
  try {
    const count = await knex('criminals')
      .where('Id', req.params.id)
      .delete();
    
    if (count === 0) {
      return res.status(404).json({ error: "Criminal not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'margit.tammeorg@gmail.com', // Replace with your Gmail
    pass: 'tcsxslwiqfsnicez'     // Replace with your app password
  }
});

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
    //     Username: "Nipi",
    //     Firstname: "Mihkel",
    //     Lastname: "Jaakson",
    //     Email: "mihkel@example.com",
    //     SecureLevel: 0,
    if (!req.body.Username ||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.Email||
        !req.body.SecureLevel) 
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
        !req.body.SecureLevel) 
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

// Add new endpoint for sending emails
app.post('/report', cors(), express.json(), (req, res) => {
  const { name, email, message } = req.body;
  
  const mailOptions = {
    from: 'margit.tammeorg@gmail.com',  // Replace with your Gmail
    to: 'margit.tammeorg@gmail.com',   // Replace with destination email
    subject: `New Crime Report from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Api on saadaval aadressil: http://localhost:${port}`);
});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ? "https" : "http" + `://${req.headers.host}`;
}