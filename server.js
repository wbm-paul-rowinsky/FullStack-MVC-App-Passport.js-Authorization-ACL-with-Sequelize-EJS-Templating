import express from "express";
import { passport } from "./utility/auth.js";
import expressSession from "express-session";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { authRole } from "./utility/aclauth.js";
import { rolesArr } from "./models/user.model.js";
import { htmlHelper } from "./helpers/htmlhelper.js";
import {
  usersController,
  subjectsController,
  gradesController,
  schoolsController,
} from "./controllers/controllers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.urlencoded({ extended: false }));
app.locals.htmlHelper = htmlHelper; // będzie dostępny we wszystkich widokach!
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // sprawdzanie czy uzytkownik jest zalogowany
    return next(); // jesli tak to user moze zobaczyc adres np dashboard
  }
  res.redirect("/"); //niezalogowany, nie moze zobaczyc dashboard, wraca na glowna strone
};

//funkcja sprawdzająca czy zalogowany uzytkownik, jesli tak i chce
//wejsc na login czy register to trafi do dashboard
const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // zwróci true jeśli zautoryzowany user czyli są dane w req.session.passport.user
    return res.redirect("/dashboard");
  }
  next();
};

const viewsPath = path.join(__dirname, "views");
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static("./public"));

// rejestracja usera, checkLoggedIn() sprawdza czy zalogowany to wtedy redirect na dashboard
app.get("/register", checkLoggedIn, async (req, res) => {
  console.log("/register");
  const schools = await schoolsController.getAll();
  res.render("pages/register.ejs", {
    user: req.user,
    schools: schools,
  });
});

app.post(
  "/register",
  passport.authenticate("local-signup", {
    successRedirect: "/login?req=success",
    failureRedirect: "/register?reg=failure",
  })
);

app.get("/login", checkLoggedIn, (req, res) => {
  console.log("/login");
  res.render("pages/login.ejs", {
    user: req.user,
  });
});

app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/dashboard",
    failureRedirect: "/login?log=failure",
  })
);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    console.log("User logged out");
    if (err) return next(err);
    res.redirect("/");
  });
});

app.post("/logout", (req, res) => {
  req.logout(function (err) {
    console.log("User logged out");
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/dashboard", checkAuthenticated, (req, res) => {
  console.log("/dashboard");
  res.render("pages/dashboard.ejs", {
    user: req.user,
  });
});

app.get("/admin/users", authRole, async (req, res) => {
  console.log("/admin/users");
  const users = await usersController.getAll();
  const schools = await schoolsController.getAll();
  res.render("pages/admin/users.ejs", {
    user: req.user,
    users: users,
    schools: schools,
  });
});

app.get("/admin/users/add", authRole, async (req, res) => {
  console.log("/admin/users/add");
  const schools = await schoolsController.getAll();
  res.render("pages/admin/user_add.ejs", {
    user: req.user,
    schools: schools,
    rolesArr: rolesArr,
  });
});

app.post("/admin/users/add", authRole, async (req, res) => {
  console.log("POST => /admin/users/add");
  console.log("req.body: ", req.body);
  const userDb = await usersController.createUser(req.body);
  res.redirect("/admin/users");
});

app.get("/admin/users/edit/:id", authRole, async (req, res) => {
  console.log("/admin/users/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/users");
  const schools = await schoolsController.getAll();

  const userToEdit = await usersController.getById(id);

  res.render("pages/admin/user_edit.ejs", {
    user: req.user, //admin
    userToEdit: userToEdit,
    schools: schools,
    rolesArr: rolesArr,
  });
});

app.post("/admin/users/edit/:id", authRole, async (req, res) => {
  console.log("POST /admin/users/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/users");

  const updatedUser = await usersController.updateById(id, req.body);
  res.redirect("/admin/users");
});

app.get("/admin/users/view/:id", authRole, async (req, res) => {
  console.log("/admin/users/view/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/users");
  const schools = await schoolsController.getAll();

  const userToView = await usersController.getFullDataById(id);

  const grades = await gradesController.getGradesByStudentId(id);

  res.render("pages/admin/user_view.ejs", {
    user: req.user,
    userToView: userToView,
    schools: schools,
    rolesArr: rolesArr,
    grades: grades,
  });
});

//schools
app.get("/admin/schools", authRole, async (req, res) => {
  console.log("/admin/schools");
  const schools = await schoolsController.getAll();
  const directors = await usersController.getAllUsersByRole("director");

  res.render("pages/admin/schools/index.ejs", {
    user: req.user,
    schools: schools,
    directors: directors,
  });
});

app.get("/admin/schools/add", authRole, async (req, res) => {
  console.log("/admin/schools");
  const schools = await schoolsController.getAll();
  const directors = await usersController.getAllUsersByRole("director");

  res.render("pages/admin/schools/school_add.ejs", {
    user: req.user,
    schools: schools,
    directors: directors,
  });
});

app.post("/admin/schools/add", authRole, async (req, res) => {
  console.log("POST /admin/schools");

  const schoolDb = await schoolsController.createSchool(req.body);
  res.redirect("/admin/schools");
});

app.get("/admin/schools/edit/:id", authRole, async (req, res) => {
  console.log("/admin/schools/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");
  const directors = await usersController.getAllUsersByRole("director");
  const schoolToEdit = await schoolsController.getById(id);

  res.render("pages/admin/schools/school_edit.ejs", {
    user: req.user,
    directors: directors,
    schoolToEdit: schoolToEdit,
  });
});

app.post("/admin/schools/edit/:id", authRole, async (req, res) => {
  console.log("POST /admin/schools/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");

  const updatedSchool = await schoolsController.updateById(id, req.body);
  res.redirect("/admin/schools");
});

app.get("/admin/schools/view/:id", authRole, async (req, res) => {
  console.log("/admin/schools/view/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");

  if (req.user.role === "director" && req.user.schoolId != id) {
    res.redirect("/");
  }

  const directors = await usersController.getAllUsersByRole("director");
  const schoolToView = await schoolsController.getFullDataById(id);
  const teachers = await usersController.getAllUsersByRoleAndSchoolId(
    "teacher",
    schoolToView.id
  );

  res.render("pages/admin/schools/school_view.ejs", {
    user: req.user,
    directors: directors,
    schoolToView: schoolToView,
    teachers: teachers,
  });
});

//dodanie przedmiotu do konkretnej szkoły
app.get("/admin/schools/view/:id/addsubject", authRole, async (req, res) => {
  console.log("/admin/schools/view/:id/addsubject");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");
  const school = await schoolsController.getFullDataById(id);
  const teachers = await usersController.getAllUsersByRoleAndSchoolId(
    "teacher",
    school.id
  );

  res.render("pages/admin/schools/school_addsubject.ejs", {
    user: req.user,
    schoolId: id,
    school: school,
    teachers: teachers,
  });
});

app.post("/admin/schools/view/:id/addsubject", authRole, async (req, res) => {
  console.log("POST /admin/schools/view/:id/addsubject");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");
  const subjectDb = await subjectsController.createSubject(req.body);

  res.redirect("/admin/schools/view/" + id);
});

//dodanie nauczyciela do konkretnej szkoły
app.get("/admin/schools/view/:id/addteacher", authRole, async (req, res) => {
  console.log("/admin/schools/view/:id/addteacher");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");
  const school = await schoolsController.getFullDataById(id);

  res.render("pages/admin/schools/school_addteacher.ejs", {
    user: req.user,
    schoolId: id,
    school: school,
  });
});

app.post("/admin/schools/view/:id/addteacher", authRole, async (req, res) => {
  console.log("POST /admin/schools/view/:id/addteacher");
  const { id } = req.params;
  if (!id) return res.redirect("/admin/schools");
  const userDb = await usersController.createUser(req.body);

  res.redirect("/admin/schools/view/" + id);
});

app.get("/admin/schools/myschool", authRole, async (req, res) => {
  if (req.user.role === "director") {
    if (req.user.schoolId) {
      return res.redirect("/admin/schools/view/" + req.user.schoolId);
    }
  }
  res.redirect("/");
});

//subjects
app.get("/subjects", authRole, async (req, res) => {
  console.log("/subjects");
  const subjects = await subjectsController.getAll();
  const schools = await schoolsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");

  res.render("pages/subjects/index.ejs", {
    user: req.user,
    subjects: subjects,
    schools: schools,
    teachers: teachers,
  });
});

app.get("/subjects/add", authRole, async (req, res) => {
  console.log("/subjects/add");
  const schools = await schoolsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");

  res.render("pages/subjects/subject_add.ejs", {
    user: req.user,
    schools: schools,
    teachers: teachers,
  });
});

app.post("/subjects/add", authRole, async (req, res) => {
  console.log("POST /subjects/add");

  const subjectDb = await subjectsController.createSubject(req.body);
  res.redirect("/subjects");
});

app.get("/subjects/edit/:id", authRole, async (req, res) => {
  console.log("/subjects/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/subjects");
  const subjectToEdit = await subjectsController.getById(id);
  const schools = await schoolsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");

  res.render("pages/subjects/subject_edit.ejs", {
    user: req.user,
    subjectToEdit: subjectToEdit,
    schools: schools,
    teachers: teachers,
  });
});

app.post("/subjects/edit/:id", authRole, async (req, res) => {
  console.log("POST /subjects/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/subjects");

  const updatedSubject = await subjectsController.updateById(id, req.body);
  res.redirect("/subjects");
});

app.get("/subjects/view/:id", authRole, async (req, res) => {
  console.log("/subjects/view/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/subjects");
  // const subjectToView = await subjectsController.getById(id);
  const subjectToView = await subjectsController.getFullDataById(id);
  const schools = await schoolsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");

  res.render("pages/subjects/subject_view.ejs", {
    user: req.user,
    subjectToView: subjectToView,
    schools: schools,
    teachers: teachers,
  });
});

//dodanie studenta
app.get("/subjects/view/:id/addstudent", authRole, async (req, res) => {
  console.log("/subjects/view/:id/addstudent");
  const { id } = req.params;
  if (!id) return res.redirect("/subjects");
  const subject = await subjectsController.getById(id);
  const students = await usersController.getAllUsersByRoleAndSchoolId(
    "student",
    subject.schoolId
  );
  const school = await schoolsController.getById(subject.schoolId);
  const teachers = await usersController.getAllUsersByRoleAndSchoolId(
    "teacher",
    subject.schoolId
  );

  res.render("pages/subjects/subject_addstudent.ejs", {
    user: req.user,
    school: school,
    subject: subject,
    students: students,
    teachers: teachers,
  });
});

app.post("/subjects/view/:id/addstudent", authRole, async (req, res) => {
  console.log("POST /subjects/view/:id/addstudent");
  const { id } = req.params;
  if (!id) return res.redirect("/subjects");

  const subject = await subjectsController.getById(req.body.subjectId);
  const student = await usersController.getById(req.body.studentId);
  await subjectsController.addUserToSubject(student, subject);
  res.redirect("/subjects/view/" + id);
});

//dodanie oceny w kontekscie przedmiotu
app.get(
  "/subjects/view/:subjectId/student/:studentId/addgrade",
  authRole,
  async (req, res) => {
    console.log("/subjects/view/:subjectId/student/:studentId/addgrade");
    const { subjectId, studentId } = req.params;
    if (!subjectId || !studentId) return res.redirect("/subjects");
    const subject = await subjectsController.getById(subjectId);
    const school = await schoolsController.getById(subject.schoolId);
    const student = await usersController.getById(studentId);
    const teachers = await usersController.getAllUsersByRoleAndSchoolId(
      "teacher",
      subject.schoolId
    );

    res.render("pages/subjects/subject_addgrade.ejs", {
      user: req.user,
      school: school,
      subject: subject,
      student: student,
      teachers: teachers,
    });
  }
);

app.post(
  "/subjects/view/:subjectId/student/:studentId/addgrade",
  authRole,
  async (req, res) => {
    console.log("POST /subjects/view/:subjectId/student/:studentId/addgrade");
    const { subjectId, studentId } = req.params;
    if (!subjectId || !studentId) return res.redirect("/subjects");
    const subject = await subjectsController.getById(req.body.subjectId);
    const school = await schoolsController.getById(req.body.schoolId);
    const student = await usersController.getById(req.body.studentId);
    const teacher = await usersController.getById(req.body.teacherId);

    const gradeDb = await gradesController.createGrade(
      {
        grade: req.body.grade,
        description: req.body.description,
      },
      student,
      teacher,
      subject,
      school
    );
    res.redirect("/subjects/view/" + subjectId);
  }
);

app.get("/teacher/mysubjects", authRole, async (req, res) => {
  console.log("/teacher/mysubjects");

  if (req.user.role === "teacher") {
    const teacherSubjects = await subjectsController.getTeacherSubjects(
      req.user.id
    );
    console.log("teacherSubjects: ", JSON.stringify(teacherSubjects, null, 4));
    res.render("pages/subjects/teacher_mysubjects.ejs", {
      user: req.user,
      teacherSubjects: teacherSubjects,
    });
  } else {
    res.redirect("/");
  }
});

app.get("/subjects/view/:id/grades", authRole, async (req, res) => {
  console.log("/subjects/view/:id/grades");
  const { id } = req.params;
  if (!id) res.redirect("/teacher/mysubjects");

  const grades = await subjectsController.getSubjectGrades(id);
  const subject = await subjectsController.getById(id);

  res.render("pages/subjects/subject_grades.ejs", {
    user: req.user,
    grades: grades,
    subject: subject,
  });
});

app.get("/student/mysubjects", authRole, async (req, res) => {
  console.log("/student/mysubjects");

  if (req.user.role === "student") {
    const studentSubjects = await subjectsController.getStudentSubjects(
      req.user.id
    );
    console.log("studentSubjects", JSON.stringify(studentSubjects, null, 4));

    res.render("pages/subjects/student_mysubjects.ejs", {
      user: req.user,
      studentSubjects: studentSubjects,
    });
  } else {
    res.redirect("/");
  }
});

// /grades

app.get("/grades", authRole, async (req, res) => {
  console.log("/grades");
  const grades = await gradesController.getAllFullData();
  console.log("gradesFull: ", JSON.stringify(grades, null, 4));

  res.render("pages/grades/index.ejs", {
    user: req.user,
    grades: grades,
  });
});

app.get("/grades/add", authRole, async (req, res) => {
  console.log("/grades/add");
  const schools = await schoolsController.getAll();
  const subjects = await subjectsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");
  const students = await usersController.getAllUsersByRole("student");

  res.render("pages/grades/grade_add.ejs", {
    user: req.user,
    subjects: subjects,
    schools: schools,
    teachers: teachers,
    students: students,
  });
});

app.post("/grades/add", authRole, async (req, res) => {
  console.log("POST /grades/add");

  const gradeDb = await gradesController.createGrade(req.body);
  res.redirect("/grades");
});

app.get("/grades/edit/:id", authRole, async (req, res) => {
  console.log("/grades/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/grades");

  const gradeToEdit = await gradesController.getById(id);
  const schools = await schoolsController.getAll();
  const subjects = await subjectsController.getAll();
  const teachers = await usersController.getAllUsersByRole("teacher");
  const students = await usersController.getAllUsersByRole("student");

  res.render("pages/grades/grade_edit.ejs", {
    user: req.user,
    gradeToEdit: gradeToEdit,
    subjects: subjects,
    schools: schools,
    teachers: teachers,
    students: students,
  });
});

app.post("/grades/edit/:id", authRole, async (req, res) => {
  console.log("POST /grades/edit/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/grades");

  const updateGradeDb = await gradesController.updateById(id, req.body);
  res.redirect("/grades");
});

app.get("/grades/view/:id", authRole, async (req, res) => {
  console.log("/grades/view/:id");
  const { id } = req.params;
  if (!id) return res.redirect("/grades");

  const gradeToView = await gradesController.getAllFullDataById(id);
  console.log("gradesToView: ", JSON.stringify(gradeToView, null, 4));
  res.render("pages/grades/grade_view.ejs", {
    user: req.user,
    gradeToView: gradeToView,
  });
});

app.get("/", (req, res) => {
  res.render("pages/index.ejs", {
    user: req.user,
  });
});

app.listen(3010, () => {
  console.log("Server started at port 3010");
});
