import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import type { BigNumber } from 'ethers'
import type { EthersError } from '@/utils/ethers-utils'

import useAsync from './useAsync'
import ContractErrorCodes from '@/services/contracts/ContractErrorCodes'
import { useSafeSDK } from './coreSDK/safeCoreSDK'
import { type SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { getSafeSDKWithSigner } from '@/services/tx/tx-sender/sdk'
import { type OnboardAPI } from '@web3-onboard/core'

const isContractError = (error: EthersError) => {
  if (!error.reason) return false

  return Object.keys(ContractErrorCodes).includes(error.reason)
}

export const isValidExecution = async (
  onboard: OnboardAPI,
  chainId: SafeInfo['chainId'],
  safeTx: SafeTransaction,
  gasLimit?: BigNumber,
) => {
  if (!gasLimit) return

  const safeSdk = await getSafeSDKWithSigner(onboard, chainId)

  try {
    return safeSdk.isValidTransaction(safeTx, { gasLimit: gasLimit.toString() })
  } catch (_err) {
    const err = _err as EthersError

    if (isContractError(err)) {
      // @ts-ignore
      err.reason += `: ${ContractErrorCodes[err.reason]}`
    }

    throw err
  }
}

const useIsValidExecution = (
  safeTx?: SafeTransaction,
  gasLimit?: BigNumber,
): {
  isValidExecution?: boolean
  executionValidationError?: Error
  isValidExecutionLoading: boolean
} => {
  const safeSdk = useSafeSDK()

  const [isValidExecution, executionValidationError, isValidExecutionLoading] = useAsync(async () => {
    if (!safeTx || !safeSdk || !gasLimit) {
      return
    }
    try {
      return await safeSdk.isValidTransaction(safeTx, { gasLimit: gasLimit.toString() })
    } catch (_err) {
      const err = _err as EthersError

      if (isContractError(err)) {
        // @ts-ignore
        err.reason += `: ${ContractErrorCodes[err.reason]}`
      }

      throw err
    }
  }, [safeTx, safeSdk, gasLimit])

  return { isValidExecution, executionValidationError, isValidExecutionLoading }
}

export default useIsValidExecution
