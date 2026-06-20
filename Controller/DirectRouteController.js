exports.DirectAccess = (req,res,next) => {
	
	  if (req.session && req.session.AdminLoggedIn) {
      return res.status(200).json({
        message:"Successfull"
      });
    }  else if (req.session && req.session.TeacherloggedIn) {
     return  res.status(200).json({
      message:"Successfull"
     });
  } else {
    res.status(403).json({
      message: "Log In First",
    });
  }
};
