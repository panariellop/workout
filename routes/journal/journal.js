const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken');
const JournalEntry = require('../../models/JournalEntry');
//ROUTE /api/journal
//DESC All CRUD functionality for user's journal logs
//ACCESS protected by auth

//DESC get all of a user's entries
router.post("/entries", authenticateToken, async (req, res)=> {
		const { num_entries } = req.body; 
    var entries = await JournalEntry.find({user: req.user.username}, null ,{sort: {date: -1}});
		//Allows for user to specify if they want the server to return all of the entries
		if (num_entries !== "all" || num_entries !== undefined){
			var entries = entries.slice(0,num_entries);
		}
		//Only return how many entries the request defines 
    return res.status(200).json(entries);
});

//DESC get a specific entry
router.get("/:id", authenticateToken, async(req,res)=> {
    const {id} = req.params
    if(id === "new"){
        return res.sendStatus(201)
    }
    await JournalEntry.findById(id, (err, result)=> {
        if(err) return res.sendStatus(404)
        if (result) return res.status(200).json(result)
    }).catch(e => console.log(e))
})

//DESC create a new entry
router.post("/", authenticateToken, async(req,res)=> {
    const { date, exercise, location, sets} = req.body
    const newEntry = new JournalEntry({ date, exercise, location, user: req.user.username, sets })
    newEntry.save()
    return res.status(200).json(newEntry);
})

//DESC update an entry
router.put('/:id', authenticateToken, async (req, res)=> {
    const { date, location, exercise, sets } = req.body;
    //Make sure the user is authorized to edit this entry
    await JournalEntry.findById(req.params.id, (err, result)=> {
        if(err) return res.sendStatus(500)
        if(result.user !== req.user.username) return res.sendStatus(401)
        result.updateOne({ date, location, exercise, sets }, (err, raw)=> {
            if(err) return res.sendStatus(500)
            return res.status(200).json({msg: "Entry updated"})
        })
    })
})

//DESC Delete an item 
router.delete('/:id', authenticateToken, async(req, res)=> {
    await JournalEntry.findById(req.params.id, (err, result)=> {
        if (err) return res.sendStatus(500)
        if(result.user !== req.user.username) return res.sendStatus(401)
        result.remove()
        return res.status(200).json({msg: "Entry deleted"})
    })
})

module.exports = router;
