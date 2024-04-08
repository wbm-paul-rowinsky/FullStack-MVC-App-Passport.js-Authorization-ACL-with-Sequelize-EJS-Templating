import bcrypt from "bcryptjs";

import { User, School, Subject, Grade } from "../models/schemas.js";

export class UsersController {
  async getAll() {
    return await User.findAll();
  }

  async getAllUsersByRole(role) {
    return await User.findAll({
      where: {
        role,
      },
    });
  }

  async getAllUsersByRoleAndSchoolId(role, schoolId) {
    return await User.findAll({
      where: {
        role,
        schoolId,
      },
    });
  }

  async createUser(userData, schoolDb) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const userDb = await User.create(userData);

    if (schoolDb) {
      await userDb.setSchool(schoolDb);
    }
    return userDb;
  }

  async validPassword(password, userDb) {
    try {
      return await bcrypt.compare(password, userDb.password);
    } catch (error) {
      throw new Error(error);
    }
  }

  async setSchool(userDb, schoolDb) {
    if (userDb && schoolDb) {
      await userDb.setSchool(schoolDb);
      return true;
    }
    return false;
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async getFullDataById(id) {
    return await User.findByPk(id, {
      include: [
        {
          model: Subject,
          include: [
            { model: School },
            { model: User, as: "teacher" },
            {
              model: Grade,
              required: false,
              include: [
                {
                  model: School,
                },
                { model: User, as: "teacher" },
              ],
              where: {
                studentId: id, // ocena tylko dla usera o danym id
              },
            },
          ],
        },
        { model: School },
      ],
    });
  }

  async updateById(id, userData) {
    const updatedUser = await User.update(
      {
        ...userData,
      },
      {
        where: {
          id,
        },
      }
    );
    return updatedUser;
  }

  async getUserByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }
}
