let Express = require("express");
let AdminRouter = Express.Router();
let multer = require("multer");
let fs = require('fs');

let folderName = "TeacherImages";

if(!fs.existsSync(folderName)){
 fs.mkdirSync(folderName);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "TeacherImages/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let StoreFile = multer({ storage: storage }).single("profilePic");


let AdminController = require("../Controller/AdminController");

AdminRouter.get('/', AdminController.ValidateAdmin);

AdminRouter.get("/dashboard", AdminController.DashBoard);

AdminRouter.post(
  "/add-teacher",
  StoreFile,
  AdminController.AddTeacher,
);

AdminRouter.get("/get-teachers", AdminController.GetTeachers);

AdminRouter.delete("/delete-teacher/:id", AdminController.RemoveTeacher);

AdminRouter.post("/logout", AdminController.LogOut);

AdminRouter.get("/dashboard/view-students", AdminController.GetStudents);

AdminRouter.get("/dashboard/view-student/:id", AdminController.GetOneStudent);

AdminRouter.delete('/delete-student/:id', AdminController.RemoveStudent);

module.exports = AdminRouter;
