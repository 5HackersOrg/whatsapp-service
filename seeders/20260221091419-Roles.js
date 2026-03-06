"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: "019c86f9-9cf0-778c-a50a-b5cd4e523cea",
          name: "admin",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
        {
          id: "019c86f9-9cf0-778c-a50a-b808c65b6071",
          name: "recruiter",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
        {
          id: "019c86f9-9cf0-778c-a50a-be81a7bdf43d",
          name: "hiring_manager",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
        {
          id: "019c86f9-9cf0-778c-a50a-be81a7bd5322",
          name: "jobSeeker",
          createdAt: new Date("2026-02-23T20:10:31"),
          updatedAt: new Date("2026-02-23T20:10:31"),
        },
        {
          id: "019c86f9-9cf0-778c-a50a-c0092dfaeb85",
          name: "viewer",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
        {
          id: "3f7d3a11-6c47-4d1b-8e3a-2f1a4b7e9c10",
          name: "moderator",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
        {
          id: "7c2e8b5a-91f4-4e62-a6bb-3d8c5f2e1a77",
          name: "system_admin",
          createdAt: new Date("2026-02-22T20:10:31"),
          updatedAt: new Date("2026-02-22T20:10:31"),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "roles",
      {
        id: [
          "019c86f9-9cf0-778c-a50a-be81a7bd5322",
          "019c86f9-9cf0-778c-a50a-b5cd4e523cea",
          "019c86f9-9cf0-778c-a50a-b808c65b6071",
          "019c86f9-9cf0-778c-a50a-be81a7bdf43d",
          "019c86f9-9cf0-778c-a50a-c0092dfaeb85",
          "3f7d3a11-6c47-4d1b-8e3a-2f1a4b7e9c10",
          "7c2e8b5a-91f4-4e62-a6bb-3d8c5f2e1a77",
        ],
      },
      {},
    );
  },
};
