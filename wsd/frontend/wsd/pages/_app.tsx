import '../styles/globals.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'
import { NavBar } from 'src/components/'
import theme from 'src/etc/theme'

import { Container } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta name="application-name" content="WSD" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WSD" />
        <meta name="description" content="Why So Dank?" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="icons/touch-icon.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="manifest.json" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://whysodank.com" />
        <meta name="twitter:title" content="WSD" />
        <meta name="twitter:description" content="Why So Dank?" />
        <meta name="twitter:image" content="https://whysodank.com/icons/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@wsd" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="WSD" />
        <meta property="og:description" content="Why So Dank?" />
        <meta property="og:site_name" content="WSD" />
        <meta property="og:url" content="https://whysodank.com" />
        <meta property="og:image" content="https://whysodank.com/icons/apple-touch-icon.png" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=0.8, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <title>Why So Dank?</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Container maxWidth="xl" disableGutters>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </React.Fragment>
  )
}
