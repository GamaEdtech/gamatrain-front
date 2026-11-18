export type typeLoginResponse = 'loginByOTP' | 'register'
export interface LoginResponseDTO {
  type?: typeLoginResponse
  token?: string
  expirationTime?: string
}

export interface GoogleLoginTokenDTO {
  clientId: string
  client_id: string
  credential: string
  select_by: string
}
/** Which flow an emailed code belongs to: signing up, or setting a new password. */
export type AuthCodeMode = 'register' | 'forgetPassword'

/** This backend's sign-in answer (identities/tokens, register, password/reset). */
export interface AuthTokenDTO {
  token?: string | null
  expirationTime?: string | null
}
