import { pgTable, text, serial, timestamp, json, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  fen: text("fen").notNull(),
  moves: json("moves").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameAnalysis = pgTable("game_analysis", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id),
  playerScore: real("player_score").notNull(),
  bestMoves: json("best_moves").notNull().$type<{
    moveNumber: number;
    playerMove: string;
    bestMove: string;
    evaluation: number;
  }[]>(),
  movesAnalysis: json("moves_analysis").notNull().$type<{
    moveNumber: number;
    move: string;
    evaluation: number;
    bestAlternatives: string[];
  }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playerRatings = pgTable("player_ratings", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  rating: integer("rating").notNull().default(1200), // Rating ELO inicial
  gamesPlayed: integer("games_played").notNull().default(0),
  averageAccuracy: real("average_accuracy").notNull().default(0),
  bestAccuracy: real("best_accuracy").notNull().default(0),
  winCount: integer("win_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerPerformance = pgTable("player_performance", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => playerRatings.id),
  gameId: integer("game_id").references(() => games.id),
  accuracy: real("accuracy").notNull(),
  ratingChange: integer("rating_change").notNull(),
  isWin: integer("is_win").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  fen: true,
  moves: true,
});

export const insertAnalysisSchema = createInsertSchema(gameAnalysis).pick({
  gameId: true,
  playerScore: true,
  bestMoves: true,
  movesAnalysis: true,
});

export const insertPlayerRatingSchema = createInsertSchema(playerRatings).pick({
  username: true,
});

export const insertPlayerPerformanceSchema = createInsertSchema(playerPerformance).pick({
  playerId: true,
  gameId: true,
  accuracy: true,
  ratingChange: true,
  isWin: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type GameAnalysis = typeof gameAnalysis.$inferSelect;
export type InsertPlayerRating = z.infer<typeof insertPlayerRatingSchema>;
export type PlayerRating = typeof playerRatings.$inferSelect;
export type InsertPlayerPerformance = z.infer<typeof insertPlayerPerformanceSchema>;
export type PlayerPerformance = typeof playerPerformance.$inferSelect;