// type request for login by username and password
// type confirm for login by otpCode
// type resend_code for send otp code again

export type TypeAuth = 'request' | 'register' | 'resend_code' | 'confirm'

export interface LoginInformationDTO {
  identity: string
  password?: string
  type: string
  code?: number
}

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
