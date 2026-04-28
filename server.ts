import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { products as initialProducts } from "./src/data/products";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345678BAN";
const ADMIN_TOKEN = "tesla-admin-access-token-v1";
const VALID_ROLES = ["Администратор", "Пользователь", "Посетитель"];

// Храним данные в памяти для демонстрации
let productsList = [...initialProducts];
const users = new Map<
  string,
  { username: string; password: string; role: string }
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

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

    if (!username || typeof role !== "string" || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role or username" });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
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
