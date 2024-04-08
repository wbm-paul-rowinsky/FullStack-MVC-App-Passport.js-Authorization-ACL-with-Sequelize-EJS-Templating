import { UsersController } from "./UsersController.js";
import { SchoolsController } from "./SchoolsController.js";
import { GradesController } from "./GradesController.js";
import { SubjectsController } from "./SubjectsController.js";

import { User, School, Subject, Grade } from "../models/schemas.js";

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const gradesController = new GradesController();
const subjectsController = new SubjectsController();

const adminDb = await usersController.createUser({
  name: "Admin",
  surname: "Admin",
  password: "test",
  email: "admin@example.com",
  role: "admin",
});

const schoolDb = await schoolsController.createSchool({
  name: "University #0001",
  address: "Wilcza 7, 00-001 Warszawa",
});

const schoolDb2 = await schoolsController.createSchool({
  name: "University #0002",
  address: "Pl. Marii Curie Skłodowskiej 51, 20-001 Lublin",
});

const schoolDb3 = await schoolsController.createSchool({
  name: "University #0003",
  address: "Puławska 17, 24-001 Radom",
});
console.log("schoolDb: ", schoolDb.dataValues);
console.log("schoolDb2: ", schoolDb2.dataValues);
console.log("schoolDb3: ", schoolDb3.dataValues);

const directorDb = await usersController.createUser(
  {
    name: "Adam",
    surname: "Adamski",
    email: "director1" + "@example.com",
    password: "test",
    role: "director",
  },
  schoolDb
);
await schoolsController.setDirector(schoolDb, directorDb);

const directorDb2 = await usersController.createUser(
  {
    name: "Barbara",
    surname: "Łapska",
    email: "director2" + "@example.com",
    password: "test",
    role: "director",
  },
  schoolDb2
);

const directorDb3 = await usersController.createUser(
  {
    name: "Grzegorz",
    surname: "Brzeczyszczywkiewicz",
    email: "director3" + "@example.com",
    password: "test",
    role: "director",
  },
  schoolDb3
);

await schoolsController.setDirector(schoolDb2, directorDb2);
//await usersController.setSchool(directorDb, schoolDb);
console.log("directorDb: ", directorDb.dataValues);

const directorWithSchoolFromDb = await User.findOne({
  where: { id: directorDb.id },
  include: [
    {
      model: School,
    },
  ],
});

console.log(
  "Director with School: ",
  JSON.stringify(directorWithSchoolFromDb, null, 4)
);

const teacherDb = await usersController.createUser(
  {
    name: "Alina",
    surname: "Kowalska",
    email: "alina@example.com",
    password: "test",
    role: "teacher",
  },
  schoolDb
);
console.log("teacher: ", teacherDb.dataValues);

const teacherDb2 = await usersController.createUser(
  {
    name: "Elbieta",
    surname: "Stefańska",
    email: "elastefa@example.com",
    password: "test",
    role: "teacher",
  },
  schoolDb
);

const teacherDb3 = await usersController.createUser(
  {
    name: "Elbieta",
    surname: "Małecka",
    email: "malek@example.com",
    password: "test",
    role: "teacher",
  },
  schoolDb2,
  schoolDb
);

const student1 = await usersController.createUser({
  name: "Kasia",
  surname: "Kasińska",
  email: "student1@example.com",
  password: "test",
  role: "student",
});
console.log("Student #1: ", student1.dataValues);

const student2 = await usersController.createUser({
  name: "Janusz",
  surname: "Wodnik",
  email: "jwodnik@example.com",
  password: "test",
  role: "student",
});
console.log("Student #2: ", student2.dataValues);

const student3 = await usersController.createUser(
  {
    name: "Karol",
    surname: "Karolski",
    email: "kar@example.com",
    password: "test",
    role: "student",
  },
  schoolDb
);

const student4 = await usersController.createUser(
  {
    name: "Władek",
    surname: "Włodzio",
    email: "wladek@example.com",
    password: "test",
    role: "student",
  },
  schoolDb
);

const subject1 = await subjectsController.createSubject(
  {
    name: "Math",
  },
  teacherDb,
  schoolDb
);

await subjectsController.addUserToSubject(student1, subject1);
await subjectsController.addUserToSubject(student2, subject1);

const subject2 = await subjectsController.createSubject(
  {
    name: "Eng",
  },
  teacherDb,
  schoolDb
);
await subjectsController.addUserToSubject(student2, subject2);
await subjectsController.addUserToSubject(student3, subject2);

const subject3 = await subjectsController.createSubject(
  {
    name: "Programming",
  },
  teacherDb2,
  schoolDb
);
await subjectsController.addUserToSubject(student4, subject3);
await subjectsController.addUserToSubject(student2, subject3);
await subjectsController.addUserToSubject(student3, subject3);

const grade1 = await gradesController.createGrade(
  {
    grade: 5.0,
    description: "great work!",
  },
  student1,
  teacherDb,
  subject1,
  schoolDb
);

const grade2 = await gradesController.createGrade(
  {
    grade: 4.5,
    description: "just okay!",
  },
  student2,
  teacherDb,
  subject1,
  schoolDb
);

const grade3 = await gradesController.createGrade(
  {
    grade: 4.0,
    description: "OK!",
  },
  student2,
  teacherDb,
  subject1,
  schoolDb
);

const grade4 = await gradesController.createGrade(
  {
    grade: 5.0,
    description: "very OK!",
  },
  student3,
  teacherDb2,
  subject3,
  schoolDb
);

const grade5 = await gradesController.createGrade(
  {
    grade: 5.5,
    description: "amazing!",
  },
  student3,
  teacherDb,
  subject3,
  schoolDb
);

const grade6 = await gradesController.createGrade(
  {
    grade: 3.5,
    description: "poor!",
  },
  student4,
  teacherDb,
  subject3,
  schoolDb
);

const grade7 = await gradesController.createGrade(
  {
    grade: 4.5,
    description: "okay!",
  },
  student4,
  teacherDb,
  subject3,
  schoolDb
);

const schoolAllData = await School.findOne({
  where: { id: schoolDb.id },
  include: [
    { model: User, as: "director" },
    { model: User },
    {
      model: Subject,
      include: [
        {
          model: User,
          include: [
            { model: Grade, include: [{ model: User, as: "teacher" }] },
          ],
        },
        {
          model: User,
          as: "teacher",
        },
      ],
    },
  ],
});

console.log("School all data: ", JSON.stringify(schoolAllData, null, 4));

export {
  schoolsController,
  usersController,
  gradesController,
  subjectsController,
};
