import * as React from "react"
import OpenGraph from "src/header/OpenGraph"
import Cover, { Props as CoverProps } from "./Cover"
import { ContentfulPage, GridRowContentType, LogoGallery } from "src/utils/contentful"
import { GridRow } from "src/layout/Grid2"
import { css } from "@emotion/react"
import { cellSwitch } from "src/public-sector/cellSwitch"
import HR, { Props as HorizontalType } from "src/contentful/HorizontalRule"
import { WHEN_DESKTOP } from "src/estyles"
import PillGallery from "./PillGallary"

export type Props = ContentfulPage<GridRowContentType | CoverProps | LogoGallery>

export default function Home({ sections, title, description, openGraph }: Props) {
  return (
    <div css={rootCss}>
      <OpenGraph
        title={title}
        description={description}
        path={"/"}
        image={`https:${openGraph?.fields?.file?.url}`}
      />

      {sections.map((section) => {
        if (section.sys.contentType.sys.id === "cover") {
          const cover = section.fields as CoverProps
          return (
            <Cover
              title={cover.title}
              subTitle={cover.subTitle}
              links={cover.links}
              darkMode={cover.darkMode}
              marquee={cover.marquee}
              key={section.sys.id}
            />
          )
        } else if (section.sys.contentType.sys.id === "grid-row") {
          const fields = section.fields as GridRowContentType
          return (
            <GridRow
              darkMode={fields.darkMode}
              key={section.sys.id}
              id={fields.id}
              columns={fields.columns}
              css={css(fields.cssStyle, fields.desktopCss && { [WHEN_DESKTOP]: fields.desktopCss })}
            >
              {fields.cells.map((cell) => cellSwitch(cell, fields.darkMode, fields.columns))}
            </GridRow>
          )
        } else if (section.sys.contentType.sys.id === "horizontal") {
          const hr = section.fields as HorizontalType
          return <HR key={section.sys.id} darkMode={hr.darkMode} />
        } else if (section.sys.contentType.sys.id === "logoGallery") {
          const gallery = section.fields as LogoGallery
          return (
            <PillGallery formation={gallery.formation} list={gallery.list} key={section.sys.id} />
          )
        } else {
          console.info("no rendered for", section.sys.contentType.sys.id)
        }
      })}
    </div>
  )
}

const rootCss = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  overflow: "hidden",
  maxWidth: "100vw",
})
