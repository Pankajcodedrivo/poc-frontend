import catchAsync from "../utils/catchAsync";
import httpsCall from "./httpsCall";

export const travelForm = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/travel/`,postdata);
  return data;
});

