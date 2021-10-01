import * as React from "react"
import { StyleSheet, View } from "react-native"
import Feature from "src/dev/Feature"
import { H3 } from "src/fonts/Fonts"
import { I18nProps, withNamespaces } from "src/i18n"
import { Cell, GridRow, Spans } from "src/layout/GridRow"
import Fade from "src/shared/AwesomeFade"
import { hashNav } from "src/shared/menu-items"
import { colors, standardStyles, textStyles } from "src/styles"
import addedCoin from "src/dev/features/Added_Coins_Dark.svg"
import coins from "src/dev/features/Coins_Dark.svg"
import choice from "src/dev/features/Choice_Dark.svg"
import ox from "src/dev/features/Ox_Dark.svg"
import validation from "src/dev/features/Validation_Dark.svg"
import eth from "src/dev/features/Eth_Dark.svg"
import feather from "src/dev/features/Feather_Dark.svg"
import human from "src/dev/features/Human_Dark.svg"

type Props = I18nProps

export default withNamespaces("dev")(
  React.memo(function Features({ t }: Props) {
    return (
      <View style={styles.darkBackground}>
        <Fade distance={"40px"}>
          <View nativeID={hashNav.build.features}>
            <GridRow
              desktopStyle={standardStyles.sectionMarginTop}
              tabletStyle={standardStyles.sectionMarginTopTablet}
              mobileStyle={standardStyles.sectionMarginTopMobile}
            >
              <Cell span={Spans.full}>
                <H3 style={textStyles.invert}>{t("featureTitle")}</H3>
              </Cell>
            </GridRow>
            <GridRow
              allStyle={styles.featuresContainer}
              desktopStyle={standardStyles.sectionMarginBottom}
              tabletStyle={standardStyles.sectionMarginBottomTablet}
              mobileStyle={[standardStyles.sectionMarginBottomMobile, styles.featuresMobile]}
            >
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature
                  title={t("feat.stableValueCurrencies")}
                  graphic={coins}
                  text={t("feat.stableText")}
                />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature title={t("feat.phonePKI")} graphic={ox} text={t("feat.pkiText")} />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature title={t("feat.onChainGov")} graphic={choice} text={t("feat.govText")} />
              </Cell>

              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature
                  title={t("feat.selfCustody")}
                  graphic={validation}
                  text={t("feat.custodyText")}
                />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature title={t("feat.proofOfStake")} graphic={eth} text={t("feat.stakeText")} />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature
                  title={t("feat.fastUltraLight")}
                  graphic={feather}
                  text={t("feat.ultraText")}
                />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature
                  title={t("feat.gasMultiCurrency")}
                  graphic={addedCoin}
                  text={t("feat.gasText")}
                />
              </Cell>
              <Cell span={Spans.third} tabletSpan={Spans.half} mobileSpan={Spans.full}>
                <Feature
                  title={t("feat.programmable")}
                  graphic={human}
                  text={t("feat.programmableText")}
                />
              </Cell>
            </GridRow>
          </View>
        </Fade>
      </View>
    )
  })
)

const styles = StyleSheet.create({
  featuresMobile: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  darkBackground: {
    backgroundColor: colors.dark,
  },
  featuresContainer: { flexWrap: "wrap" },
})
