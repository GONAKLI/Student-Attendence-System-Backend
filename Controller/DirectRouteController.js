exports.DirectAccess = (req,res,next) => {
	
	  if (req.session && req.session.AdminLoggedIn) {
      return res.status(200).json();
    }  else if (req.session && req.session.TeacherloggedIn) {
     return  res.status(200).json();
  } else {
    res.status(403).json({
      message: "Log In First",
    });
  }
};
