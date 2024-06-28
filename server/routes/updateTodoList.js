const router = require('express').Router();
const TodoModel = require("../models/todoList");

// Update task fields (including deadline)
router.post("/:id", async(req, res) => {
    const id = req.params.id;
    const updateData = {
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline, 
    };
    TodoModel.findByIdAndUpdate(id, updateData)
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

module.exports = router;