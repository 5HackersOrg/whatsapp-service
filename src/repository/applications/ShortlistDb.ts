import { DBConnection } from "../../sequelize/setup.js";
import { UserDb } from "../users/user/UserDb.js";
import Shortlist, {
  type ShortlistStatus,
} from "../../sequelize/models/shortlist/Shortlist.js";
import ShortlistAudit from "../../sequelize/models/user/audit/ShortlistAudit.js";
import { ShortlistAuditCandidate } from "../../sequelize/models/user/audit/shortlistAuditCandidate.js";


const db = new DBConnection().getDb();

export class ShortlistDb extends UserDb {
  constructor(name: string) {
    super(`${name} Shortlist Database`);
  }

  async createShortlist(jobId: string, recruiterId: string) {
    return this.run("createShortlist DB Query", async () => {
      return db.transaction(async (transaction) => {
        const shortlist = await Shortlist.create(
          {
            JobId: jobId,
            RecruiterId: recruiterId,
            status: "REVIEWING",
          },
          { transaction },
        );

        await ShortlistAudit.create(
          {
            ShortlistId: shortlist.id,
            RecruiterId: recruiterId,
            event: "CREATE",
            target: "SHORTLIST",
            newValue: shortlist.toJSON(),
          },
          { transaction },
        );

        return shortlist;
      });
    });
  }

  async finalizeOffer(shortlistId: string, candidateIds: string[]) {
    return this.run("finalizeOffer DB Query", async () => {
      return db.transaction(async (transaction) => {
        const shortlist = await Shortlist.findByPk(shortlistId, {
          transaction,
        });
        if (!shortlist) throw new Error("Shortlist not found");

        const valid = candidateIds.filter((id) =>
          //@ts-ignore
          shortlist.CandidateIds.includes(id),
        );
        if (!valid.length) throw new Error("No valid candidates");
        //@ts-ignore
        shortlist.finalizedCandidateIds = [
          //@ts-ignore
          ...new Set([...shortlist.finalizedCandidateIds, ...valid]),
        ];
        //@ts-ignore
        shortlist.CandidateIds = shortlist.CandidateIds.filter(
          //@ts-ignore
          (id) => !valid.includes(id),
        );

        shortlist.status = "OFFER";
        await shortlist.save({ transaction });

        const audit = await ShortlistAudit.create(
          {
            ShortlistId: shortlist.id,
            RecruiterId: shortlist.RecruiterId,
            event: "FINALIZE_CANDIDATE",
            target: "CANDIDATE",
            newValue: shortlist.toJSON(),
          },
          { transaction },
        );

        await ShortlistAuditCandidate.bulkCreate(
          valid.map((id) => ({
            ShortlistAuditId: audit.id,
            CandidateId: id,
          })),
          { transaction },
        );

        return shortlist;
      });
    });
  }
}
