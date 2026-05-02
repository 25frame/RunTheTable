import { authedPost } from "./auth";
export async function adminAction<TPayload extends Record<string, unknown>>(
  action: string,
  _key: string,
  payload: TPayload = {} as TPayload
) {
  return authedPost(action, payload);
}
