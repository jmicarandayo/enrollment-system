const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/auth')

router.post('/create', enrollmentController.create);
router.post('/login', enrollmentController.login);
router.get('/updateForm/:student_id', enrollmentController.updateForm);
router.post('/updateStudent/:student_id', enrollmentController.updateStudent);
router.get('/deleteStudent/:student_id', enrollmentController.deleteStudent);
router.get('/listStudent', enrollmentController.listStudent);
router.post('/addStudent', enrollmentController.addStudent);


module.exports = router;