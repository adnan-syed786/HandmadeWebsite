const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // reference to User model
    required: true,
  },
    title:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true,
    },
  tag: {
    type: String,
      default:"general"
    },
    date: {
      type: Date, 
      default: Date.now
    },
  })

  module.exports=mongoose.model('Note',NotesSchema)