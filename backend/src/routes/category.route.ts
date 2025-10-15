import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categories = await prisma.category.findMany({
      where: { category_id: Number(id), parent__category_id: null },
      omit: { parent__category_id: true },
      include: {
        other_category: {
          omit: { parent__category_id: true },
        },
      },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parent__category_id: null },
      omit: { parent__category_id: true },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

export default router;
