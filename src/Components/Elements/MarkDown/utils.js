/* eslint-disable no-useless-escape */
import urlRegex from 'url-regex';

export const PROFILE = 'profile';
export const GROUPS = 'groups';
export const FLASH = 'flash';
export const CHALLENGES = 'challenges';

const profilesPaths = [PROFILE, GROUPS, FLASH, CHALLENGES];
const linkRegex = urlRegex({ strict: false });

const originUrl = window.location.origin.replace(/(https:|http:)\/\//, '');

export const profileRegex = new RegExp(
  `${originUrl}\\/(profile|groups|challenges)\\/((flash\\/))*\\d+`,
  'g'
);

export function handleBasicSource(text, resources) {
  return (text || '')
    .replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>$1</b>')
    .replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, '<i>$1</i>')
    .replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>')
    .replace(linkRegex, (url) => {
      let hyperlink = url;
      if (!/^https?:\/\//.test(hyperlink)) {
        hyperlink = `http://${hyperlink}`;
      }
      const link = `<a href="${hyperlink}" target="_blank">${url}</a>`;
      if (url.match(profileRegex)) {
        const paths = url.split('/');
        const id = parseInt(paths.pop(), 10);
        const type = paths.pop();
        if (profilesPaths.includes(type)) {
          const resource = resources.find(
            (e) => e.id === id && e.type === type
          );
          if (resource && resource.data) {
            const profileUrl = (() => {
              if (type === FLASH)
                return `${window.location.origin}/challenges/${type}/${id}`;
              return `${window.location.origin}/${type}/${id}`;
            })();
            const profileLink = `<a href="${profileUrl}" target="_blank">${resource.data.name}</a>`;
            if (type === PROFILE || !resource.data.icon) return profileLink;
            return `<span><img src="${resource.data.icon}" style="width: 20px; height: 20px; margin: -2px 2px 0 2px; border-radius: 50%;"/>${profileLink}</span>`;
          }
          if (resource && !resource.data && resource.loaded) return link;
          return 'Loading...';
        }
        return link;
      }
      return link;
    })
    .replace(/(\r?\n|\r)$/, '');
}
