const express = require('express');
const serverless = require('serverless-http');
const path = require('path');

const app = express();
const router = express.Router();

router.get('/api', (req, res) => {
  res.json({
    hello: 'world'
  });
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/.netlify/functions/server', router);

module.exports.handler = serverless(app);
