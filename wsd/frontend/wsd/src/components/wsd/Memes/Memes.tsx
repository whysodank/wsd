import * as React from 'react'
import { Meme } from 'src/components'

import { Stack } from '@mui/material'

export default function Memes() {
  return (
    <Stack spacing={2} sx={{ position: 'relative', top: (theme) => theme.spacing(1) }}>
      <Meme src="https://picsum.photos/1000/1600"/>
      <Meme src="https://picsum.photos/800/1600"/>
      <Meme src="https://picsum.photos/900/1600"/>
      <Meme src="https://picsum.photos/950/1600"/>
      <Meme src="https://picsum.photos/1001/1600"/>
    </Stack>
  )
}
