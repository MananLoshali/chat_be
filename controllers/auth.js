import User from "../schema/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER A NEW USER
export const register = async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    res.status(400).json({ msg: "All fields are necessary", status: false });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 9);

  const userPayload = {
    name,
    email,
    password: hashedPassword,
  };

  const newUser = await User.create(userPayload);
  res
    .status(201)
    .json({ msg: "User created successfully", success: true, user: newUser });
};

//LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400).json({ msg: "All fields are necessary", status: false });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ msg: "No user found", status: false });
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ msg: "Password is incorrect", status: false });
    return;
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SEC
  );
  res
    .status(200)
    .json({ msg: "Login successfull", user, success: true, token });
};
