const Ticket = require('../models/Ticket');

module.exports = {
    creteTicket:(req, res) => {
        const newTicket = new Ticket();
        newTicket.openedBy = req.body.openedBy;
        newTicket.client = req.body.client;
        newTicket.issue = req.body.issue;
        newTicket.comments = req.body.comments;
        newTicket.resolution = req.body.resolution;
        newTicket.open = req.body.open;
        newTicket.closedBy = req.body.closedBy;
        newTicket.closeDate = req.body.closeDate;
        newTicket.save().then((ticket) => {
            return res.json(ticket);
        });
    },
    getTickets:(req, res) => {
        Ticket.find({}).then((tickets) => {
            tickets.reverse();
            return res.json(tickets);
        });
    },
    getTicket:(req, res) => {
        Ticket.findById({ _id: req.params.id }).then((ticket) => {
            return res.json(ticket);
        });
    },
    updateTicket:(req, res) => {
        Ticket.findById({ _id: req.params.id }).then((ticket) => {
            ticket.open = req.body.open ? req.body.open : ticket.open;
            // ticket.client = req.body.client ? req.body.client : ticket.client;
            // ticket.issue = req.body.issue ? req.body.issue : ticket.issue;
            ticket.resolution = req.body.resolution ? req.body.resolution : ticket.resolution;
            ticket.comments = req.body.comments ? req.body.comments : ticket.comments;
            ticket.closedBy = req.body.closedBy ? req.body.closedBy : ticket.closedBy;
            ticket.closeDate = req.body.closeDate ? req.body.closeDate : ticket.closeDate;
            ticket.save().then((ticket) => res.json(ticket));
        });
    },
    deleteTicket:(req, res) => {
        Ticket.findByIdAndDelete({ _id: req.params.id }).then(
            res.json({ message: 'deleted' })
        );
    }
}