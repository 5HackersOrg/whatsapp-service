import type { GigData } from "../../../../../utils/signatures/generateSig.js";
import type { stateParams } from "../../user/onBoardMenu.js";
import { UserSessionState } from "../../../../../utils/enums/whatsapp/sessionState.js";
import { SIDE_GIG_STEP5_REVIEW } from "../../../../../utils/enums/whatsapp/sideGigCreationSteps.js";
import { sendWhatsAppMessage } from "../../../whatsappMessages/sendWhatsappMessage.js";
import { reverseGeocode } from "../../../../../utils/addresses/getAddressName.js";

export const step4 = async ({
  message,
  body,
  number,
  user_database,
  ref_code,
  redeemded,
  jobs_database,
  user_email,
  userId,
}: stateParams) => {
  const data = (await jobs_database.getTempSideGigListing(
    user_email,
  )) as GigData;
  if (message.trim().toLowerCase() === "yes") {
    data.is_remote = true;
  } else {
    if (body.Latitude) {
      data.is_remote = false;
      const location: GigData["location"] = { address: "", lat: "", lon: "" };
      if (body.Address) {
        location["address"] = body.Address;
        location["lon"] = body.Longitude;
        location["lat"] = body.Latitude;
      } else {
        location["address"] = await reverseGeocode(
          Number(body.Latitude),
          Number(body.Longitude),
        );
        location["lon"] = body.Longitude;
        location["lat"] = body.Latitude;
      }

      data.location = location;
    }
  }

  await jobs_database.updateTempSideGigListing(data, user_email);
  await user_database.updateWhatsappState(
    number,
    UserSessionState.SIDE_GIG_STEP5_REVIEW,
    user_email,
    "",
    userId,
    ref_code,
    redeemded,
  );

  await sendWhatsAppMessage(
    number,
    SIDE_GIG_STEP5_REVIEW(
      data.title,
      data.description,
      data.budget,
      data.location.address,
      data.is_remote,
    ),
  );
};
