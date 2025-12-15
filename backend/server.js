const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

// Importar rotas
const authRoutes = require("./routes/auth"); //github.com/Rafael10100/Login-Register-App

const app = express(); //github.com/Rafael10100/Login-Register-App

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Servidor está funcionando" });
});

// Configurar banco de dados
const createTables = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log("Tabela users criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await createTables();
});
