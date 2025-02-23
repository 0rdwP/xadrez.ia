import { 
  type User, type InsertUser,
  type PlayerRating, type InsertPlayerRating,
  type PlayerPerformance, type InsertPlayerPerformance,
  playerRatings, playerPerformance
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Métodos para classificação de jogadores
  getPlayerRating(username: string): Promise<PlayerRating | undefined>;
  createPlayerRating(player: InsertPlayerRating): Promise<PlayerRating>;
  updatePlayerRating(username: string, rating: number): Promise<PlayerRating>;
  addPlayerPerformance(username: string, performance: InsertPlayerPerformance): Promise<PlayerPerformance>;
  getPlayerRankings(): Promise<PlayerRating[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ratings: Map<string, PlayerRating>;
  private performances: PlayerPerformance[];
  currentId: number;
  currentRatingId: number;
  currentPerformanceId: number;

  constructor() {
    this.users = new Map();
    this.ratings = new Map();
    this.performances = [];
    this.currentId = 1;
    this.currentRatingId = 1;
    this.currentPerformanceId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPlayerRating(username: string): Promise<PlayerRating | undefined> {
    return this.ratings.get(username);
  }

  async createPlayerRating(player: InsertPlayerRating): Promise<PlayerRating> {
    const id = this.currentRatingId++;
    const rating: PlayerRating = {
      id,
      username: player.username,
      rating: 1200,
      gamesPlayed: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      winCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ratings.set(player.username, rating);
    return rating;
  }

  async updatePlayerRating(username: string, newRating: number): Promise<PlayerRating> {
    const rating = await this.getPlayerRating(username);
    if (!rating) {
      throw new Error("Player not found");
    }

    const updatedRating: PlayerRating = {
      ...rating,
      rating: newRating,
      updatedAt: new Date(),
    };
    this.ratings.set(username, updatedRating);
    return updatedRating;
  }

  async addPlayerPerformance(
    username: string,
    performance: InsertPlayerPerformance
  ): Promise<PlayerPerformance> {
    const rating = await this.getPlayerRating(username);
    if (!rating) {
      throw new Error("Player not found");
    }

    // Criar registro de performance
    const newPerformance: PlayerPerformance = {
      id: this.currentPerformanceId++,
      playerId: rating.id,
      ...performance,
      createdAt: new Date(),
    };
    this.performances.push(newPerformance);

    // Atualizar estatísticas do jogador
    const updatedRating: PlayerRating = {
      ...rating,
      rating: rating.rating + performance.ratingChange,
      gamesPlayed: rating.gamesPlayed + 1,
      averageAccuracy: (rating.averageAccuracy * rating.gamesPlayed + performance.accuracy) / (rating.gamesPlayed + 1),
      bestAccuracy: Math.max(rating.bestAccuracy, performance.accuracy),
      winCount: rating.winCount + (performance.isWin ? 1 : 0),
      updatedAt: new Date(),
    };
    this.ratings.set(username, updatedRating);

    return newPerformance;
  }

  async getPlayerRankings(): Promise<PlayerRating[]> {
    return Array.from(this.ratings.values())
      .sort((a, b) => b.rating - a.rating);
  }
}

export const storage = new MemStorage();