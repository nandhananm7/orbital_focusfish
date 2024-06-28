const router = require('express').Router();
const TodoModel = require("../models/todoList");

// Add new task to the database
router.post("/", async(req, res) => {
    TodoModel.create({
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline, 
    })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

module.exports = router;