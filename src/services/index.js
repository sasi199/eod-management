import interceptors from "../interceptors/axios";

export const functionName = async () => {
  const res = await interceptors.get("/end/point");
  return res;
};
