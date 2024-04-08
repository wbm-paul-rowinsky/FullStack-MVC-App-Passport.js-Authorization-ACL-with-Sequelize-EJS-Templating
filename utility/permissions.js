const usersRoles = [
  {
    role: "admin",
    priority: 5,
    allows: [
      {
        resource: "/admin/schools",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/schools/add",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/schools/edit/:id",
        permissions: "*", // all methods ex. post, get
      },
    ],
  },
  {
    role: "director",
    priority: 4,
    allows: [
      {
        resource: "/admin/schools/view/:id",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/schools/myschool",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/schools/add",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/schools/edit/:id",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/users",
        permissions: "*", // all methods ex. post, get
      },
      {
        resource: "/admin/users/add",
        permissions: "*",
      },
      {
        resource: "/admin/users/edit",
        permissions: "*",
      },
      {
        resource: "/admin/users/edit/:id",
        permissions: "*",
      },
      {
        resource: "/admin/users/view/:id",
        permissions: "*",
      },
      {
        resource: "/subjects/add",
        permissions: "*",
      },
      {
        resource: "/subjects/edit/:id",
        permissions: "*",
      },
    ],
  },
  {
    role: "teacher",
    priority: 3,
    allows: [
      {
        resource: "/teacher/mysubjects",
        permissions: "*",
      },
      {
        resource: "/subjects/view/:id/grades",
        permissions: "*",
      },
      {
        resource: "/subjects",
        permissions: "*",
      },
      {
        resource: "/subjects/view/:id",
        permissions: "*",
      },
      {
        resource: "/subjects/view/:id/addstudent",
        permissions: "*",
      },
      {
        resource: "/subjects/view/:subjectid/student/:studentid/addgrade",
        permissions: "*",
      },
      {
        resource: "/grades",
        permissions: "*",
      },
      {
        resource: "/grades/add",
        permissions: "*",
      },
      {
        resource: "/grades/view/:id",
        permissions: "*",
      },
      {
        resource: "/grades/edit/:id",
        permissions: "*",
      },
    ],
  },
  {
    role: "student",
    priority: 2,
    allows: [
      {
        resource: "/dashboard",
        permissions: ["post", "get"],
      },
      {
        resource: "/student/mysubjects",
        permissions: ["post", "get"],
      },
    ],
  },
  {
    role: "gest",
    priority: 1,
    allows: [],
  },
];

const permissions = {
  usersRoles: usersRoles,
  addRoleParents: function (targetRole, sourceRole) {
    const targetData = this.usersRoles.find((v) => v.role === targetRole); // np obiekt z rola admin
    const sourceData = this.usersRoles.find((v) => v.role === sourceRole); // np obiekt z rola user

    targetData.allows = targetData.allows.concat(sourceData.allows);
  },
  isResourceAllowedForUser: function (userRole, resource, method) {
    const roleData = this.usersRoles.find((v) => v.role === userRole);

    if (!roleData) return false; // brak dostepu bo nie ma takiej roli obsługwanej na serwerze
    const resourceData = roleData.allows.find((v) => v.resource === resource);
    if (!resourceData) return false; // osoba o tej roli nie ma info o tym adresie wiec nie ma dostepu
    if (!resourceData.permissions) return false; // nie ma dostepu bo nie ma opisanych dozowlonych metod

    if (!Array.isArray(resourceData.permissions)) {
      // gdy nie jest tablicą
      if (resourceData.permissions === "*") return true; // ma dostep do wszystkich metod
      if (resourceData.permissions === method) return true; // ma dostep do konkretnej metody
    } else {
      //gdy jest tablica
      if (resourceData.permissions.find((v) => v === "*")) return true; // ma dostep
      if (resourceData.permissions.find((v) => v === method)) return true; // ma dostep
    }
    return false;
  },
  getPriorityByRole: function (role) {
    const user = this.usersRoles.find((v) => v.role === role);
    if (user) return user.priority;
    return -1;
  },
};

permissions.addRoleParents("teacher", "student"); //teacher ma role usera
permissions.addRoleParents("director", "teacher"); //director ma role teacher
permissions.addRoleParents("admin", "director"); //admin ma role dorectora - czyli wszystkie
// console.log(
//   "===== PERMISIONS: ======",
//   JSON.stringify(permissions.usersRoles, null, 4)
// );
// console.log(permissions.isResourceAllowedForUser("admin", "/dashboard", "get"));
// console.log(
//   permissions.isResourceAllowedForUser("admin", "/dashboard", "delete")
// );
// console.log(permissions.isResourceAllowedForUser("admin", "/api/users", "get"));
export { permissions };
