const express = require('express');
const router = express.Router();
const postmark = require('postmark');
const mailTemplates = require('../../helpers/mailTemplates');

const client = new postmark.Client('c161bc81-707d-4a43-b851-8bc95c29ab08');

router.post('/emailnotification', (req, res) => {
  // call a function that will return the email body
  console.log('DM req.body');
  console.log(req.body);
  const emailTemplate = mailTemplates.setEmailTemplate(req.body);

  const message = {
    From: 'support@interactiveservices.com',
    To: 'dmcmahon@interactiveservices.com',
    Subject: emailTemplate.subject,
    TextBody: emailTemplate.body
  };
  client.sendEmail(message, function(err, info) {
    if (err) {
      res.status(500).json('Server Error');
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
});

router.post('/notification', (req, res) => {});

// export the router so it can be used elsewhere
module.exports = router;
