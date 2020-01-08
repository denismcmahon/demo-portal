let addClientMail = {
  subject: 'A new client has been added to the Solutions site',
  body:
    'A new client has been added to the Solutions site. Details below\n\nClient name: [clientName]\n\nLogin Id: [loginId]\n\nExpiry Days: [expiryDays]\n\nPassword: [password]\n\nSolutions Team'
};

setEmailTemplate = emailParams => {
  let emailTemplate = {};
  if (emailParams.mailType === 'addClient') {
    emailTemplate.subject = addClientMail.subject;
    emailTemplate.body = addClientMail.body.split('[clientName]').join(emailParams.name);
    emailTemplate.body = emailTemplate.body.split('[loginId]').join(emailParams.email);
    emailTemplate.body = emailTemplate.body.split('[expiryDays]').join(emailParams.expiryDays);
    emailTemplate.body = emailTemplate.body.split('[password]').join(emailParams.password);
  }
  return emailTemplate;
};

module.exports = {
  setEmailTemplate
};
