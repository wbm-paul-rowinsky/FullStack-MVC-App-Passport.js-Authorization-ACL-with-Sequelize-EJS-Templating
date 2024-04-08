import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";

import { usersController } from "../controllers/controllers.js";

passport.serializeUser((user, done) => {
  console.log("serializeUser(), user.id: ", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userDb = await usersController.getById(id);
    console.log("deserializeUSer(), userDb: ", userDb);
    done(null, userDb);
  } catch (error) {
    done(error);
  }
});

//rejestracja uytkownika na stronie - register(!)
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userExists = await usersController.getUserByEmail(email);
        if (userExists) {
          // jest juz user w bazie
          return done(null, false); // konczymy bo user istnieje
        }
        const userDb = await usersController.createUser({
          name: req.body.name,
          surname: req.body.surname,
          email: email,
          password: password,
          address: req.body.address,
          age: req.body.age,
          schoolId: req.body.schoolId,
        });
        console.log(userDb);
        return done(null, userDb); //user jest zarejestrowany
      } catch (error) {
        done(error);
      }
    }
  )
);

const authUser = async (req, email, password, done) => {
  //authuser to funkcja pozwalająca na autoryzację uzytkownika, zwraca zautoryzowanego
  //uzytkownika np z bazy, authUser uzywana jest przez strategię do autoryzacji
  try {
    const authenticatedUser = await usersController.getUserByEmail(email);
    if (!authenticatedUser) {
      // nie ma usera w bazie o tym imieniu
      return done(null, false);
    }

    if (!usersController.validPassword(password, authenticatedUser)) {
      // złe hasło
      return done(null, false);
    }
    return done(null, authenticatedUser); // zwracamy zalogowanego usera, prawidłowy email i poprawne hasło
  } catch (error) {
    return done(error);
  }
};

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    authUser
  )
);

export { passport };
