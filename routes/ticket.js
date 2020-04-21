var express = require('express');
var router = express.Router();
const Ticket = require('../models/Ticket');

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/ticket', (req, res) => {
  const newTicket = new Ticket();
  newTicket.openedBy = req.body.openedBy;
  newTicket.client = req.body.client;
  newTicket.issue = req.body.issue;
  newTicket.resolution = req.body.resolution;
  newTicket.closedBy = req.body.closedBy;
  newTicket.closeDate = req.body.closeDate;
  newTicket.save().then((ticket) => {
    return res.json(ticket);
  });
});

router.get('/tickets', (req, res) => {
  Ticket.find({}).then((tickets) => {
    tickets.reverse();
    return res.json(tickets);
  });
});

router.get('/ticket/:id', (req, res) => {
  Ticket.findById({ _id: req.params.id }).then((ticket) => {
    return res.json(ticket);
  });
});

router.put('/ticket/:id', (req, res) => {
  Ticket.findById({ _id: req.params.id }).then((ticket) => {
    ticket.client = req.body.client ? req.body.client : ticket.client;
    ticket.issue = req.body.issue ? req.body.issue : ticket.issue;
    ticket.resolution = req.body.resolution ? req.body.resolution : ticket.resolution;
    ticket.closedBy = req.body.closedBy ? req.body.closedBy : ticket.closedBy;
    ticket.closeDate = req.body.closeDate ? req.body.closeDate : ticket.closeDate;
    ticket.save().then((ticket) => res.json(ticket));
  });
});

router.delete('/ticket/:id', (req, res) => {
  Ticket.findByIdAndDelete({ _id: req.params.id }).then(
    res.json({ message: 'deleted' })
  );
});

module.exports = router;
