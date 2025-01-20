require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');
const cors = require('cors');
const nodemailer = require('nodemailer');
const knex = require('./database/db-config');
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

// Seadistame pildi üleslaadimise
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, 'criminal-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET kõik kurjategijad
app.get("/criminals", async (req, res) => {
  try {
    const criminals = await knex('criminals')
      .select('Id', 'Name', 'Gender', 'Offence', 'City', 'InPrison', 'ImageUrl');
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
    console.log('Received criminal data:', req.body);

    if (!req.body.Name || !req.body.Gender || !req.body.Offence || !req.body.City) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const [id] = await knex('criminals').insert({
      Name: req.body.Name,
      Gender: req.body.Gender,
      Offence: req.body.Offence,
      City: req.body.City,
      InPrison: req.body.InPrison || false,
      ImageUrl: req.body.ImageUrl || null
    });

    const newCriminal = await knex('criminals').where('Id', id).first();
    res.status(201).json(newCriminal);
  } catch (error) {
    console.error('Error creating criminal:', error);
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

// GET kõik kasutajad
app.get("/users", async (req, res) => {
  try {
    const users = await knex('users')
      .select('ID', 'Username', 'Firstname', 'Lastname', 'Email', 'SecureLevel');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET üks kasutaja
app.get("/users/:id", async (req, res) => {
  try {
    const user = await knex('users')
      .where('ID', req.params.id)
      .first();
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST uus kasutaja
app.post('/users', async (req, res) => {
  try {
    if (!req.body.Username || !req.body.Firstname || !req.body.Lastname || !req.body.Email || !req.body.SecureLevel) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const [id] = await knex('users').insert({
      Username: req.body.Username,
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      Email: req.body.Email,
      SecureLevel: req.body.SecureLevel
    });

    const newUser = await knex('users').where('ID', id).first();
    res.status(201)
      .location(`${getBaseURL(req)}/users/${id}`)
      .json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT kasutaja muutmine
app.put('/users/:id', async (req, res) => {
  try {
    if (!req.body.Username || !req.body.Firstname || !req.body.Lastname || !req.body.Email || !req.body.SecureLevel) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const count = await knex('users')
      .where('ID', req.params.id)
      .update({
        Username: req.body.Username,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        SecureLevel: req.body.SecureLevel
      });

    if (count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await knex('users')
      .where('ID', req.params.id)
      .first();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE kasutaja kustutamine
app.delete('/users/:id', async (req, res) => {
  try {
    const count = await knex('users')
      .where('ID', req.params.id)
      .delete();
    
    if (count === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// POST login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await knex('users')
      .where('username', username)
      .first();
    
    if (user && user.password === password) {
      res.json({
        success: true,
        role: user.role,
        username: user.username
      });
    } else {
      res.status(401).json({ 
        success: false,
        error: 'Vale kasutajanimi või parool' 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lisa uus endpoint pildi üleslaadimiseks
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Tagasta pildi URL
    const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serveeri staatilisi faile uploads kaustast
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Api on saadaval aadressil: http://localhost:${port}`);
});

function getBaseURL(req) {
    return req.connection && req.connection.encrypted ? "https" : "http" + `://${req.headers.host}`;
}