const router = require('express').Router();
const TodoModel = require("../models/todoList");

// Get saved tasks from the database
router.get("/", async(req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => res.json(err));
});

module.exports = router;