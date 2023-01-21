import * as React from 'react'

import {
  AccountCircle,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { AppBar, Badge, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import InputBase, { inputBaseClasses } from '@mui/material/InputBase'
import { alpha, styled } from '@mui/material/styles'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: 'fill-available',
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: 'fill-available',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}))

const NavBarPopupMenuItem = styled(MenuItem)(({ theme }) => ({
  minWidth: theme.spacing(24),
  maxWidth: theme.spacing(24),
  width: theme.spacing(24),
}))


const Notification = styled(NavBarPopupMenuItem)(({ theme }) => ({
  minWidth: theme.spacing(24),
  maxWidth: theme.spacing(24),
  width: theme.spacing(24),
}))



export default function PrimarySearchAppBar() {
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(mainMenuAnchorEl)
  const isNotificationsOpen = Boolean(notificationsAnchorEl)

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchorEl(event.currentTarget)
  }
  const handleMainMenuClose = () => {
    setMainMenuAnchorEl(null)
  }

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget)
  }
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 'initial',
        maxHeight: '4rem',
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
      }}
    >
      <AppBar position="fixed" variant="outlined" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', paddingX: { xs: 0, md: 3 } }} variant="dense">
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <IconButton size="large" edge="start" color="inherit">
                <MenuIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                WSD
              </Typography>
            </Box>
            <Search sx={{ flexGrow: 0.5 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" />
            </Search>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" onClick={handleNotificationsOpen} color="inherit">
                <Badge badgeContent={1} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" edge="end" onClick={handleMainMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Menu
        anchorEl={notificationsAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isNotificationsOpen}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'unset',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.common.white, 0.12),
          },
        }}
      >
        <Notification>Notification 1</Notification>
        <Notification>Notification 2</Notification>
        <Notification>Notification 3</Notification>
        <Notification>Notification 4</Notification>
        <Notification>Notification 5</Notification>
      </Menu>
      <Menu
        anchorEl={mainMenuAnchorEl}
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
        onClose={handleMainMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'unset',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.common.white, 0.12),
          },
        }}
      >
        <NavBarPopupMenuItem>My Profile</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Favorites</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Blocked</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Settings</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Contact</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Premium</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Terms</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>About</NavBarPopupMenuItem>
        <NavBarPopupMenuItem>Log Out</NavBarPopupMenuItem>
      </Menu>
    </Box>
  )
}
