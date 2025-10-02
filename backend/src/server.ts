import expres from "express";
import "dotenv/config";

const app = expres();

const PORT = process.env.PORT || 8080;

app.get("/test", (_, res) => {
  res.json({ message: "Hello from test route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
