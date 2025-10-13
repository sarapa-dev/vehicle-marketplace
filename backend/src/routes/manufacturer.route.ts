import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      orderBy: { name: "asc" },
    });

    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch manufacturers" });
  }
});

export default router;
