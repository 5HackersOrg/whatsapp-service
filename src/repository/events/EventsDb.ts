import {
  type EventResource,
  type ResourceType,
  Event,
} from "../../sequelize/models/user/events/Event.js";
import { UserDb } from "../users/user/UserDb.js";

export class EventDb extends UserDb {
  constructor() {
    super(`Event Database`);
  }

  async logEvent(
    userId: string,
    targetId: string,
    eventResource: EventResource,
    resourceType: ResourceType,
    metaData: string,
  ) {
    return await this.run("logEvent DB Query", async () => {
      return await Event.create({
        UserId: userId,
        targetId,
        eventResource,
        resourceType,
        metaData: JSON.stringify(metaData),
      });
    });
  }

  async getRecruiterEvents(userId: string) {
    return await this.run("getRecruiterEvents DB Query", async () => {
      return await Event.findAll({
        where: { UserId: userId },
        order: [["createdAt", "DESC"]],
      });
    });
  }

  async getEventsByResource(userId: string, resource: EventResource) {
    return await this.run("getEventsByResource DB Query", async () => {
      return await Event.findAll({
        where: {
          UserId: userId,
          eventResource: resource,
        },
        order: [["createdAt", "DESC"]],
      });
    });
  }

  async getEventsByTarget(targetId: string) {
    return await this.run("getEventsByTarget DB Query", async () => {
      return await Event.findAll({
        where: { targetId },
        order: [["createdAt", "DESC"]],
      });
    });
  }
}

export const getEventDbMethods = () => {
  return new EventDb();
};
