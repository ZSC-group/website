import { css, keyframes } from "@emotion/react"
import {
  flex,
  flexRow,
  fonts,
  WHEN_DESKTOP,
  WHEN_MOBILE,
  WHEN_TABLET,
  WHEN_TABLET_AND_UP,
  whiteText,
} from "src/estyles"
import { Document } from "@contentful/rich-text-types"
import { GridRow } from "src/layout/Grid2"
import { Asset, Entry } from "contentful"
import { ContentfulButton } from "src/utils/contentful"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

import Button, { SIZE } from "src/shared/Button.3"
import { useScreenSize } from "src/layout/ScreenSize"
import Stats from "./stats/Stats"
import { colors } from "src/colors"
import { useState } from "react"
import useInterval from "src/hooks/useInternval"

export interface Props {
  title?: string
  subTitle: Document
  links: Entry<ContentfulButton>[]
  imageDesktop: Asset
  imageMobile: Asset
  darkMode: boolean
  marquee: string[]
}

export default function Cover(props: Props) {
  const { isMobile } = useScreenSize()

  const backgroundImageCss = css({ backgroundImage: `url(${props.imageDesktop.fields.file.url})` })

  return (
    <GridRow
      columns={2}
      darkMode={props.darkMode}
      wrapperCss={css(wrapperCss, backgroundImageCss)}
      css={rootCss}
    >
      <div css={contentCss}>
        {props.title && (
          <h1 css={css(rH1, centerMobileCss, props.darkMode && whiteText)}>
            {props.title} <Marquee marquee={props.marquee} />
          </h1>
        )}
        <span css={css(subTextCss, props.darkMode ? subtitleDarkMode : centerMobileCss)}>
          {documentToReactComponents(props.subTitle)}
        </span>

        <div css={linkAreaCss}>
          {props.links?.map((link) => (
            <Button
              align={"center"}
              key={link.sys.id}
              size={isMobile ? SIZE.fullWidth : SIZE.normal}
              kind={link.fields.kind}
              text={link.fields.words}
              href={link.fields.href}
            />
          ))}
        </div>
      </div>
      <Stats />
    </GridRow>
  )
}

const DURATION = 3000

function Marquee({ marquee }: { marquee: string[] }) {
  const [index, setIndex] = useState(0)
  useInterval(() => {
    setIndex(marquee.length - 1 === index ? 0 : index + 1)
  }, DURATION)
  return (
    <em key={marquee[index]} css={animatedWordsCss}>
      {marquee[index]}
    </em>
  )
}

const animationKeyframes = keyframes`
  0% {
    letter-spacing: -0.5em;
    filter: blur(6px);
    opacity: 0.10;
  }
  15% {
    filter: blur(0px);
    opacity: 1;
    letter-spacing: 0em;
  }
  90% {
    filter: blur(0px);
    opacity: 1;
    letter-spacing: 0em;
  }
  100% {
    letter-spacing: -0.5em;
    filter: blur(6px);
    opacity: 0.10;
  }
`

const animatedWordsCss = css({
  animation: animationKeyframes,
  animationTimingFunction: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
  animationPlayState: "running",
  animationIterationCount: "1",
  animationFillMode: "both",
  animationDuration: `${DURATION}ms`,
  paddingLeft: 12,
  minWidth: 280,
  display: "inline-block",
  textAlign: "left",
  [WHEN_MOBILE]: {
    minWidth: 180,
  },
})

const subTextCss = css({})

const wrapperCss = css(flex, {
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  boxShadow: `inset 0px -50px 37px -25px ${colors.dark}`,
  alignItems: "center",
  justifyContent: "center",
  [WHEN_MOBILE]: {
    alignContent: "center",
    minHeight: "90vh",
  },
  [WHEN_TABLET]: {
    minHeight: "60vh",
    height: "fit-content",
  },
  [WHEN_DESKTOP]: {
    height: "85vh",
    minHeight: "fit-content",
    maxHeight: "80vw",
  },
})

const rootCss = css({
  gridTemplateAreas: `"content illo"`,
  overflow: "visible",
  [WHEN_MOBILE]: {
    alignContent: "center",
    flexDirection: "column-reverse",
  },
})

const centerMobileCss = css({
  [WHEN_MOBILE]: {
    textAlign: "center",
  },
})

const subtitleDarkMode = css(whiteText, centerMobileCss, {
  "h1, h2, h3, h4, p": whiteText,
})

const contentCss = css(flex, {
  justifySelf: "center",
  justifyContent: "center",
  flex: 1,
  gridArea: "content",
  [WHEN_TABLET_AND_UP]: {
    paddingTop: 56,
    paddingBottom: 16,
    minWidth: 320,
  },
  [WHEN_MOBILE]: {
    padding: 16,
    maxWidth: 450,
    alignSelf: "center",
  },
})

const linkAreaCss = css(flexRow, {
  marginTop: 48,
  [WHEN_MOBILE]: {
    flexDirection: "column",
    "& > div": {
      marginBottom: 24,
    },
  },
  [WHEN_TABLET_AND_UP]: {
    "& > div": {
      marginRight: 24,
      justifyContent: "center",
    },
  },
})

const rH1 = css(fonts.h1, {
  [WHEN_MOBILE]: fonts.h1Mobile,
})
