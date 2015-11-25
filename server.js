'use strict';

var http = require('http'),
  express = require('express'),
  router = express.Router(),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 5000,
  mandrill = require('mandrill-api/mandrill'),
  mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_KEY),
  server;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

router.route('/mandrill').post(function (req, res) {
  var fromEmail = 'noreply@dday.com',
    fromName = 'DDay';

  var message = {
    "html": req.body.message,
    "text": req.body.message,
    "subject": req.body.subject,
    "from_email": fromEmail,
    "from_name": fromName,
    "to": [{
      "email": req.body.toEmail,
      "name": req.body.toName,
      "type": "to"
    }],
    "headers": {
      "Reply-To": fromEmail
    }
  };
  mandrillClient.messages.send({ "message": message, "async": true }, function (result) {
    res.json(result);
  }, function (e) {
    console.log('A Mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
});

app.use('/api', router);
server = http.createServer(app);
server.listen(port);

console.log('HTTP server listening on %d', port);
