import type { ApiResult, CheckoutRecoveryOfferDTO, PaymentSubscriptionResponseDTO } from '@/types'

/**
 * The checkout recovery offer page's two calls. Both send the email link's token in the body (not the URL), and
 * neither toasts its errors: the page explains an expired or used offer itself.
 */
export const useCheckoutOffer = () => {
  const { handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const loadingGetOffer = ref(false)
  const loadingRedeemOffer = ref(false)

  const getOffer = async (token: string) => {
    loadingGetOffer.value = true
    try {
      return await useApiService.post<ApiResult<CheckoutRecoveryOfferDTO>>(
        '/api/v2/subscriptions/checkout-offers/details',
        { token },
      )
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<CheckoutRecoveryOfferDTO>(err)
    }
    finally {
      loadingGetOffer.value = false
    }
  }

  const redeemOffer = async (token: string) => {
    loadingRedeemOffer.value = true
    try {
      return await useApiService.post<ApiResult<PaymentSubscriptionResponseDTO>>(
        '/api/v2/subscriptions/checkout-offers/redeem',
        { token },
      )
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<PaymentSubscriptionResponseDTO>(err)
    }
    finally {
      loadingRedeemOffer.value = false
    }
  }

  return { getOffer, loadingGetOffer, redeemOffer, loadingRedeemOffer }
}
