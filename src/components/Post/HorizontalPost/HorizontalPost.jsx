import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchIndividualPost, toggleLikePost } from '../../../firebase';
import Comment from '../Comment/Comment';
import ButtonBar from '../ButtonBar/ButtonBar';
import AddComment from '../AddComment/AddComment';
import Loading from '../../Loading/Loading';
import Likes from '../Likes/Likes';
import DatePosted from '../DatePosted/DatePosted';
import Caption from '../Caption/Caption';
import Owner from '../Owner/Owner';
import UserContext from '../../../Context/UserContext';
import './HorizontalPost.css';

const HorizontalPost = ({ modal }) => {
  const modalRef = useRef();

  const { user } = useContext(UserContext);

  const { username, postId } = useParams();
  const history = useHistory();

  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(true);

  const addNewComment = (comment) => {
    setPostData((prevState) => ({
      ...prevState,
      post: {
        ...prevState.post,
        comments: [...prevState.post.comments, comment],
      },
    }));
  };

  const deleteDisplayedComment = (commentToDelete) => {
    const postComments = [...postData.post.comments];
    const tempArray = postComments.filter(
      (comment) => comment !== commentToDelete
    );

    setPostData((prevState) => ({
      ...prevState,
      post: {
        ...prevState.post,
        comments: tempArray,
      },
    }));
  };

  const likePost = async () => {
    if (postData.userLikes) {
      setPostData((prevState) => ({
        ...prevState,
        likeCount: prevState.likeCount - 1,
        userLikes: false,
      }));
    } else {
      setPostData((prevState) => ({
        ...prevState,
        likeCount: prevState.likeCount + 1,
        userLikes: true,
      }));
    }

    await toggleLikePost(postData.post);
  };

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modal]);

  useEffect(() => {
    let isSubscribed = true;

    if (user)
      (async () => {
        const res = await fetchIndividualPost(username, postId);
        if (isSubscribed) {
          setPostData(res);
          setLoading(false);
        }
      })();

    return () => {
      isSubscribed = false;
    };
  }, [username, postId, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        history.goBack();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [history]);

  const renderPost = () => {
    return postData === 'Post not found' || postData === 'User not found' ? (
      <div className='horizontal-post-error'>
        <h2>{postData}.</h2>
        <p>Please double check the URL to make sure it&#39;s correct.</p>
      </div>
    ) : (
      <>
        {modal && <div className='post-backdrop' />}
        <article
          ref={modal ? modalRef : null}
          className={modal ? 'horizontal-view modal-view' : 'horizontal-view'}
        >
          <figure className='post-image' onDoubleClick={likePost}>
            <img src={postData.post.imageUrl} alt='' loading='eager' />
          </figure>
          <section className='side-bar'>
            <Owner
              owner={postData.post.owner}
              profilePicture={postData.photoURL}
              id={postData.post.id}
            />
            <section className='comments'>
              <Caption
                owner={postData.post.owner}
                photoURL={postData.photoURL}
                caption={postData.post.caption}
              />
              {postData.post.hideComments ? (
                <span className='comments-hidden'>
                  {postData.post.owner} has hidden the comments
                </span>
              ) : (
                postData.post.comments.map((commentObj) => (
                  <Comment
                    key={commentObj.key}
                    post={postData.post}
                    commentObj={commentObj}
                    deleteDisplayedComment={deleteDisplayedComment}
                  />
                ))
              )}
            </section>
            <ButtonBar
              userLikes={postData.userLikes}
              likePost={likePost}
              disableComments={postData.post.disableComments}
              postId={postData.post.id}
            />
            <Likes likeCount={postData.likeCount} />
            <DatePosted timestamp={postData.post.timestamp} />
            {!postData.post.disableComments && (
              <AddComment addNewComment={addNewComment} post={postData.post} />
            )}
          </section>
        </article>
      </>
    );
  };

  return loading ? <Loading /> : renderPost();
};

HorizontalPost.defaultProps = {
  modal: false,
};

HorizontalPost.propTypes = {
  modal: PropTypes.bool,
};

export default HorizontalPost;
