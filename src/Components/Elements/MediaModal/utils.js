export function isMedia(val) {
  return isImg(val) || isVid(val);
}

export function isImg(val) {
  const regex = /(http(s?):)([/|.|#|(|)|:|\w|\s|-])*\.(?:jpg|gif|png)/g;
  return regex.test(val);
}

export function isVid(val) {
  return isYoutube(val) || isVimeo(val);
}

export function isYoutube(val) {
  const regex = /^(?:https?:\/\/)?(?:(?:www\.)?youtube.com\/watch\?v=|youtu.be\/)((\w|-)+)$/;
  return regex.test(val);
}

export function isVimeo(val) {
  const regex = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
  return regex.test(val);
}
