#!/usr/bin/env node

// incluindo as APIs 
var http = require('http'),
    fs = require('fs'),
    util = require('util');

http.createServer(function (req, res) {
  var path = '/Users/guilh/Documents/UFF/ES/Projeto/cf0d66958126e05d095e8c02ce869a25-18200587415ad17daed25ca0282c5b0f5f960707/videoplayback.mp4';
  //pega estatísticas do arquivo
  var stat = fs.statSync(path);
  //adiciona a total o tamanho do arquivo
  var total = stat.size;
  //grava as requisições feitas no console
  console.log("REQUEST: "+JSON.stringify(req.headers));
  if (req.headers['range']) {
    //requisição do range para carregar o vídeo
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    //calculando o valor do buffer
    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    //criando o stream com o buffer calculado e com o ponto de partida clicado, resposta http 206 = partial content
    var file = fs.createReadStream(path, {start: start, end: end});
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + 
        end + '/' + total, 'Accept-Ranges': 'bytes', 
        'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    file.pipe(res);
  } else {
    //resposta para requisição de abrir o arquivo de vídeo
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 
        'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }
}).listen(8700);
// porta em que foi aberta a comunicação do servidor com o cliente
console.log('Servidor rodando em 8700');