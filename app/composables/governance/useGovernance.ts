import { useStake } from './useStake'

export const useGovernance = () => {
  const stake = useStake()

  return { ...stake }
}
