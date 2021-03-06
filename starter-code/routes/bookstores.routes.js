const express = require('express');
const router = express.Router();

// const multer = require('multer');
// const upload = multer({ dest: 'documents/' });

const bookstoresController = require('../controllers/bookstores.controller');

router.get('/', bookstoresController.show);
router.get('/new', bookstoresController.new);

router.post('/new', bookstoresController.create);
router.post('/delete/:id', bookstoresController.delete);


module.exports = router;