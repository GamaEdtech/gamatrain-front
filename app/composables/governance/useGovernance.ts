import { useStake } from './useStake'
import { useStats } from './useStats'

export const useGovernance = () => {
  const stake = useStake()
  const stats = useStats()

  return { ...stake, ...stats }
}
