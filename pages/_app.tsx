import App from 'next/app'
import getConfig from 'next/config'
import Head from 'next/head'
import * as React from 'react'
import { View } from 'react-native'
import scrollIntoView from 'scroll-into-view'
import analytics, { canTrack, initializeAnalytics } from 'src/analytics/analytics'
import Header from 'src/header/Navigation'
import { ScreenSizeProvider } from 'src/layout/ScreenSize'
import Footer from 'src/shared/Footer'
import pagePaths from 'src/shared/menu-items'
import Progress from 'src/shared/Progress'
import { HEADER_HEIGHT } from 'src/shared/Styles'
import { getSentry, initSentry } from 'src/utils/sentry'
import { appWithTranslation } from '../src/i18n'

class MyApp extends App {
  async componentDidMount() {
    if (window.location.hash) {
      hashScroller(window.location.hash)
    }

    window.addEventListener('hashchange', () => hashScroller(window.location.hash))

    if (getConfig().publicRuntimeConfig.FLAGS.ENV === 'development') {
      checkH1Count()
    }
    await initializeAnalytics()
    await analytics.page()
    if (await canTrack()) {
      await initSentry()
    }
    this.props.router.events.on('routeChangeComplete', async () => {
      await analytics.page()
    })
  }

  // there are a few pages we dont want the header on
  // currently this is just the animation demo pages and experience kits and out art project
  skipHeader() {
    return (
      this.props.router.asPath.startsWith("/animation") ||
      this.isBrand() ||
      this.props.router.asPath.startsWith(pagePaths.FLOWERS.link) ||
      this.props.router.asPath === pagePaths.PLUMO.link ||
      [pagePaths.CELO_REWARDS.link, pagePaths.CELO_REWARDS_EDUCATION.link].indexOf(this.props.router.pathname) >= 0
    )
  }

  isBrand = () => {
    return this.props.router.asPath.startsWith('/experience')
  }

  componentDidCatch = async (error: Error, info: object) => {
    const Sentry = await getSentry()
    Sentry.withScope((scope) => {
      scope.setExtras(info)
      Sentry.captureException(error)
    })
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        </Head>
        <ScreenSizeProvider>
          <Progress />
          {this.skipHeader() || <Header />}
          <Component {...pageProps} />
          {this.skipHeader() || (
            <View>
              <Footer />
            </View>
          )}
        </ScreenSizeProvider>
      </>
    )
  }
}

export default appWithTranslation(MyApp)

function checkH1Count() {
  setTimeout(() => {
    if (document.getElementsByTagName('h1').length > 1) {
      console.warn(
        'To many h1 tags on page. This decreases search rank, please limit to 1 per page',
        Array.from(document.getElementsByTagName('h1')).map((el) => el.innerText)
      )
    }
  }, 500)
}

function hashScroller(id: string) {
  const element = document.getElementById(id.replace('#', ''))

  scrollIntoView(element, { time: 100, align: { top: 0, topOffset: HEADER_HEIGHT + 100 } })
}
