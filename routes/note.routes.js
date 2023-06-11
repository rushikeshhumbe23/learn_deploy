const express = require("express");
const { auth } = require("../middleware/auth.middleware");

const { NoteModel } = require("../model/note.model");
const noteRouter = express.Router();

noteRouter.use(auth);

noteRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ userID: req.body.userID });
    res.json({ mas: "All notes Avl", notes });
  } catch (error) {
    res.json({ err: error.message });
  }
});
noteRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ mas: "New note has been added", note: req.body });
  } catch (error) {
    res.json({ err: error.message });
  }
});

noteRouter.patch("/update/:noteID", async (req, res) => {
  // userID in the user DOC === userID in the notes DOC
  const userIDinUserDoc = req.body.userID;
  const { noteID } = req.params;

  try {
    const note = await NoteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;
    console.log("note", note);
    if (userIDinUserDoc == userIDinNoteDoc) {
      // console.log("userID in userDoc", userIDinUserDoc);
      console.log("userID in userDoc", userIDinUserDoc, note.userID);
      await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body);
      res.json({ msg: `${note.title} has been updated` });
    } else {
      res.json({ msg: "Not Authorised" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

noteRouter.delete("/delete/:noteID", async (req, res) => {
  const userIDinUserDoc = req.body.userID;
  const { noteID } = req.params;

  try {
    const note = await NoteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;
    if (userIDinUserDoc === userIDinNoteDoc) {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.json({ msg: `${note.title} has been deleted` });
    } else {
      res.json({ msg: "Not Authorised" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  noteRouter,
};
