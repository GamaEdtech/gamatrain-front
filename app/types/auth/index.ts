export interface GoogleLoginTokenDTO {
  clientId: string
  client_id: string
  credential: string
  select_by: string
}
/** Which flow an emailed code belongs to: signing in without the password, signing up, or setting a new password. */
export type AuthCodeMode = 'login' | 'register' | 'forgetPassword'

/** This backend's sign-in answer (identities/tokens, register, password/reset). */
export interface AuthTokenDTO {
  token?: string | null
  expirationTime?: string | null
}
