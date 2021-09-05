const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect(function(err) {
    if(err) {
        console.error(err)
        return;
    } else {
        console.log('MySQL Connected')
    }
})

// Create Admin export
exports.create = (req, res) => {
    const {firstname, lastname, email, password, confirmPassword} = req.body;
    db.query(`select email from admin where email = ?`, [email], async(err, results) => {
        if(err) {
            console.log(err);
        }
        else if(!email){
            return res.render('create', {message: "Please enter Email!", email:email});
        }
        else if(results.length > 0) {
            return res.render('create', {message: "Email entered is already in use!"});
        }
        else if(!password) {
            return res.render('create', {message: "Please enter a password!", email:email, password:password});
        }
        else if(password !== confirmPassword) {
            return res.render('create', {message: "Password entered do not match!", email:email, password:password, confirmPassword:confirmPassword});
        }
        //Encrypt Password
        let encpass = await bcrypt.hash(password, 8);
        console.log(encpass);

        db.query(`insert into admin set ?`, {firstname:firstname, lastname:lastname, email:email, password:encpass}, (err,results) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(results);
                return res.render('create', {message: 'Admin Account Created!'});
            }
        })
    });  
}
// Admin Login 
exports.login = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).render('login',{message: 'Please provide email and password!',email:email});
    db.query(`select * from admin where email = ?`, [email], async (err, results) => {
        if(!results || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).render('login', {message: 'Email or Password is incorrect!', email:email, password:password});
        }
        else {
            const id = results[0].admin_id;
            const adminName = results[0].firstname;
            const token = jwt.sign({id},process.env.JWT_SECRET, {expiresIn:process.env.JWTEXPIRESIN})
            console.log(token);
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.COOKIEEXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            };
            res.cookie('jwt', token, cookieOptions);
            db.query(`select * from students`, (err, results) => {
                if(err) throw err;
                res.render('list', {title:'List of Students', user:results, adminName:adminName});
            })
        }
    })
}
// Update Form
exports.updateForm = (req, res) => {
    const id = req.params.student_id;
    db.query(`select * from students where student_id =?`,[id], (err, results) => {
        if(err) throw err;
        res.render('updateForm', {title: 'Edit Student', user:results[0]});
    });
}
// Update Student
exports.updateStudent = (req, res) => {
    const {firstname, lastname} = req.body;
    const id = req.params.student_id;
    db.query(`update students set first_name ='${firstname}', last_name = '${lastname}' where student_id ='${id}'`, (err, results) => {
        if(err) throw err;
        db.query(`select * from students where student_id = '${id}'`, (err, results) => {
            if(err) throw err;
            console.log(`update: ${results}`)
            res.render('updateForm', {title: 'Edit Student', user: results[0]});
        });
    })
}

//Display Student List
exports.listStudent = (req,res) => {
    db.query(`select * from students`, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.render('list', {title:'List of Students', user:results});
    });
}
// Add Student
exports.addStudent = (req, res) => {
    const {firstname, lastname, student_id, year_id} = req.body;
    db.query(`insert into students set ?`, {first_name:firstname, last_name:lastname, student_id:student_id, year_id:year_id},(err,results) => {
        if(err) throw err;
        db.query(`select * from students`, (err, results) => {
            if(err) throw err;
            res.render('list', {title:'List of Students', user:results});
        });
    });
}

//Delete Student
exports.deleteStudent = (req, res) => {
    const id = req.params.student_id;
    db.query(`delete from payment where student_id =?`,[id], (err, results) => {
        if(err) throw err;
        db.query(`delete from students where student_id = ?`,[id],(err, results) => {
            if(err) throw err;
            db.query(`select * from students`, (err, results) => {
                if(err) throw err;
                res.render('list', {title:'List of Students', user:results});
            });
        });  
    })
}
