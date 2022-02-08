import uri from "mouri";
import { Attachment } from "./types/autumn";


const AUTUMN = `https://autumn.revolt.chat`

type AttatchmentUrlOptions = {
  width?: number
  height?: number
}
export const generateAttatchmentUrl = (attatchment: Attachment, options: AttatchmentUrlOptions = {}) => {
  return uri`${AUTUMN}/${attatchment.tag}/${attatchment._id}?${options}`
}