type JobDescriptionEmailFormatType = {
  job_description_html: string;
  link: string;
  date: string;
  jobLink: string;
  type: string;
};
export const getJobDescptionEmailFormat = ({
  date,
  jobLink,
  job_description_html,
  link,
  type,
}: JobDescriptionEmailFormatType) => {
  return `<!doctype html>
<html
  lang="en"
  style="
    font-family: 'Inter', Arial, sans-serif;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  "
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tailored Resume</title>
  </head>
  <body style="margin: 0; padding: 0; ">
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
                style=" background-color: #ffffff; "
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
                              src="${link}
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
                     

                 

                    <!-- Job Description -->
                    ${job_description_html}


                    <!-- Apply Button -->
                    <a
                      href="${jobLink}"
                      style="
                        display: inline-block;
                        margin-top: 24px;
                        padding: 12px 24px;
                        background-color: #1f2937;
                        color: #ffffff;
                        font-size: 16px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                      "
                    >
                      View & Apply
                    </a>

                    <!-- Footer -->
                    <p
                      style="
                        color: #9ca3af;
                        font-size: 12px;
                        margin-top: 32px;
                        font-family: 'Times New Roman', Times, serif;
                      "
                    >
                    Please find your attached ${type} tailored for this position. If you did not request this, please disregard this email.
.
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
</html>`;
};
