import "dotenv/config";
import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";
import focusRouter from "./routes/focus";
import walletRouter from "./routes/wallet";
import settingsRouter from "./routes/settings";
import rewardsRouter from "./routes/rewards";
import reportsRouter from "./routes/reports";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/tasks", tasksRouter);
app.use("/api/focus", focusRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/rewards", rewardsRouter);
app.use("/api/reports", reportsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`TwentyFour API listening on http://localhost:${port}`);
});
