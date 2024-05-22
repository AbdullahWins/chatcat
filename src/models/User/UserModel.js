// models/UserModel.js

const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const {
  UserLoginDTO,
  UserRegisterDTO,
  UserUpdateDTO,
  UserFetchDTO,
} = require("../../dtos/UserDTO");
const { generateToken } = require("../../services/tokenHandlers/HandleJwt");
const { validateOTP } = require("../../services/otpHandlers/HandleOTP");
const {
  hashPassword,
  comparePasswords,
} = require("../../services/encryptionHandlers/HandleBcrypt");
const {
  friendsListSchema,
  groupsListSchema,
  eventsListSchema,
  favoritesListSchema,
} = require("./UserSubschemas");
const {
  CustomError,
} = require("../../services/responseHandlers/HandleResponse");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => {
        //validate email format
        return /\S+@\S+\.\S+/.test(value);
      },
      message: (props) => `${props?.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        //validate password length
        return value.length >= 6;
      },
      message: (props) => `${props?.value} is not a valid password!`,
    },
  },
  fullName: {
    type: String,
    default: "",
  },
  birthDay: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  hometown: {
    type: String,
    default: "",
  },
  currentTown: {
    type: String,
    default: "",
  },
  yearsOfMoving: {
    type: String,
    default: "",
  },
  occupation: {
    type: String,
    default: "",
  },
  profileImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  coverImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  hobbyList: {
    type: [String],
    default: [],
  },
  friendsList: {
    type: [friendsListSchema],
    default: [],
  },
  groupsList: {
    type: [groupsListSchema],
    default: [],
  },
  eventsList: {
    type: [eventsListSchema],
    default: [],
  },
  favoritesList: {
    type: [favoritesListSchema],
    default: [],
  },

  createdAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
  updatedAt: {
    type: Number,
    default: () => {
      return Timekoto();
    },
  },
});

//get all users from the database
userSchema.statics.getAllUsers = async function () {
  try {
    const users = await this.find().exec();
    //filter with dto
    const usersDTO = users.map((user) => new UserFetchDTO(user));
    return usersDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get one user
userSchema.statics.getOneUser = async function ({ id }) {
  try {
    const user = await this.findOne({ _id: id }).exec();
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    const userDTO = new UserFetchDTO(user);
    return userDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// static method for login
userSchema.statics.login = async function ({ email, password }) {
  try {
    const user = await this.findOne({ email }).exec();
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    const passwordMatch = await comparePasswords(password, user?.password);
    if (!passwordMatch) {
      throw new CustomError(401, "Invalid password");
    }

    const token = generateToken(user?._id);
    const userDTO = new UserLoginDTO(user);

    const finalResponse = { ...userDTO, accessToken: token };
    return finalResponse;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// static method for registration
userSchema.statics.register = async function ({ username, email, password }) {
  try {
    //check if the user already exists
    const existingUserCheck = await this.findOne({ email }).exec();
    if (existingUserCheck) {
      throw new CustomError(409, "User already exists");
    }

    //hash the password
    const hashedPassword = await hashPassword(password);

    //create a new User instance
    const newUser = new this({ username, email, password: hashedPassword });

    //save the User to the database
    await newUser.save();

    //generate token
    const token = generateToken(newUser?._id);
    const userDTO = new UserRegisterDTO(newUser);

    const finalResponse = { ...userDTO, accessToken: token };
    return finalResponse;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for updating user data
userSchema.statics.updateUserById = async function ({ id, updateData }) {
  try {
    const updatedUser = await this.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser) {
      throw new CustomError(404, "User not found");
    }
    const userDTO = new UserUpdateDTO(updatedUser);
    return userDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for sending OTP
userSchema.statics.updatePasswordByOTP = async function ({
  email,
  otp,
  newPassword,
}) {
  try {
    // Validate OTP
    const otpStatus = await validateOTP({ email, otp, Model: this });
    if (otpStatus?.error) {
      return { error: otpStatus?.error };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password
    const updatedUser = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      throw new CustomError(404, "User not found");
    }
    const userDTO = new UserUpdateDTO(updatedUser);
    return userDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

// Static method for updating password by email
userSchema.statics.updatePasswordByEmail = async function ({
  email,
  oldPassword,
  newPassword,
}) {
  try {
    const user = await this.findOne({ email });

    if (!user) {
      throw new CustomError(404, "User not found");
    }

    const passwordMatch = await comparePasswords(oldPassword, user.password);

    if (!passwordMatch) {
      throw new CustomError(401, "Invalid password");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await this.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    const userDTO = new UserUpdateDTO(updatedUser);
    return userDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

userSchema.statics.deleteUserById = async function (id) {
  try {
    const result = await this.deleteOne({ _id: id });

    if (result?.deletedCount === 0) {
      throw new CustomError(404, "User not found");
    } else {
      return { message: `User deleted successfully with id: ${id}` };
    }
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
