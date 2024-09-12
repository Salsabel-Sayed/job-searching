import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    // unique:true,
  },
  role: {
    type: String,
    enum: ["User", "Company_HR"],
    required: true,
  },
  status: {
    type: String,
    // type: Boolean,
    default: "offline",
  },
  otp:String,
  // otpExpires:Date
});

userSchema.pre("save", function (next) {
  this.userName = this.firstName + " " + this.lastName;
  next();
});

export const User = model("User", userSchema);
