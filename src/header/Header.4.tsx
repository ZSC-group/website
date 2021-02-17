/** @jsx jsx */
import {jsx, css, CSSObject} from "@emotion/core"
import throttle from 'lodash.throttle'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as React from 'react'
import { WHEN_DESKTOP } from "src/estyles"
import Hamburger from 'src/header/Hamburger'
import {  NameSpaces, useTranslation } from 'src/i18n'
import MediumLogo from 'src/icons/MediumLogo'
import Octocat from 'src/icons/Octocat'
import { useScreenSize } from 'src/layout/ScreenSize'
import LogoDarkBg from 'src/logos/LogoDarkBg'
import LogoLightBg from 'src/logos/LogoLightBg'
import Button, { BTN } from 'src/shared/Button.3'
import Link from 'src/shared/Link'
import menu, { CeloLinks, MAIN_MENU, MenuLink, pagePaths } from 'src/shared/menu-items'
const MobileMenu = dynamic(import('src/shared/MobileMenu'))
import OvalCoin from 'src/shared/OvalCoin'
import { HEADER_HEIGHT } from 'src/shared/Styles'
import { colors } from 'src/styles'
const BlueBanner = dynamic(import('src/header/BlueBanner'), { loading: () => null, ssr: false })
const CookieConsent = dynamic(
  (import('src/header/CookieConsent') as unknown) as Promise<React.ComponentType>
)

const menuItems = MAIN_MENU
const mobileMenu = [menu.HOME, ...MAIN_MENU]

const PATH_TO_ATTRIBUTES: Record<string, MenuLink> = Object.keys(pagePaths).reduce((last, key) => {
  last[pagePaths[key].link] = pagePaths[key]

  return last
}, {})

function scrollOffset() {
  return window.scrollY || document.documentElement.scrollTop
}


function useAttributes() {
  const {pathname} = useRouter()
  return (
    PATH_TO_ATTRIBUTES[pathname] || {
      isDark: false,
      translucent: null,
      menuHidePoint: null,
      menuHidePointMobile: null,
    }
  )
}

function useMenuHidePoint(): number | undefined {
  const {isMobile} = useScreenSize()
  const attributes = useAttributes()
  if (isMobile && attributes.menuHidePointMobile) {
    return attributes.menuHidePointMobile
  }
  return attributes.menuHidePoint
}


  function useScroll() {
    const lastScrollOffset = React.useRef(0)
    const [menuFaded, setMenuFaded] = React.useState(false)
    const [belowFoldUpScroll, setBelowFoldUpScroll] = React.useState(false)
    const menuHidePoint = useMenuHidePoint()

    React.useEffect(() => {
      lastScrollOffset.current = scrollOffset()

      const handleScroll = throttle(() => {
        const goingUp = lastScrollOffset.current > scrollOffset()
        const belowFold = scrollOffset() > (menuHidePoint || window.innerHeight - HEADER_HEIGHT - 1)

        if (goingUp && belowFold) {
          setBelowFoldUpScroll(true)
        } else {
          setBelowFoldUpScroll(false)
        }

        if (goingUp) {
          setMenuFaded(false)
        } else if (belowFold) {
          setMenuFaded(true)
        }

        lastScrollOffset.current = scrollOffset()
      }, 100)

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])

    return {menuFaded, belowFoldUpScroll}
  }

function useBanner() {

    const [isBannerShowing, setBanner] = React.useState(false)

    function toggleBanner() {
      setBanner(!isBannerShowing)
    }

    return {isBannerShowing, toggleBanner}
}

function useMobileMenu(): [boolean, () => void] {
    const {events} = useRouter()
    const [mobileMenuActive, setMobileMenuActive] = React.useState(false)

    function closeMenu() {
      setMobileMenuActive(false)
    }

    React.useEffect(() => {
      events.on('routeChangeComplete',closeMenu)
    }, [])

  function clickHamburger() {
    if (!mobileMenuActive) {
      setMobileMenuActive(true)
    } else {
      closeMenu()
    }
  }

  return [mobileMenuActive, clickHamburger]
}

 export default function Header() {
    const { t } = useTranslation(NameSpaces.common)
    const {bannerHeight} = useScreenSize()
    const {isBannerShowing, toggleBanner} = useBanner()
    const {pathname} = useRouter()
    const attributes = useAttributes()
    const isHomePage = pathname === menu.HOME.link
    const [mobileMenuActive, clickHamburger] = useMobileMenu()

    const {menuFaded, belowFoldUpScroll} =  useScroll()

    const willShowHamburger =  !menuFaded || mobileMenuActive

    const isDarkMode = attributes.isDark || (attributes.translucent && !belowFoldUpScroll)

    const foregroundColor = isDarkMode ? colors.white : colors.dark

    const backgroundColor = React.useMemo(() => {
      const translucentAndNotUp = attributes.translucent && !belowFoldUpScroll
      return css({
        backgroundColor: translucentAndNotUp? "transparent" : isDarkMode ? colors.dark : colors.white,
        [WHEN_DESKTOP]: {
          "&:hover": {
            backgroundColor: translucentAndNotUp? attributes.translucent.backgroundHover: undefined
          }
        },
      })
    }, [attributes.translucent, belowFoldUpScroll, isDarkMode])

    const allWhiteLogo = pathname === menu.ABOUT_US.link && !belowFoldUpScroll

    return (
      <div
        css={[
          styles.container,
          { top: isHomePage && isBannerShowing ? bannerHeight : 0 },
          menuFaded && { height: 0 },
          mobileMenuActive && styles.mobileMenuActive,
        ]}
      >
        {isHomePage && (
          <BlueBanner onVisibilityChange={toggleBanner} />
        )}
        <CookieConsent />
        <div css={css(styles.menuContainer,styles.background,
          backgroundColor,
          styles.fadeTransition,
          menuFaded ? styles.menuInvisible : styles.menuVisible,
          )}>
          <Link href={'/'}>
            <div css={styles.logoLeftContainer}>
              <div css={styles.logoContainer}>
                <>
                  <div
                    // @ts-ignore
                    css={[
                      styles.fadeTransition,
                      menuFaded ? styles.menuInvisible : styles.menuVisible,
                    ]}
                  >
                    {isDarkMode ? (
                      <LogoDarkBg height={30} allWhite={allWhiteLogo} />
                    ) : (
                      <LogoLightBg height={30} />
                    )}
                  </div>
                </>
              </div>
            </div>
          </Link>
          <div
            css={[
              styles.links,
              styles.fadeTransition,
              menuFaded ? styles.menuInvisible : styles.menuVisible,
            ]}
          >
            {menuItems.map((item, index) => (
              <div key={index} css={styles.linkWrapper}>
                <Button
                  kind={isDarkMode ? BTN.DARKNAV : BTN.NAV}
                  href={item.link}
                  text={t(item.name)}
                />
                {pathname === item.link && (
                  <div css={styles.activeTab}>
                    <OvalCoin color={colors.primary} size={10} />
                  </div>
                )}
              </div>
            ))}
            <div css={styles.linkWrapper}>
              <Button
                kind={isDarkMode ? BTN.DARKNAV : BTN.NAV}
                href={'https://medium.com/CeloHQ'}
                text={t('blog')}
                target={'_blank'}
                iconRight={<MediumLogo height={20} color={foregroundColor} wrapWithLink={false} />}
              />
            </div>
            <div css={[styles.linkWrapper, styles.lastLink]}>
              <Button
                kind={isDarkMode ? BTN.DARKNAV : BTN.NAV}
                href={CeloLinks.gitHub}
                text={t('github')}
                target={'_blank'}
                iconRight={
                  <Octocat size={22} color={isDarkMode ? colors.white : colors.dark} />
                }
              />
            </div>
          </div>
        </div>
        {mobileMenuActive && (
          <div css={styles.menuActive}>
            <div css={styles.mobileOpenContainer}>
              <MobileMenu currentPage={pathname} menu={mobileMenu} />
            </div>
          </div>
        )}
        <div
          css={[
            styles.hamburger,
            styles.fadeTransition,
            willShowHamburger && styles.hamburgerShowing,
            isHomePage &&
              !mobileMenuActive && {
                transform: `translateY(${bannerHeight}px)`,
              },
          ]}
        >
          <Hamburger
            isOpen={mobileMenuActive}
            onPress={clickHamburger}
            color={foregroundColor}
          />
        </div>
      </div>
    )
  }

function flexCss(styles: CSSObject) {
  return css({
    display: "flex",
  }, styles)
}

const styles = {
  fadeTransition: css({
    transitionProperty: 'opacity color',
    transitionDuration: '300ms',
  }),
  menuVisible: css({
    opacity: 1,
  }),
  menuInvisible: css({
    opacity: 0,
    zIndex: -5,
    visibility: 'hidden',
  }),
  container: flexCss({
    position: 'fixed',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    maxWidth: '100vw',
    transitionProperty: 'top',
    transitionDuration: '300ms',
  }),
  mobileOpenContainer: flexCss({
    flex: 1,
    justifyContent: 'flex-start',
    height: '100vh',
  }),
  background: flexCss({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 1,
    height: HEADER_HEIGHT,
  }),
  links: css({
    display: "none",
    [WHEN_DESKTOP]: {
      display: "flex",
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    }
  }),
  menuContainer: flexCss({
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingLeft: 20,
    marginRight: 0,
    [WHEN_DESKTOP]: {
      marginRight: 0,
      marginLeft: 0,
      paddingRight: 30,
      paddingLeft: 30,
      position: 'relative',
    }
  }),
  logoContainer: flexCss({
    paddingLeft: 6,
    paddingTop: 20,
    cursor: 'pointer',
  }),
  menuActive: flexCss({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100vh',
    backgroundColor: colors.white,
    overflowY: 'scroll',
  }),
  mobileMenuActive: flexCss({
    bottom: 0,
    top: 0,
    height: 'auto',
    position: 'absolute',
    overflowY: 'hidden',
  }),
  activeTab: flexCss({
    position: 'absolute',
    height: 8,
    width: 7,
    bottom: -16,
  }),
  linkWrapper: flexCss({
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20,
  }),
  lastLink: flexCss({
    marginRight: 10,
  }),
  hamburger: css({
    position: 'fixed',
    top: 5,
    right: 5,
    opacity: 0,
    display: "none",
    [WHEN_DESKTOP]: {
      display: "none"
    }
  }),
  hamburgerShowing: {
    opacity: 1,
    display: "block",
  },
  logoLeftContainer: flexCss({
    flexDirection: 'row',
  }),
  hidden: {
    display: 'none',
  },
  logoLeftVisible: {
    display: 'flex',
  },
}