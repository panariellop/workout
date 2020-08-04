const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken');
const JournalEntry = require('../../models/JournalEntry');
//ROUTE /api/journal
//DESC All CRUD functionality for user's journal logs
//ACCESS protected by auth

//DESC get all of a user's entries
router.get("/", authenticateToken, async (req, res)=> {
    const entries = await JournalEntry.find({user: req.user.username}, null ,{sort: {date: -1}});
    return res.status(200).json(entries);
});

//DESC create a new entry
router.post("/", authenticateToken, async(req,res)=> {
    const { date, exercise, location, sets} = req.body
    const newEntry = new JournalEntry({ date, exercise, location, user: req.user.username, sets })
    newEntry.save()
    return res.status(200).json({msg: "Entry added"});
})

//DESC update an entry
router.put('/:id', authenticateToken, async (req, res)=> {
    const { date, exercise, sets } = req.body;
    //Make sure the user is authorized to edit this entry
    await JournalEntry.findById(req.params.id, (err, result)=> {
        if(err) return res.sendStatus(500)
        if(result.user !== req.user.username) return res.sendStatus(401)
        result.updateOne({ date, exercise, sets }, (err, raw)=> {
            if(err) return res.sendStatus(500)
            return res.status(200).json({msg: "Entry updated"})
        })
    })
})

router.delete('/:id', authenticateToken, async(req, res)=> {
    await JournalEntry.findById(req.params.id, (err, result)=> {
        if (err) return res.sendStatus(500)
        if(result.user !== req.user.username) return res.sendStatus(401)
        result.remove()
        return res.status(200).json({msg: "Entry deleted"})
    })
})

module.exports = router;
