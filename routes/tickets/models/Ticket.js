const mongoose = require('mongoose');
const today = () =>{
    return `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`;
};

const TicketSchema = new mongoose.Schema({
    openedBy:{type:String},
    openDate:{default:today},
    client:{type:String},
    issue:{type:string},
    resolution:{type:String},
    closedBy:{type:String},
    closeDate:{type:String}
});

module.exports = mongoose.model('Ticket', TicketSchema);
