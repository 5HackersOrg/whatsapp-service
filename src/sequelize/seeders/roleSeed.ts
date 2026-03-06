import { Role } from "../models/user/Role.js";
import type { RoleAttributes } from "../models/user/Role.js"; // import your Roles type

export const seedRoles = async () => {
  const roles: { name: RoleAttributes["name"] }[] = [
    { name: "admin" },
    { name: "recruiter" },
    { name: "hiring_manager" },
    { name: "jobSeeker" },
    { name: "viewer" },
    { name: "moderator" },
    { name: "system_admin" },
  ];
  await Role.bulkCreate(roles);

  console.log("Roles seeded successfully!");
};
