import * as React from 'react'
import { useState } from 'react'

import {
  HomeOutlined,
  QueryBuilderOutlined,
  StarBorder,
  Star,
  StarBorderOutlined,
  TrendingUpOutlined,
  IconButton,
} from '@mui/icons-material'
import { Box, Button, ButtonGroup, Typography, Card, Stack, SvgIconProps } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme }) => ({
  paddingY: 0.25,
  color: theme.palette.text.primary,
  display: 'flex',
  justifyContent: 'space-between',
  border: '0 !important',
  borderBottom: '0 !important',
  borderRadius: `${theme.shape.borderRadius} !important`,
  borderTopLeftRadius: `inherit !important`,
  borderTopRightRadius: `inherit !important`,
  borderBottomLeftRadius: `inherit !important`,
  borderBottomRightRadius: `inherit !important`,
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.12) },
}))

const StyledStar = styled(Star)(({ theme }) => ({
  borderColor: 'divider',
  // '&:hover': {backgroundColor: alpha(theme.palette.common.white, 0.12),},
}))

const StyledStarBorderOutlined = styled(StarBorderOutlined)(({ theme }) => ({
  borderColor: 'divider',
  // '&:hover': {backgroundColor: alpha(theme.palette.common.white, 0.12),},
}))

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'initial',
  border: 0,
}))

function SectionStar(props: SvgIconProps) {
  const [isFav, setFav] = React.useState<boolean>(false)
  function toggleFav() {
    setFav(!isFav)
  }
  return isFav ? (
    <StyledStar {...props} onClick={toggleFav} />
  ) : (
    <StyledStarBorderOutlined {...props} onClick={toggleFav} />
  )
}

export default function LeftMenu() {
  return (
    <Stack
      spacing={2}
      sx={{
        position: 'sticky',
        top: (theme) => theme.spacing(8),
        paddingY: 0,
      }}
    >
      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ paddingBottom: 2, paddingX: 1 }}>
          Feed
        </Typography>
        <ButtonGroup orientation="vertical" variant="text" sx={{ width: '100%' }}>
          <StyledButton startIcon={<HomeOutlined />} size="large" sx={{ justifyContent: 'flex-start' }}>
            Hot
          </StyledButton>
          <StyledButton startIcon={<TrendingUpOutlined />} size="large" sx={{ justifyContent: 'flex-start' }}>
            Trending
          </StyledButton>
          <StyledButton startIcon={<QueryBuilderOutlined />} size="large" sx={{ justifyContent: 'flex-start' }}>
            Fresh
          </StyledButton>
        </ButtonGroup>
      </StyledCard>
      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ paddingBottom: 2, paddingX: 1 }}>
          Section
        </Typography>
        <ButtonGroup sx={{ width: '100%' }} orientation="vertical" variant="text">
          <StyledButton endIcon={<SectionStar />} size="large">
            Funny
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Amazing
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Wow
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Girls
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Meme
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Dank
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Other
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            NSFW
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Selfie
          </StyledButton>
          <StyledButton endIcon={<SectionStar />} size="large">
            Food
          </StyledButton>
        </ButtonGroup>
      </StyledCard>
    </Stack>
  )
}
