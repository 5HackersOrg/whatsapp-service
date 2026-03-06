import { col, fn } from "sequelize";
import { Rating } from "../../../sequelize/models/user/Rating.js";
import { User } from "../../../sequelize/models/user/Users.js";
import { logError } from "../../../services/logging/loggers.js";

export class UserDb {
  endpoint = "User Database";
  constructor(endpoint: string = "User Database") {
    this.endpoint = endpoint;
  }
  async log(
    action: string,
    error: unknown,
    severity: "info" | "warn" | "error" | "critical" = "critical",
  ) {
    const err = error as Error;
    await logError({
      action,
      error_message: err.message,
      error_type: "SERVER_ERROR",
      severity: severity,
      endpoint: this.endpoint,
      stack_trace: err.stack ?? "no stack trace",
    });
  }

  async run<T>(
    action: string,
    fn: () => Promise<T>,
    severity?: "info" | "warn" | "error" | "critical",
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      await this.log(action, error);
      throw error;
    }
  }
  async createRating(
    userId: string,
    targetId: string,
    score: number,
    message?: string,
  ) {
    return this.run("createRating DB Query", async () => {
      if (score < 1 || score > 5) {
        throw new Error("Score must be between 1 and 5");
      }

      return Rating.create({
        UserId: userId,
        targetId,
        score,
        message: message ?? null,
      });
    });
  }
  async getUserEmail(userId: string) {
    return this.run("getUserEmail Db query", async () => {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      return user.dataValues.email;
    });
  }

  async getAverageRating(targetId: string) {
    return this.run("getAverageRating DB Query", async () => {
      const result = await Rating.findOne({
        where: { targetId },
        attributes: [
          [fn("AVG", col("score")), "average"],
          [fn("COUNT", col("id")), "count"],
        ],
        raw: true,
      });

      return {
        //@ts-ignore
        average: result?.average
          ? //@ts-ignore
            parseFloat(Number(result.average).toFixed(2))
          : 0,
        //@ts-ignore
        totalRatings: result?.count ?? 0,
      };
    });
  }

  async getRatingsForTarget(targetId: string) {
    return this.run("getRatingsForTarget DB Query", async () => {
      return Rating.findAll({
        where: { targetId },
        order: [["createdAt", "DESC"]],
      });
    });
  }

  async getRatingMessages(targetId: string) {
    return this.run("getRatingMessages DB Query", async () => {
      return Rating.findAll({
        where: {
          targetId,
        },
        attributes: ["UserId", "score", "message", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
    });
  }

  async getUserByEmail(email: string) {
    return this.run("getUserByEmail DB Query", () =>
      User.findOne({ where: { email } }),
    );
  }

  async getUserById(id: string) {
    return this.run("getUserById DB Query", () =>
      User.findByPk(id, { raw: true }),
    );
  }
  async suspendRecruiter(userId: string, adminId: string) {
    return this.run("suspendUser DB Query", async () => {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");

      if (user.suspended) {
        console.log("User is already suspended");
        return user;
      }

      user.suspended = true;
      await user.save();

      return user;
    });
  }
}
