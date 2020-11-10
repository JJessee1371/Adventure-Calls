const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

//GET routes for rendering HTML files
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/action', (req, res) => {
    res.render('action');
});
