import * as React from "react"
import { NameSpaces, useTranslation } from "src/i18n"
import buildingBlocks from "src/icons/Building_Blocks.svg"
import connectedPeople from "src/icons/Connected_People.svg"
import human from "src/icons/Human.svg"
import speaker from "src/icons/Speaker.svg"
import speechBubbles from "src/icons/Conversation.svg"
import { GridRow } from "src/layout/Grid2"
import {
  flex,
  flexRow,
  fonts,
  standardStyles,
  textStyles,
  WHEN_DESKTOP,
  WHEN_MOBILE,
  WHEN_TABLET,
} from "src/estyles"
import Image from "next/image"
import { css } from "@emotion/react"

const OFFERINGS = [connectedPeople, buildingBlocks, speechBubbles, speaker, human]

export default React.memo(function Benefits() {
  const { t } = useTranslation(NameSpaces.alliance)
  return (
    <GridRow columns={1} css={rootCss}>
      <h3 css={styles.header}>{t("benefits.headline")}</h3>
      <h2 css={styles.mainHeader}>{t("benefits.title")}</h2>
      <div css={styles.offeringsArea}>
        {OFFERINGS.map((img, index) => (
          <Offering key={index} text={t(`benefits.offerings.${index}`)} icon={img} />
        ))}
      </div>
    </GridRow>
  )
})

interface OfferingProps {
  icon: StaticImageData
  text: string
}

const Offering = React.memo(function _Offering({ icon, text }: OfferingProps) {
  return (
    <div css={styles.offeringRoot}>
      <div css={styles.imgContainer}>
        <Image
          blurDataURL={icon.blurDataURL}
          unoptimized={true}
          layout="intrinsic"
          width={icon.width}
          height={icon.height}
          src={icon.src}
          css={styles.offeringImage}
        />
      </div>
      <p css={styles.offeringText}>{text}</p>
    </div>
  )
})

const rootCss = css({
  [WHEN_MOBILE]: standardStyles.blockMarginMobile,
  [WHEN_TABLET]: standardStyles.blockMarginTablet,
  [WHEN_DESKTOP]: standardStyles.blockMargin,
})

const styles = {
  header: css(fonts.h3, {
    marginBottom: 20,
    [WHEN_MOBILE]: {
      textAlign: "center",
    },
  }),
  mainHeader: css(fonts.h2, {
    margin: "20px 0px",
    [WHEN_MOBILE]: {
      textAlign: "center",
    },
  }),
  offeringRoot: css(standardStyles.centered, flex, {}),
  offeringText: css(fonts.body, textStyles.center, {
    maxWidth: 240,
    margin: "30px 50px",
  }),
  offeringImage: css({
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 20,
  }),
  imgContainer: css({
    marginBottom: 10,
    marginTop: 20,
  }),
  offeringsArea: css(flexRow, standardStyles.centered, {
    flexWrap: "wrap",
  }),
}
