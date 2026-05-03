import { describe, it, expect, vi, beforeEach } from "vitest";
import { logout } from "../controller/recruiter/auth/recruiterAuthController.js";
import * as refreshService from "../services/user/auth/refreshTokenService.js";

describe("Logout Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { cookies: {} };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      clearCookie: vi.fn(),
    };

    vi.clearAllMocks();

    // ✅ Make it a spy for ALL tests
    vi.spyOn(refreshService, "removeRefreshToken").mockResolvedValue(undefined);
  });

  it("should return success if no refresh token exists", async () => {
    await logout(req, res);

    expect(refreshService.removeRefreshToken).not.toHaveBeenCalled();
    expect(res.clearCookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should remove refresh token and clear cookie", async () => {
    req.cookies.refreshToken = "valid-token";

    await logout(req, res);

    expect(refreshService.removeRefreshToken).toHaveBeenCalledWith("valid-token");
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});