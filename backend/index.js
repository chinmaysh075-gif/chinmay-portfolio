const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync()
  .then(() => console.log('SQLite database synced successfully.'))
  .catch(err => console.error('Error syncing database:', err));

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({ message: 'Contact message saved successfully.', contact: newContact });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'An error occurred while saving the message.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
