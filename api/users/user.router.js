const { createUser, getUsers, getUserById } = require('./user.controller');
const router = require('express').Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

module.exports = router;