import { Sequelize } from "sequelize";
const sequelize = new Sequelize("schoolacl", "root", "", {
  host: "localhost",
  dialect: "mysql",
  decimal: true,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established to the database");
  })
  .catch((error) => {
    console.error(error);
  });

export { sequelize };
