const express = require('express');
const router = express.Router();
const ticketController = require('./controllers/ticketController');

router.post('/ticket', ticketController.creteTicket);

router.get('/tickets', ticketController.getTickets);

router.get('/ticket/:id', ticketController.getTicket);

router.put('/ticket/:id', ticketController.updateTicket);


module.exports = router;