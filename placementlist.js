const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://projectdb:project@cluster0.wjsakka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('connected!!');
})
.catch(err=>{console.log('there is a problem connecting!!')});

const placementScheme = new mongoose.Schema({
    name : String,
    year : Number,
    branch : String,
    roll_no : String,
    company : String,
    salary : Number,
    gpa : Number,
    age : Number
});

const Student = mongoose.model('Students',placementScheme);
module.exports = Student;