import * as hubspot from "@hubspot/api-client"
import { Attachment, FieldSet, Table } from "airtable"
import getConfig from "next/config"
import Ally, { NewMember } from "../src/alliance/AllianceMember"
import { Category } from "../src/alliance/CategoryEnum"
import addToCRM, { ListID } from "./addToCRM"
import airtableInit, { getImageURI, getWidthAndHeight, ImageSizes } from "./airtable"
import { fetchCached, MINUTE } from "./cache"

export const CATEGORY_FIELD = "Web Category*"
export const LOGO_FIELD = "Logo Upload"
export const URL_FIELD = "Company URL*"

interface Fields extends FieldSet {
  Name: string
  Approved: boolean
  [URL_FIELD]: string
  [CATEGORY_FIELD]: Category[]
  [LOGO_FIELD]: Attachment[]
}

const READ_SHEET = "MOU Tracking"
const WRITE_SHEET = "Web Requests"

export default async function getAllies() {
  return Promise.all(
    Object.keys(Category).map((category) => {
      return fetchCached(`air-${READ_SHEET}-${category}`, "en", 2 * MINUTE, () =>
        fetchAllies(category as Category)
      )
    })
  )
}

async function fetchAllies(category: Category) {
  const { serverRuntimeConfig } = getConfig()

  const hubspotClient = new hubspot.Client({ apiKey: serverRuntimeConfig.HUBSPOT_API_KEY })

  // @ts-ignore
  try {
    const apiResponse = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{ filters: [{ value: "string", propertyName: "string", operator: "EQ" }] }],
      sorts: ["string"],
      query: "string",
      properties: ["string"],
      limit: 0,
      after: 0,
    })
    console.log(JSON.stringify(apiResponse.body, null, 2))
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }

  // return getAirtable<Fields>(READ_SHEET)
  //   .select({
  //     filterByFormula: `AND(${IS_APROVED},SEARCH("${category}", {${CATEGORY_FIELD}}))`,
  //     fields: ["Name", "Approved", CATEGORY_FIELD, LOGO_FIELD, URL_FIELD],
  //     view: "Alliance Web",
  //   })
  //   .all()
  //   .then((records) => {
  //     return { name: category, records: records.map((r) => normalize(r.fields)) }
  //   })
}

function getAirtable<T extends FieldSet>(sheet: string) {
  return airtableInit(getConfig().serverRuntimeConfig.AIRTABLE_ALLIANCE_ID)(sheet) as Table<T>
}

const IS_APROVED = "Approved=1"

export function normalize(asset: Fields): Ally {
  return {
    name: asset.Name,
    logo: {
      uri: getImageURI(asset["Logo Upload"], ImageSizes.large),
      ...getWidthAndHeight(asset["Logo Upload"]),
    },
    url: asset[URL_FIELD],
  }
}

// creates entry in airtable and (if opted in) in Hubspot's Alliance list
export async function create(data: NewMember) {
  const actions: Promise<any>[] = [
    getAirtable<WebRequestFields>(WRITE_SHEET).create(convertWebToAirtable(data)),
  ]

  actions.push(
    addToCRM(
      { email: data.email, fullName: data.name, contribution: data.contribution },
      ListID.Alliance
    )
  )

  return Promise.all(actions)
}

interface WebRequestFields extends FieldSet {
  Name: string
  Email: string
  Contribution: string
  Newsletter: boolean
}

function convertWebToAirtable(input: NewMember): WebRequestFields {
  return {
    Name: input.name,
    Contribution: input.contribution,
    Newsletter: input.subscribe,
    Email: input.email,
  }
}
