import { sequelize } from "../utility/db.js";
import { DataTypes } from "sequelize";

const Grade = sequelize.define("Grade", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    validate: { isInt: true },
  },
  grade: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
      max: 6,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export { Grade };
