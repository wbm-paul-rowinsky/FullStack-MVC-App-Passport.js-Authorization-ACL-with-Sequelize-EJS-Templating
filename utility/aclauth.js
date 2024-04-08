import { permissions } from "./permissions.js";

function getGuestDefault() {
  return {
    role: "user",
  };
}

function authRole(req, res, next) {
  // return next(); // tylko na potrzeby DEVELOPMENTU!!!, wszystkie zasoby bez logowania
  /*
    dane, które otrzymamy z passport: (!!!)

    req.passport.session: { user: "r2323ef23e2v3ge2"} lub undefined
    req.user: {
        _id: w223e23edd2323d23e,
        password: "23d23d23d23d23d23d23d2",
        email: "ola@example.com",
        role: "user",
        created: "2024-02-29"
    }
*/
  console.log("authRole() - middleware");
  const resource = req.route.path;
  const method = req.method.toLowerCase();
  console.log("resource: ", resource, " method: ", method);

  if (!req.user) {
    //jeśli jest niezalogowany to passport nie wstawił danych usera i nie ma role, wiec tworzymy guest
    req.user = getGuestDefault();
    //return res.redirect("/?msg=forbidden-access")   opcjonalnie przekierowanie z wiadomiscia
  }

  console.log("req.user", req.user);

  if (permissions.isResourceAllowedForUser(req.user.role, resource, method)) {
    // ma dostęp
    return next();
  } else {
    //brak dostępu
    res.status(401);
    return res.send("Access forbidden");
  }

  return next();
}

export { authRole };
