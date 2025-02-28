import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.get("/signup", (req, res) => {
  res.send("Hello World");
});

app.post("/signin", (req, res) => {
  res.send("Hello World");
});

app.get("/chat", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
