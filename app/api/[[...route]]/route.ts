import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { connectDB } from "@/lib/mongoose";

import { Income } from "@/model/Income";
import { Category } from "@/model/Category";
import { SharedWallet } from "@/model/SharedWallet";
import { auth } from "@clerk/nextjs/server";
import { Purchase } from "@/model/Purchase";

const app = new Hono().basePath("/api");


app.use("*", async (c, next) => {
  await connectDB();
  await next();
});

app.use("*", async (c, next) => {
  const { userId } = await auth();
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("userId", userId);
  await next();
});




app.get("/purchases", async (c) => {
  try {
    const userId = c.get("userId");
    
   
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const search = c.req.query("search") || "";
    const sortBy = c.req.query("sortBy") || "date";
    const sortOrder = c.req.query("sortOrder") || "desc";
    const isCyclic = c.req.query("isCyclic");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    const minAmount = c.req.query("minAmount");
    const maxAmount = c.req.query("maxAmount");

   
    const filter: any = { userId };

 
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }


    if (isCyclic !== undefined) {
      filter.isCyclic = isCyclic === "true";
    }


    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

   
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

 
    const skip = (page - 1) * limit;

   
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

   
    const [purchases, total] = await Promise.all([
      Purchase.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Purchase.countDocuments(filter)
    ]);

 
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return c.json({
      purchases,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return c.json({ error: "Failed to fetch purchases" }, 500);
  }
});


app.get("/purchases/stats", async (c) => {
  try {
    const userId = c.get("userId");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    const filter: any = { userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const stats = await Purchase.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          maxAmount: { $max: "$amount" },
          minAmount: { $min: "$amount" },
          cyclicCount: {
            $sum: { $cond: ["$isCyclic", 1, 0] }
          },
          nonCyclicCount: {
            $sum: { $cond: ["$isCyclic", 0, 1] }
          }
        }
      }
    ]);

    return c.json({
      stats: stats[0] || {
        totalPurchases: 0,
        totalAmount: 0,
        averageAmount: 0,
        maxAmount: 0,
        minAmount: 0,
        cyclicCount: 0,
        nonCyclicCount: 0
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch statistics" }, 500);
  }
});


app.get("/purchases/recent", async (c) => {
  try {
    const userId = c.get("userId");
    const limit = parseInt(c.req.query("limit") || "5");

    const purchases = await Purchase.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return c.json({ purchases });
  } catch (error) {
    return c.json({ error: "Failed to fetch recent purchases" }, 500);
  }
});


app.get("/purchases/cyclic", async (c) => {
  try {
    const userId = c.get("userId");
    const purchases = await Purchase.find({ userId, isCyclic: true })
      .sort({ date: -1 })
      .lean();

    return c.json({ purchases });
  } catch (error) {
    return c.json({ error: "Failed to fetch cyclic purchases" }, 500);
  }
});


app.get("/purchases/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const purchase = await Purchase.findOne({ _id: id, userId });
    
    if (!purchase) {
      return c.json({ error: "Purchase not found" }, 404);
    }
    
    return c.json({ purchase });
  } catch (error) {
    return c.json({ error: "Failed to fetch purchase" }, 500);
  }
});


app.post(
  "/purchases",
  zValidator("json", z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.number().positive("Amount must be positive"),
    isCyclic: z.boolean().default(false),
    date: z.string(),
    balanceBefore: z.number(),
    balanceAfter: z.number(),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const data = c.req.valid("json");
      
      const purchase = await Purchase.create({
        ...data,
        userId,
        date: new Date(data.date),
      });
      
      return c.json({ purchase }, 201);
    } catch (error) {
      console.error("Error creating purchase:", error);
      return c.json({ error: "Failed to create purchase" }, 500);
    }
  }
);


app.patch(
  "/purchases/:id",
  zValidator("json", z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    isCyclic: z.boolean().optional(),
    date: z.string().optional(),
    balanceBefore: z.number().optional(),
    balanceAfter: z.number().optional(),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const data = c.req.valid("json");
      
      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = new Date(data.date);
      }

      const purchase = await Purchase.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true }
      );
      
      if (!purchase) {
        return c.json({ error: "Purchase not found" }, 404);
      }
      
      return c.json({ purchase });
    } catch (error) {
      console.error("Error updating purchase:", error);
      return c.json({ error: "Failed to update purchase" }, 500);
    }
  }
);


app.delete("/purchases/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    
    const purchase = await Purchase.findOneAndDelete({ _id: id, userId });
    
    if (!purchase) {
      return c.json({ error: "Purchase not found" }, 404);
    }
    
    return c.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete purchase" }, 500);
  }
});


app.post(
  "/purchases/bulk-delete",
  zValidator("json", z.object({
    ids: z.array(z.string()).min(1, "At least one ID is required")
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const { ids } = c.req.valid("json");
      
      const result = await Purchase.deleteMany({
        _id: { $in: ids },
        userId
      });
      
      return c.json({ 
        message: `${result.deletedCount} purchase(s) deleted successfully`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error("Error bulk deleting:", error);
      return c.json({ error: "Failed to delete purchases" }, 500);
    }
  }
);


app.get("/income", async (c) => {
  try {
    const userId = c.get("userId");
    
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const category = c.req.query("category");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    const filter: any = { userId };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [income, total] = await Promise.all([
      Income.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Income.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return c.json({
      income,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch income" }, 500);
  }
});


app.get("/income/stats", async (c) => {
  try {
    const userId = c.get("userId");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    const filter: any = { userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const stats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          averageIncome: { $avg: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Income by category
    const byCategory = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return c.json({
      stats: stats[0] || { totalIncome: 0, averageIncome: 0, count: 0 },
      byCategory
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch income stats" }, 500);
  }
});

app.get("/income/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    
    const income = await Income.findOne({ _id: id, userId });
    
    if (!income) {
      return c.json({ error: "Income not found" }, 404);
    }
    
    return c.json({ income });
  } catch (error) {
    console.error("Error fetching income:", error);
    return c.json({ error: "Failed to fetch income" }, 500);
  }
});


app.post(
  "/income",
  zValidator("json", z.object({
    amount: z.number().positive(),
    category: z.string().min(1),
    date: z.string().optional(),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const data = c.req.valid("json");
      
      const income = await Income.create({
        ...data,
        userId,
        date: data.date ? new Date(data.date) : new Date(),
      });
      
      return c.json({ income }, 201);
    } catch (error) {
      return c.json({ error: "Failed to create income" }, 500);
    }
  }
);


app.patch(
  "/income/:id",
  zValidator("json", z.object({
    amount: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    date: z.string().optional(),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const data = c.req.valid("json");
      
      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = new Date(data.date);
      }

      const income = await Income.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true }
      );
      
      if (!income) {
        return c.json({ error: "Income not found" }, 404);
      }
      
      return c.json({ income });
    } catch (error) {
      return c.json({ error: "Failed to update income" }, 500);
    }
  }
);


app.delete("/income/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    
    const income = await Income.findOneAndDelete({ _id: id, userId });
    
    if (!income) {
      return c.json({ error: "Income not found" }, 404);
    }
    
    return c.json({ message: "Income deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete income" }, 500);
  }
});



app.get("/categories", async (c) => {
  try {
    const userId = c.get("userId");
    const type = c.req.query("type");
    
    const filter: any = { userId };
    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    return c.json({ categories });
  } catch (error) {
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

app.post(
  "/categories",
  zValidator("json", z.object({
    name: z.string().min(1),
    type: z.enum(["income", "expense"]),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const data = c.req.valid("json");
      
      // Check if category already exists
      const existing = await Category.findOne({
        userId,
        name: data.name,
        type: data.type
      });

      if (existing) {
        return c.json({ error: "Category already exists" }, 400);
      }

      const category = await Category.create({
        ...data,
        userId,
      });
      
      return c.json({ category }, 201);
    } catch (error) {
      return c.json({ error: "Failed to create category" }, 500);
    }
  }
);


app.delete("/categories/:id", async (c) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    
    const category = await Category.findOneAndDelete({ _id: id, userId });
    
    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }
    
    return c.json({ message: "Category deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete category" }, 500);
  }
});



app.get("/wallets", async (c) => {
  try {
    const userId = c.get("userId");
    const wallets = await SharedWallet.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    }).sort({ createdAt: -1 });
    return c.json({ wallets });
  } catch (error) {
    return c.json({ error: "Failed to fetch wallets" }, 500);
  }
});

app.post(
  "/wallets",
  zValidator("json", z.object({
    name: z.string().min(1),
    members: z.array(z.string()).optional(),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const data = c.req.valid("json");
      
      const wallet = await SharedWallet.create({
        ...data,
        createdBy: userId,
        members: [userId, ...(data.members || [])],
        expenses: [],
      });
      
      return c.json({ wallet }, 201);
    } catch (error) {
      return c.json({ error: "Failed to create wallet" }, 500);
    }
  }
);

app.post(
  "/wallets/:id/expenses",
  zValidator("json", z.object({
    amount: z.number().positive(),
    description: z.string().min(1),
    splitBetween: z.array(z.string()),
  })),
  async (c) => {
    try {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const data = c.req.valid("json");
      
      const wallet = await SharedWallet.findOneAndUpdate(
        { 
          _id: id,
          $or: [{ createdBy: userId }, { members: userId }]
        },
        {
          $push: {
            expenses: {
              ...data,
              paidBy: userId,
              date: new Date(),
            }
          }
        },
        { new: true }
      );
      
      if (!wallet) {
        return c.json({ error: "Wallet not found" }, 404);
      }
      
      return c.json({ wallet });
    } catch (error) {
      return c.json({ error: "Failed to add expense" }, 500);
    }
  }
);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
