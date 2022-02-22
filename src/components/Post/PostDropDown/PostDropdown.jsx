import PropTypes from 'prop-types';
import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as Dots } from '../../../img/dots/dots.svg';
import './PostDropdown.css';

const PostDropdown = ({ owner, id }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const postDropDown = useRef();

  const handleClickOutside = (e) => {
    if (
      postDropDown.current &&
      !postDropDown.current.contains(e.target) &&
      e.target.tagName !== 'svg' &&
      e.target.tagName !== 'path' &&
      e.target.tagName !== 'BUTTON' &&
      document.getElementById(`${id}-dropdown`).classList.contains('displayed')
    ) {
      document.getElementById(`${id}-dropdown`).classList.remove('displayed');
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const handleClick = () => {
    const post = document.getElementById(`${id}-dropdown`);

    if (post.classList.contains('displayed'))
      document.removeEventListener('mousedown', handleClickOutside);
    else document.addEventListener('mousedown', handleClickOutside);
    post.classList.toggle('displayed');
  };

  return (
    <div ref={postDropDown} className='post-dropdown-container'>
      <Dots className='dots' onClick={handleClick} />
      <div id={`${id}-dropdown`} className='post-dropdown'>
        {owner === user.username ? (
          <>
            <button
              type='button'
              onClick={() => {
                document.removeEventListener('mousedown', handleClickOutside);
                history.push(`Edit`);
              }}
            >
              Edit Post
            </button>
            <button
              type='button'
              onClick={() => {
                document.removeEventListener('mousedown', handleClickOutside);
                // history.push('');
              }}
            >
              Delete Post
            </button>
          </>
        ) : (
          <button
            type='button'
            onClick={() => {
              document.removeEventListener('mousedown', handleClickOutside);
              history.push(`/${owner}/${id}`);
            }}
          >
            View Post
          </button>
        )}
      </div>
    </div>
  );
};

PostDropdown.propTypes = {
  owner: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default PostDropdown;