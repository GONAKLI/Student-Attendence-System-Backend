let {admin} = require('../Schema/admin');
let Teacher = require('../Schema/add_teacher');
let bcrypt = require("bcryptjs");
let multer = require("multer");
const Student = require('../Schema/Add_New_Student');


exports.ValidateAdmin = (req, res, next) => {
  if (req.session && req.session.AdminLoggedIn) {
   return res.status(200).json();
  } else {
    return res.status(401).json({
        reason : "unauthorized",
    });
  }
};

exports.DashBoard = (req, res) => {
    res.status(200).json({
      name : req.session.AdminName,
    });
};

exports.SignUp = async (req, res) => {
  let { name, email, mobile, password, gender } = req.body;
  let hashed = await bcrypt.hash(password, 1);
  email = email.toLowerCase();
  let admin_data = new admin({
    name,
    email,
    mobile,
    password: hashed,
    gender,
  });
  admin_data.save().then(() => {
    res.status(200).json({
      request: "fullfilled",
    });
  });
};

exports.SignIn = async (req, res) => {
  let user;
  if (isNaN(req.body.email)) {
    user = await admin.findOne({
      email: req.body.email.toLowerCase(),
    });
  } else {
    user = await admin.findOne({
      mobile: Number(req.body.email),
    });
  }

  if (user) {
    let checker = await bcrypt.compare(req.body.password, user.password);

    if (checker) {
      req.session.AdminName = user.name.toString();
      req.session.AdminId = user._id.toString();
      req.session.AdminEmail = user.email.toString();
      req.session.AdminLoggedIn = true;

      res.json({
        reason: "user found",
        userid: user._id,
      });
    } else {
      res.json({
        email: user.email,
        reason: "incorrect password",
      });
    }
  } else {
    res.status(404).json({
      status: 404,
      reason: "user not found",
    });
  }
};

exports.LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        reason: `logout failed, ${err}`,
      });
    } else {
      res.clearCookie("connect.sid");
      res.status(200).json({
        reason: "sucessfully logout",
      });
    }
  });
};

exports.AddTeacher = (req, res) => {


  let {
    name,
    address,
    email,
    dob,
    mobile,
    qualification,
    gender,
    department,
  } = req.body;
  let profilePic = req.file.path;
  email = email.toLowerCase();
  mobile = Number(mobile);
  let year = new Date(dob).getFullYear();
  let password = `${mobile}@${year}`;
  let AdminId = req.session.AdminId;
  let AdminEmail = req.session.AdminEmail;
  let AdminName = req.session.AdminName;
  let teacher_data = new Teacher({
    name,
    address,
    password,
    department,
    email,
    dob,
    mobile,
    qualification,
    profilePic,
    AdminId,
    AdminEmail,
    AdminName,
    gender,
  });
  teacher_data
    .save()
    .then(() => {
      res.status(200).json({
        response: "teacher added sucessfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        response: "unable to add teacher",
      });
    });

// });

  
};

exports.GetTeachers = (req, res) => {
  Teacher.find({
    AdminId: req.session.AdminId,
    AdminEmail: req.session.AdminEmail,
  }).then((teacher) => {
    res.status(200).json(teacher);
  });
};

exports.RemoveTeacher = (req, res) => {
  Teacher.findByIdAndDelete(req.params.id).then(() => {
    Teacher.find().then((teacher) => {
      res.json(teacher);
    });
  });
};


exports.GetStudents = async (req, res) => {
  try {
    let Students = await Student.find({ AdminId: req.session.AdminId });

    if (!Students || Students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    let Details = Students.map((stu) => ({
      studentId : stu._id.toString(),
      name: stu.name,
      StudentImage: stu.StudentImage,
      gender: stu.gender,
      fatherName: stu.fatherName,
      motherName: stu.motherName,
      email: stu.email,
      mobileNumber: stu.mobileNumber,
      parentContact: stu.parentContact,
      rollNumber: stu.rollNumber,
      department: stu.department,
    }));

    return res.status(200).json({ students: Details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.GetOneStudent = async (req,res) =>{
  let id = req.params.id;
  let Data = await Student.findById(id);
  let StudentInfo = {name : Data.name,
  gender : Data.gender,
  StudentImage : Data.StudentImage,
  fatherName : Data.fatherName,
  motherName : Data.motherName,
  email : Data.email,
  mobileNumber : Data.mobileNumber,
  parentContact : Data.parentContact,
  rollNumber : Data.rollNumber,
  department : Data.department,
  }

 return res.status(200).json(StudentInfo);

}

exports.RemoveStudent = async (req,res) => {
  let id = req.params.id;
  
 await Student.findByIdAndDelete(id);
  try {
    let Students = await Student.find({ AdminId: req.session.AdminId });

    if (!Students || Students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    let Details = Students.map((stu) => ({
      studentId: stu._id.toString(),
      name: stu.name,
      StudentImage: stu.StudentImage,
      gender: stu.gender,
      fatherName: stu.fatherName,
      motherName: stu.motherName,
      email: stu.email,
      mobileNumber: stu.mobileNumber,
      parentContact: stu.parentContact,
      rollNumber: stu.rollNumber,
      department: stu.department,
    }));

    return res.status(200).json({ students: Details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}