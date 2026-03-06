import { ITN } from "../../sequelize/models/payments/ITN.js";
import { Payment, type PaymentStatus, type PaymentTypes } from "../../sequelize/models/payments/Payment.js";
import { UserDb } from "../users/user/UserDb.js";


export class PaymentsDb extends UserDb {
  constructor() {
    super("Payments Database");
  }

  async createPayment(params: {
    amount: number;
    payeerId: string;
    currency: string;
    type: PaymentTypes;
  }) {
    return await this.run("createPayment DB Query", async () => {
      const payment = await Payment.create({
        ...params,
        status: "PENDING",
      });
      return payment;
    });
  }

  async addITN(paymentId: string, transactionId: string, status: string) {
    return await this.run("addITN DB Query", async () => {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) throw new Error("Payment not found");

      const itn = await ITN.create({
        PaymentId: payment.id,
        transactionId,
        status,
      });

      return itn;
    });
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus) {
    return await this.run("updatePaymentStatus DB Query", async () => {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) throw new Error("Payment not found");

      payment.status = status;
      await payment.save();
      return payment;
    });
  }

  async getPaymentWithITN(paymentId: string) {
    return await this.run("getPaymentWithITN DB Query", async () => {
      const payment = await Payment.findByPk(paymentId, { include: ITN });
      if (!payment) throw new Error("Payment not found");
      return payment;
    });
  }

  async getUserPayments(payeerId: string) {
    return await this.run("getUserPayments DB Query", async () => {
      return Payment.findAll({ where: { payeerId }, include: ITN });
    });
  }


  async verifyITN(transactionId: string, itnStatus: string) {
    return await this.run("verifyITN DB Query", async () => {
      const itn = await ITN.findOne({ where: { transactionId } });
      if (!itn) throw new Error("ITN not found");

      itn.status = itnStatus;
      await itn.save();

      const payment = await Payment.findByPk(itn.PaymentId);
      if (!payment) throw new Error("Payment not found");

      if (
        itnStatus.toUpperCase() === "COMPLETE" ||
        itnStatus.toUpperCase() === "COMPLETED"
      ) {
        payment.status = "COMPLETED";
        await payment.save();
      }

      return { payment, itn };
    });
  }
}
