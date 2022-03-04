import { useSelector } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ck-editor';
import React from 'react';
import { CustomUploadAdapterPlugin } from './CustomUploadAdapter';
import MentionCustomization from './MentionCustomization';

const Editor = ({ setEditor, setText, placeholder }) => {
  const members = useSelector((state) => state.group.members);
  const membersFeed = members.map((member) => ({
    id: `@${member.name}`,
    name: member.name,
    userId: member.id,
    link: `/profile/${member.id}`,
  }));
  return (
    <CKEditor
      config={{
        placeholder,
        mention: {
          feeds: [
            {
              marker: '@',
              feed: membersFeed,
              minimumCharacters: 0,
            },
            {
              marker: '#',
              feed: [
                '#american',
                '#asian',
                '#baking',
                '#breakfast',
                '#cake',
                '#caribbean',
              ],
            },
          ],
        },
        mediaEmbed: {
          previewsInData: true,
        },
        extraPlugins: [CustomUploadAdapterPlugin, MentionCustomization],
      }}
      editor={ClassicEditor}
      onInit={(editor) => {
        setEditor(editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setText(data);
      }}
    />
  );
};

export default Editor;
