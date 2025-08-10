// app.js
const apm = require('elastic-apm-node').start({
    serviceName: 'elk-app-node-js',
    serverUrl: 'http://apm-server:8200',
    environment: 'my-environment',
  });

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Aplicação Node-js executando com o Elastic APM!');
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log('App node-js running on http://localhost:' + PORT);
});
