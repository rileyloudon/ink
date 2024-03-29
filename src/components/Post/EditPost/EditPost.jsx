import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import UserContext from '../../../Context/UserContext';
import { deletePost, fetchIndividualPost, updatePost } from '../../../firebase';
import Loading from '../../Loading/Loading';
import './EditPost.css';

const EditPost = () => {
  const { user } = useContext(UserContext);
  const { postId } = useParams();

  const [postData, setPostData] = useState();
  const [caption, setCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);
  const [hideComments, setHideComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState();

  const [postUpdated, setPostUpdated] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    main: false,
    delete: false,
  });

  const changedData =
    typeof postData === 'object'
      ? postData.post.caption !== caption ||
        postData.post.disableComments !== disableComments ||
        postData.post.hideComments !== hideComments
      : null;

  const savePost = async () => {
    const changed = {
      caption: postData.caption !== caption,
      disableComments: postData.disableComments !== disableComments,
      hideComments: postData.hideComments !== hideComments,
    };

    setButtonLoading((prevState) => ({ ...prevState, main: true }));
    const res = await updatePost(
      postId,
      changed,
      caption,
      disableComments,
      hideComments
    );

    if (res.updated === true) {
      setPostData((prevData) => ({
        ...prevData,
        post: {
          ...prevData.post,
          caption,
          disableComments,
          hideComments,
        },
      }));
      setPostUpdated('Post Updated');
    } else {
      setError(res.err);
      setPostUpdated(false);
    }
    setButtonLoading((prevState) => ({ ...prevState, main: false }));
  };

  const handleDelete = async () => {
    setButtonLoading((prevState) => ({ ...prevState, delete: true }));
    const status = await deletePost(postData.post);
    if (status.deleted === true) {
      setConfirmDelete(false);
      setPostUpdated('Post Deleted');
    } else setError(status.err.message);
    setButtonLoading((prevState) => ({ ...prevState, delete: false }));
  };

  useEffect(() => {
    let isSubscribed = true;

    if (user) {
      (async () => {
        const res = await fetchIndividualPost(user.username, postId);
        if (isSubscribed) {
          setPostData(res);
          if (typeof res === 'object') {
            setCaption(res.post.caption);
            setDisableComments(res.post.disableComments);
            setHideComments(res.post.hideComments);
          }
        }
      })();
    }

    return () => {
      isSubscribed = false;
    };
  }, [user, postId]);

  useEffect(() => {
    if (changedData && postUpdated && postUpdated !== 'Post Deleted')
      setPostUpdated(false);
  }, [changedData, postUpdated]);

  if (postData === 'Post not found')
    return (
      <div className='edit-post-error'>
        <h2>{postData}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    );

  return postData ? (
    <>
      <section className='post-preview'>
        <figure className='post-image'>
          <img src={postData.post.imageUrl} alt='' loading='eager' />
        </figure>
        <div className='stats'>
          <p>Likes: {postData.likeCount}</p>
          <p>Comments: {postData.post.comments.length}</p>
        </div>
      </section>
      <section className='post-settings'>
        <form>
          <label htmlFor='change-caption' className='input'>
            <p>Caption</p>
            <textarea
              name='caption'
              id='change-caption'
              value={caption}
              onClick={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onChange={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
                setCaption(e.target.value);
              }}
            />
          </label>
          <label htmlFor='toggle-disable-comments' className='disable-comments'>
            <span>Disable Comments</span>
            <input
              type='checkbox'
              name='toggle-disable-comments'
              id='toggle-disable-comments'
              checked={disableComments}
              onChange={(e) => setDisableComments(e.target.checked)}
            />
            <span className='checkmark' />
          </label>
          <label htmlFor='toggle-hide-comments' className='hide-comments'>
            <span>Hide Comments</span>
            <input
              type='checkbox'
              name='toggle-hide-comments'
              id='toggle-hide-comments'
              checked={hideComments}
              onChange={(e) => setHideComments(e.target.checked)}
            />
            <span className='checkmark' />
          </label>
          {postUpdated && <p className='post-updated'>{postUpdated}</p>}
          {error && <p className='error'>{error}</p>}
          <button
            className='save'
            type='button'
            disabled={!changedData || postUpdated === 'Post Deleted'}
            onClick={savePost}
          >
            {!buttonLoading.main ? 'Save' : 'Saving'}
            {buttonLoading.main && <Spinner className='spinner' />}
          </button>
        </form>
        {!confirmDelete && (
          <button
            type='button'
            className='delete-post'
            onClick={() => setConfirmDelete(true)}
          >
            Delete Post
          </button>
        )}
        {confirmDelete && (
          <div className='confirm-delete'>
            <p>Are you sure you wish to delete this post?</p>
            <div className='delete-buttons'>
              <button
                type='button'
                className='delete'
                disabled={postUpdated === 'Post Deleted'}
                onClick={handleDelete}
              >
                {!buttonLoading.delete ? 'Delete' : 'Deleting'}
                {buttonLoading.delete && <Spinner className='spinner' />}
              </button>
              <button
                type='button'
                className='cancel'
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  ) : (
    <Loading />
  );
};

export default EditPost;
