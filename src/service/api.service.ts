import catchAsync from "../utils/catchAsync";
import httpsCall from "./httpsCall";

export const travelForm = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/travel/`,postdata);
  return data;
});

export const FeedbackForm = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/travel/feedback`,postdata);
  return data;
});

export const sendEmail = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/travel/sendEmail`,postdata);
  return data;
});
