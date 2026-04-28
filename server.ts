import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { products as initialProducts } from "./src/data/products";

type UserRole = "Администратор" | "Пользователь" | "Посетитель";

type OrderStatus = "Ожидает" | "Принят" | "Не принято";

type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  username: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: { username: string; role: UserRole };
    }
  }
}

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345678BAN";
const ADMIN_TOKEN = "tesla-admin-access-token-v1";
const VALID_ROLES: UserRole[] = ["Администратор", "Пользователь", "Посетитель"];

// Храним данные в памяти для демонстрации
let productsList = [...initialProducts];
const users = new Map<
  string,
  { username: string; password: string; role: UserRole }
>([
  [
    ADMIN_USERNAME,
    {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      role: "Администратор",
    },
  ],
]);

const orders: Order[] = [];

function parseAuthToken(req: express.Request) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token === ADMIN_TOKEN) {
    return { username: ADMIN_USERNAME, role: "Администратор" as const };
  }

  if (token?.startsWith("tesla-user-token-")) {
    const username = token.replace("tesla-user-token-", "");
    const user = users.get(username);
    if (user) {
      return { username, role: user.role };
    }
  }

  return null;
}

function validateCredentials(username: string, password: string) {
  const errors: string[] = [];
  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 4) {
    errors.push("Имя пользователя должно содержать минимум 4 символа.");
  }

  if (password.length < 5) {
    errors.push("Пароль должен быть минимум 5 символов.");
  }

  if (!/[A-ZА-Я]/.test(password)) {
    errors.push("Пароль должен содержать заглавную букву.");
  }

  if (!/\d/.test(password)) {
    errors.push("Пароль должен содержать цифру.");
  }

  return errors;
}

function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const auth = parseAuthToken(req);
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = auth;
  next();
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const auth = parseAuthToken(req);
  if (!auth || auth.role !== "Администратор") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = auth;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json()); // Для парсинга JSON в теле запроса

  app.post("/api/auth/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Введите имя пользователя и пароль." });
    }

    const errors = validateCredentials(username, password);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    if (username.toLowerCase() === ADMIN_USERNAME) {
      return res.status(400).json({ message: "Имя пользователя недоступно." });
    }

    if (users.has(username)) {
      return res.status(409).json({ message: "Имя пользователя уже занято." });
    }

    users.set(username, { username, password, role: "Пользователь" });
    return res.status(201).json({ message: "Пользователь зарегистрирован." });
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({
        token: ADMIN_TOKEN,
        username: ADMIN_USERNAME,
        role: "Администратор",
      });
    }

    const user = users.get(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: `tesla-user-token-${username}`,
      username,
      role: user.role,
    });
  });

  app.put("/api/roles/users/:username", requireAdmin, (req, res) => {
    const username = req.params.username;
    const { role } = req.body;

    if (
      !username ||
      typeof role !== "string" ||
      !VALID_ROLES.includes(role as UserRole)
    ) {
      return res.status(400).json({ message: "Invalid role or username" });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role as UserRole;
    users.set(username, user);
    return res.status(200).json({ message: "Role updated" });
  });

  // READ: Получить все товары
  app.get("/api/products", (req, res) => {
    setTimeout(() => {
      res.json(productsList);
    }, 300);
  });

  // CREATE: Добавить новый товар
  app.post("/api/products", requireAdmin, (req, res) => {
    const newProduct = req.body;
    newProduct.id =
      productsList.length > 0
        ? Math.max(...productsList.map((p) => p.id)) + 1
        : 1;
    productsList.push(newProduct);
    res.status(201).json(newProduct);
  });

  // UPDATE: Обновить товар
  app.put("/api/products/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const index = productsList.findIndex((p) => p.id === id);
    if (index !== -1) {
      productsList[index] = { ...productsList[index], ...req.body, id };
      res.json(productsList[index]);
    } else {
      res.status(404).json({ message: "Товар не найден" });
    }
  });

  // DELETE: Удалить товар
  app.delete("/api/products/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    productsList = productsList.filter((p) => p.id !== id);
    res.status(204).send();
  });

  app.post("/api/orders", requireAuth, (req, res) => {
    const items = req.body.items as OrderItem[];

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Корзина пуста." });
    }

    const orderItems = items.map((item) => ({
      productId: Number(item.productId),
      name: String(item.name),
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order: Order = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      username: req.user!.username,
      items: orderItems,
      total,
      status: "Ожидает",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    return res.status(201).json(order);
  });

  app.get("/api/orders", requireAuth, (req, res) => {
    if (req.user?.role === "Администратор") {
      return res.json(orders);
    }

    return res.json(
      orders.filter((order) => order.username === req.user?.username),
    );
  });

  app.put("/api/orders/:id/status", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["Принят", "Не принято", "Ожидает"].includes(status)) {
      return res.status(400).json({ message: "Недопустимый статус заказа." });
    }

    const order = orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status as OrderStatus;
    return res.status(200).json(order);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, proxy: {} },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
