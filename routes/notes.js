const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const { findByIdAndUpdate, findById } = require('../models/Notes');

//ROUTE 1: GET all notes using: GET "api/notes/getallnotes"
router.get('/getallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
            res.json(notes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
     }
    });


//ROUTE 2: Add all notes using: POST "api/notes/addnote"
router.post('/addnote',fetchuser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast of 5 characters').isLength({ min: 5 }),]
    , async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {title, description, tag} = req.body;
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();
            return res.json(saveNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error")
         }
    
    })

//ROUTE 3: Update an existing note using: PUT "api/notes/updatenote/:id. Login required"
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const {title, description, tag} = req.body;
    //Creating an updated note
    const newNote ={}
    try {
        if(title)
    {newNote.title = title}
    if(description)
    {newNote.description = description}
    if(tag)
    {newNote.tag = tag}

    //Find note to be updated and update it
    console.log(req.params.id);
    let note = await Note.findById(req.params.id);
    if(!note)
    return res.status(404).send("Not found");
    if(note.user.toString() !== req.user.id)
    return res.status(401).send("Not Allowed");

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true});
    res.json({updatedNote});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
     }
    
}
)


//ROUTE 4: Delete an existing note using: DELETE "api/notes/deletenote. Login required"
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{

    try {
         //Find note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if(!note)
    return res.status(404).send("Not found");

    //Allow deletion only if the user owns this note
    if(note.user.toString() !== req.user.id)
    return res.status(401).send("Not Allowed");

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"secess":"The note has been deleted successfully", note:note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
     }
   
}
)
 module.exports = router;