const mongoose = require("mongoose");
const validator = require("validator");

const skillsValidator = function (val) {
  return val.length >= 1 && val.length <= 20;
};
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minLength: [2, "First name must be at least 2 characters long."],
      maxLength: [50, "First name cannot exceed 50 characters."],
      match: [/^[a-zA-Z]+$/, "First name can only contain letters."],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 50,
      match: [
        /^[a-zA-Z\s-]+$/,
        "Last Name can only contain letters, spaces, or hyphens.",
      ],
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long."],
      maxLength: 20,
      select: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
    },
    age: { type: Number, min: [18, "Age must be at least 18."] },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Url: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description of the user",
      minLength: [10, "About section must be at least 10 characters long."],
      maxLength: [500, "About section cannot exceed 500 characters."],
    },
    skills: {
      type: [String],
      default: undefined,
      validate: {
        validator: skillsValidator,
        message: "Skills should be between 1 and 20",
      },
      enum: [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "MongoDB",
        "SQL",
        "Java",
        "C++",
        "AWS",
        "Docker",
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
