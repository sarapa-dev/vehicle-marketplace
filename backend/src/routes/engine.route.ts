import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const engines = await prisma.engine.findMany();
    res.json(engines);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch engines" });
  }
});

export default router;
