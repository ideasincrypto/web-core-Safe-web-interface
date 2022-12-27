import { type ReactElement } from 'react'
import { Box, Typography } from '@mui/material'
import SouthIcon from '@mui/icons-material/South'
import css from './styles.module.css'
import useSafeAddress from '@/hooks/useSafeAddress'
import EthHashInfo from '@/components/common/EthHashInfo'

const SendFromBlock = (): ReactElement => {
  const address = useSafeAddress()

  return (
    <Box className={css.container} pb={2} mb={2}>
      <Typography color={({ palette }) => palette.text.secondary} pb={1}>
        Sending from
      </Typography>

      <Typography variant="body2">
        <EthHashInfo address={address} shortAddress={false} hasExplorer showCopyButton />
      </Typography>

      <SouthIcon className={css.arrow} />
    </Box>
  )
}

export default SendFromBlock
