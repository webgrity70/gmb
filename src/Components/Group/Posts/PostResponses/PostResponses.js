import { Button } from 'semantic-ui-react';
import React, { useCallback, useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import InfiniteScroll from 'react-infinite-scroller';
import PostResponseSingle from '../PostResponseSingle';
import './PostResponses.scss';
import { useSelector } from 'react-redux';
import { usePostService } from '../../../../Services/GroupsService';
import Loading from '../../../Loading';
import Editor from '../PostEditor';

const bem = BEMHelper({ name: 'PostResponses', outputIsString: true });

const PostResponses = ({
  postId,
  groupId,
  userId,
  getMoreResponses,
  initialResponseCount,
}) => {
  const responsePagination = useSelector(
    (state) => state.pagination.groupPostResponses
  )[postId];
  const responses = useSelector((state) => state.group.responses)[postId];
  const {
    createPostResponse,
    deletePostResponse,
    getPostDetails,
    editPostResponse,
  } = usePostService();
  const [responseCount, setResponseCount] = useState(initialResponseCount);
  const [responding, setResponding] = useState(false);

  const [editor, setEditor] = useState();
  const [text, setText] = useState('');

  const getDetails = useCallback(() => {
    getPostDetails({ groupId, postId })
      .then((details) => {
        setResponseCount(details.responses);
      })
      .catch((e) => console.log(e));
  }, []);

  const onCreateResponse = () => {
    setResponding(true);
    createPostResponse({
      postId,
      group: groupId,
      text,
      userId,
    })
      .then(() => {
        getDetails();
      })
      .then(() => {
        setText('');
        editor.setData('');
        setResponding(false);
      });
  };

  const handleEdit = (text, responseId, callbackFn) => {
    editPostResponse({
      text,
      postId,
      responseId,
      group: groupId,
      user: userId,
    }).then(() => callbackFn());
  };
  const onDeleteResponse = (responseId) => {
    deletePostResponse({ postId, group: groupId, responseId }).then(() => {
      getDetails();
    });
  };

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  if (!responses) {
    return <Loading />;
  }

  const nextPage = responsePagination.next;

  const sortedResponses = Object.values(responses).sort((a, b) => b.id - a.id);

  return (
    <div className={bem()}>
      <div className={bem('header')}>
        <Editor
          setEditor={setEditor}
          setText={setText}
          placeholder="Enter what you are thinking"
        />
        <Button
          basic
          color="orange"
          content={responding ? 'Responding' : 'Respond'}
          onClick={() => onCreateResponse()}
          disabled={!text || responding}
        />
      </div>
      <div className={bem('count')}>
        <i className="fas fa-bullseye mr-2" />
        {responseCount} response{responseCount === 1 ? '' : 's'}
      </div>
      <div className={bem('list')}>
        <InfiniteScroll
          pageStart={0}
          hasMore={!!nextPage}
          loadMore={() => getMoreResponses(postId, nextPage)}
          loader={<Loading />}
          threshold={100}
          useWindow={false}
          getScrollParent={() =>
            document.getElementsByClassName('TabsContainer__body')[0]
          }
        >
          {sortedResponses.map((response) => (
            <PostResponseSingle
              key={response.id}
              response={response}
              isOwner={userId === response.user.id}
              onDelete={() => onDeleteResponse(response.id)}
              handleEdit={handleEdit}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PostResponses;
