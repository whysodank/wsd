import * as React from 'react'
import { LeftMenu, Memes, RightMenu } from 'src/components'

import { Unstable_Grid2 as Grid } from '@mui/material'

export default function Index() {
  return (
    <Grid container spacing={2} sx={{ marginTop: '48px', justifyContent: 'center' }}>
      <Grid
        xs={3}
        sx={{
          display: { xs: 'none', md: 'initial' },
        }}
      >
        <LeftMenu />
      </Grid>
      <Grid xs={0.25}></Grid>
      <Grid xs={5.5} sx={{ flexGrow: 1 }}>
        <Memes />
      </Grid>
      <Grid xs={0.25}></Grid>
      <Grid
        xs={3}
        sx={{
          display: { xs: 'none', md: 'initial' },
        }}
      >
        <RightMenu />
      </Grid>
    </Grid>
  )
}
