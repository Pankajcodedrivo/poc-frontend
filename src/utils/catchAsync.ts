import { type AxiosResponse } from "axios";

interface ErrorResponse {
  response: {
    data: any; // eslint-disable-line
  };
}

export type ResponseOrError<T> = AxiosResponse<T> | ErrorResponse;

const catchAsync = <T>(
  fn: (..._args: any[]) => Promise<AxiosResponse<T>> // eslint-disable-line
  // eslint-disable-next-line
): ((..._args: any[]) => Promise<any>) => {
  return async (
    ...rest: any[] // eslint-disable-line
  ) => {
    try {
      const result = await fn(...rest);
      return result.data as any; // eslint-disable-line
    } catch (
      error: any // eslint-disable-line
    ) {
      throw error; 
    }
  };
};

export default catchAsync;
