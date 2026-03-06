export const emailOTPTemplate = (code: string, date: string, link: string) => {
  return `<!doctype html>
<html
  lang="en"
  style="
    font-family: &quot;Inter&quot;, Arial, sans-serif;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  "
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; overflow: hidden">
    <div
      style="
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
      "
    >
      <div>
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="padding: 32px 0"
        >
          <tr>
            <td align="center">
              <table
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 480px; background-color: #ffffff"
              >
                <tr>
                  <td style="padding: 32px; text-align: center">
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      "
                    >
                      <div>
                        <div
                          style="
                            margin-top: 10px;
                            width: 100px;
                            height: 20px;
                            padding: 2%;
                          "
                        >
                          <div
                            style="
                              width: 100%;
                              height: 100%;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                            "
                          >
                            <img
                              src="${link}"
                              style="
                                width: 100%;
                                height: 100%;
                                filter: invert(1);
                              "
                              alt="logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="">
                        <p
                          style="
                            color: #565555;
                            font-size: 13px;
                            font-weight: bold;
                            margin-right: 15px;
                            position: relative;
                            top: 4px;
                          "
                        >
                          ${date}
                        </p>
                      </div>
                    </div>

                    <!-- Title -->
                    <h2
                      style="
                        color: #111827;
                        font-size: 22px;
                        margin: 0 0 12px;
                        font-family:
                          &quot;Courier New&quot;, Courier, monospace;
                      "
                    >
                      Your OTP
                    </h2>
                    <p
                      style="
                        color: #6b7280;
                        font-size: 13px;
                        font-family: &quot;Times New Roman&quot;, Times, serif;
                      "
                    >
                      We’re excited to have you on board <br />To make sure your
                      account is secure and fully activated, we need you to
                      verify your email address.
                    </p>
                    <p
                      style="
                        color: #707174;
                        font-size: 12px;
                        font-family: &quot;Times New Roman&quot;, Times, serif;
                      "
                    >
                      This code is valid for the next 10 minutes, so be sure to
                      use it promptly. After that, it will expire for security
                      reasons, and you’ll need to request a new one.<br />
                      We’re thrilled to have you join the community. Once
                      verified, you’ll get access to all our features and
                      updates designed to make your experience seamless and
                      exciting!<br />

                      <!-- OTP Box -->
                    </p>

                    <div
                      style="
                        display: inline-block;
                        padding: 16px 28px;
                        font-family:
                          Cambria, Cochin, Georgia, Times,
                          &quot;Times New Roman&quot;, serif;

                        font-size: 24px;
                        letter-spacing: 4px;
                        color: #111827;
                        font-weight: 600;
                      "
                    >
                      ${code}
                    </div>

                    <!-- Footer text -->
                    <p
                      style="
                        color: #c8c9cb;
                        font-size: 11px;
                        font-family: &quot;Times New Roman&quot;, Times, serif;
                      "
                    >
                      <br />
                      If you didn’t initiate this request, don’t worry—no
                      changes have been made to your account. Simply ignore this
                      email, and your account will remain safe.<br />
                    </p>

                    <!-- Divider -->
                    <hr
                      style="
                        border: none;
                        height: 1px;
                        background-color: #e5e7eb;
                        margin: 24px 0;
                      "
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>


`;
};
