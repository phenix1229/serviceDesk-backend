const mongoose = require('mongoose');
const today = () =>{
  return `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()} (${new Date().getHours()}:${new Date().getMinutes()})`;
};

const TicketSchema = new mongoose.Schema({
  openedBy:{type:String},
  openDate:{type:String, default:today},
  client:{type:String},
  issue:{type:String},
  comments:{type:Array, default:[]},
  resolution:{type:String},
  open:{type:Boolean, default:true},
  closedBy:{type:String},
  closeDate:{type:String}
});

module.exports = mongoose.model('Ticket', TicketSchema);
