import * as React from 'react'

import {
  ArrowDownward,
  ArrowUpward,
  Bookmark,
  BookmarkBorderOutlined,
  MessageSharp,
  MoreVert,
  Share,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

const CardMediaContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}))

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'initial',
  border: 0,
}))

function BookmarkButton(props: SvgIconProps) {
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false)

  function toggleBookmark() {
    setIsBookmarked(!isBookmarked)
  }

  const Icon = isBookmarked ? <Bookmark {...props} /> : <BookmarkBorderOutlined {...props} />
  return <IconButton onClick={toggleBookmark}>{Icon}</IconButton>
}

export default function Meme({src}: {src: string}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <StyledCard
      sx={{
        boxShadow: 0,
        paddingX: 2,
        paddingBottom: 0,
        paddingTop: 1,
      }}
      variant='outlined'
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton edge="start" size="small">
                <Avatar
                  color="text.primary"
                  sx={{ width: (theme) => theme.spacing(2), height: (theme) => theme.spacing(2) }}
                />
              </IconButton>
              <Link variant="subtitle1" component="div" color="text.primary">
                @username
              </Link>
              <Typography
                variant="subtitle1"
                component="div"
                color="text.secondary"
                sx={{ paddingX: (theme) => theme.spacing(1) }}
              >
                12 Aug 2022
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BookmarkButton sx={{ width: (theme) => theme.spacing(2), height: (theme) => theme.spacing(2) }} />
              <IconButton onClick={handleMenuOpen} edge="end">
                <MoreVert sx={{ width: (theme) => theme.spacing(2), height: (theme) => theme.spacing(2) }} />
              </IconButton>
            </Box>
          </Box>
        }
        subheader={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'text.primary',
              paddingBottom: (theme) => theme.spacing(1),
            }}
          >
            <Typography variant="h5" component="div">
              Some long meme title bla bla
            </Typography>
          </Box>
        }
        sx={{ padding: 0 }}
      >
        Hello
      </CardHeader>
      <CardMediaContainer sx={{backgroundColor: (theme) => theme.palette.common.black}}>
        <CardMedia
          component="img"
          alt="Meme Description"
          image="https://picsum.photos/1000/1600"
          sx={{
            objectFit: 'contain',
            width: 'unset',
            minWidth: '50%',
          }}
        />
      </CardMediaContainer>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 0 }}>
        <Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowUpward />}
              sx={{
                borderColor: 'divider',
                color: (theme) => theme.palette.text.primary,
                '&:hover': {
                  borderColor: (theme) => alpha(theme.palette.common.white, 0.3),
                },
              }}
            >
              10
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowDownward />}
              sx={{
                borderColor: 'divider',
                color: (theme) => theme.palette.text.primary,
                '&:hover': {
                  borderColor: (theme) => alpha(theme.palette.common.white, 0.3),
                },
              }}
            >
              15
            </Button>
            <Button
              variant="outlined"
              startIcon={<MessageSharp />}
              sx={{
                borderColor: 'divider',
                color: (theme) => theme.palette.text.primary,
                '&:hover': {
                  borderColor: (theme) => alpha(theme.palette.common.white, 0.3),
                },
              }}
            >
              30 Comments
            </Button>
          </Stack>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Share />}
            sx={{
              borderColor: 'divider',
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                borderColor: (theme) => alpha(theme.palette.common.white, 0.3),
              },
            }}
          >
            Share
          </Button>
        </Box>
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'unset',
            border: '1px solid white',
            borderColor: (theme) => alpha(theme.palette.common.white, 0.12),
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>Save</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Block User</MenuItem>
        <MenuItem onClick={handleMenuClose}>Block Category</MenuItem>
      </Menu>
    </StyledCard>
  )
}
