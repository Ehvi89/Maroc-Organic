const express = require('express');
const stuffRoutes = require('./routes/stuff');
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

// Middleware pour analyser le corps des requêtes JSON
app.use(express.json());

// Middleware pour les en-têtes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Gérer les requêtes de prévol
    if ('OPTIONS' === req.method) {
        // Répondre aux requêtes de prévol
        res.sendStatus(200);
    } else {
        // Passer au prochain middleware
        next();
    }
});


// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/MarocOrganic',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation des routes
app.use('/api', stuffRoutes);
app.use('/api', userRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")))

// Route catch-all pour capturer toutes les autres requêtes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

module.exports = app;
