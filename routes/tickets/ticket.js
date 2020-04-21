const express = require('express');
const router = express.Router();
const Ticket = require('./models/Ticket');
const ticketController = require('./controllers/ticketController');

router.post('/ticket', ticketController.creteTicket);

router.get('/tickets', ticketController.getTickets);

router.get('/ticket/:id', ticketController.getTicket);

router.put('/ticket/:id', ticketController.updateTicket);

router.delete('/ticket/:id', ticketController.deleteTicket);

module.exports = router;