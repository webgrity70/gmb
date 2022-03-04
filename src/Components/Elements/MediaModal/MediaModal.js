import React from 'react';
import { Modal } from 'semantic-ui-react';

import './MediaModal.scss';
import { isMedia, isImg, isYoutube, isVimeo } from './utils';

export default function MediaModal({ open, onClose, mediaData }) {
  const src = mediaData;

  if (!src || !isMedia(src)) {
    return null;
  }

  let vimeoId = '';
  if (isVimeo(src)) {
    const regex = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
    const match = src.match(regex);
    if (match[4]) {
      vimeoId = match[4];
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      className="MediaModal"
      dimmer="inverted"
      closeOnDimmerClick={false}
      closeIcon={{ name: 'close', color: 'grey' }}
    >
      <Modal.Content>
        {isImg(src) && <img src={src} alt="" />}
        {isYoutube(src) && (
          <iframe src={src.replace('watch?v=', 'embed/')}></iframe>
        )}
        {vimeoId && (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?h=8272103f6e`}
          ></iframe>
        )}
      </Modal.Content>
    </Modal>
  );
}
