const router = require('express').Router();
const TodoModel = require("../models/todoList");

// Delete task from the database
router.delete("/:id", async(req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete({ _id: id })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

module.exports = router;