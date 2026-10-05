const express = require("express");
const router = express.Router();
const fetchuser = require("../Middleware/fetchuser");
const Note = require("../Models/Note");
const { body, validationResult } = require("express-validator");

//Route 1: get all user  notes using get "/api/notes/fetchnotes" .login required
//pass middlware

router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//Route 2: Add a new notes using post "/api/notes/addnotes" .login required
//pass middlware
router.post("/addnotes",fetchuser,
  [
    //use express validator
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //destucturing
    try {
      const { title, description, tag } = req.body;
      // find the validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      })
      const savedNote = await note.save();
      res.json(savedNote);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Update an existing note using put
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  // Create an object with only updated fields
  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
    // Find the note to update
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow update only if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // Update note with only the new fields
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true } // returns the updated note
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 4: Delete an existing note using delete "/api/notes/deletenotes".login required

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to delete and deleted it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow deletion if user has owns this notes
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // delete note with only the new fields
    note = await Note.findByIdAndDelete(
    req.params.id)
       res.json({ success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;