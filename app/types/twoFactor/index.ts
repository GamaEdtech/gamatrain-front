// Admin authenticator (TOTP) two-factor - gamatrain-back api/v1/admin/twofactor (GamaEdtech/gamatrain-back#734).
export interface TwoFactorStatusDTO {
  enabled: boolean
}

export interface AuthenticatorSetupDTO {
  sharedKey: string
  authenticatorUri: string
}
