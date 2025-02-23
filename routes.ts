import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerRatingSchema, insertPlayerPerformanceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota para obter a classificação de um jogador
  app.get("/api/players/:username/rating", async (req, res) => {
    try {
      const rating = await storage.getPlayerRating(req.params.username);
      if (!rating) {
        // Se o jogador não existe, criar um novo com rating inicial
        const newRating = await storage.createPlayerRating({
          username: req.params.username,
        });
        return res.json(newRating);
      }
      res.json(rating);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar classificação do jogador" });
    }
  });

  // Rota para registrar performance em uma partida
  app.post("/api/players/:username/performance", async (req, res) => {
    try {
      const performance = insertPlayerPerformanceSchema.parse(req.body);
      const result = await storage.addPlayerPerformance(
        req.params.username,
        performance
      );
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de performance inválidos" });
      }
      res.status(500).json({ message: "Erro ao registrar performance" });
    }
  });

  // Rota para obter ranking geral
  app.get("/api/rankings", async (_req, res) => {
    try {
      const rankings = await storage.getPlayerRankings();
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ranking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}