import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const PORT = process.env.PORT || 3001;
const saltround = 5;

const app = express();
app.use(express.json());

app.get("/signup", async (req, res) => {
  const Schema = z.object({
    email: z.string().min(3).max(50).email(),
    password: z.string().min(8).max(30),
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(20),
  });

  const parsedBody = Schema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error,
    });
    return;
  }

  const { email, password, firstname, lastname } = parsedBody.data;
  try {
    const founduser = await prismaClient.User.findOne({ email });

    if (founduser) {
      res.status(409).json({ message: "User already exist" });
      return;
    }

    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await prismaClient.User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    res.status(201).json({ message: "signup successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const schema = z.object({
    email: z.string().min(3).max(50).email(),
    password: z.string().min(8).max(20),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    res.status(400).json({
      message: "Invalid request body",
      error: parsedbody.error,
    });
    return;
  }
  const { email, password } = parsedbody.data;

  try {
    const founduser = await prismaClient.User.findOne({ email });

    if (!founduser || !bcrypt.compareSync(password, founduser.password)) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: founduser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    // for token based authentication send token in response
    // return res.status(200).json({ token: token });

    // for cookie based authentication set cookie in response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 172800 * 1000,
    });

    res.status(200).json({ message: "Signin successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/chat", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
