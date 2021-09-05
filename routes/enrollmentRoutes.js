const express = require('express');
const router = express.Router();

// HomePage Route
router.get('/', (req, res) => {
    res.render('index');
});
// Create Admin Page Route
router.get('/create',(req, res) => {
    res.render('create');
});
// Admin Login Page Route
router.get('/login', (req, res) => {
    res.render('login');
})
// Add Student Page Route
router.get('/addStudent',(req, res) => {
    res.render('addStudent');
})

module.exports = router;