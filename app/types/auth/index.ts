import type { ApiResult } from '@/types'

// type request for login by username and password
// type confirm for login by otpCode
// type resend_code for send otp code again

export type TypeAuth = 'request' | 'resetpass' | 'resend_code' | 'confirm'

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
export interface RegisterResponseDTO {
  message: string
}
export interface ForgetPasswordResponseDTO {
  message: string
}
export type OTPMode = 'login' | 'register' | 'forgetPassword'
export type OTPResponseData = LoginResponseDTO | RegisterResponseDTO | ForgetPasswordResponseDTO
export type OTPResponse = ApiResult<OTPResponseData>
export type ConfirmPasswordMode = 'register' | 'forgetPassword'
