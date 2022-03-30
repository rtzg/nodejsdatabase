const port = process.env.PORT || 3000;
const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();

// when user get /get?x return data.json["data"][x] in json format
// when user get /set?x=y set data.json["data"][x] = y, and return data.json["data"][x] in json format
// on error return error in json format

var json;
app.get('/get', function(req, res) {
    try {
        app.set('json spaces', 40);
        fs.readFile('data.json', function(err, data) {
            res.setHeader('Content-Type', 'application/json');
            var search = req.url.split('?')[1];
            json = JSON.parse(data)['data'][search];
            res.json(JSON.parse(JSON.stringify(json) === undefined ? `{"error":"Missing or unknown index"}` : '{"data":' + JSON.stringify(json) + '}'));
            console.log(json);
            return res.json();
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: e}));
    }
});

app.get('/set', function(req, res) {
    try{
        var search = req.url.split('?')[1];
        var name = search.split('=')[0];
        var value = search.split('=')[1];
        var orginData;
        var FData = {};
        if(name!=undefined && value!=undefined){
            fs.readFile('data.json', function(err, data) {
                orginData = JSON.parse(data);
                FData[name] = decodeURIComponent(value);
                orginData['data'][name] = FData[name];
                orginData = decodeURIComponent(JSON.stringify(orginData));
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(FData));
                fs.writeFile('data.json', orginData, function(err) {
                    if(err != null) {
                        return console.log(err);
                    }
                    
                });
            });
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'Missing value or name'}));
        }
    } catch (e) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: e}));
        return res.end();
    }
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// create server.
http.createServer(app).listen(port, function() {
    console.log('Server listening on port ' + port);
});