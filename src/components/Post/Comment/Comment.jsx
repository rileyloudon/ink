import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fetchProfilePicture } from '../../../firebase';
import './Comment.css';

const Comment = ({ commentObj, includePicture }) => {
  const [profilePicture, setProfilePicture] = useState();

  useEffect(() => {
    if (includePicture)
      fetchProfilePicture(commentObj.by).then((res) => setProfilePicture(res));
  }, [commentObj, includePicture]);

  return (
    <div className='commenter'>
      {includePicture && (
        <Link to={`/${commentObj.by}`}>
          <img src={profilePicture} alt='' />
        </Link>
      )}
      <Link to={`/${commentObj.by}`}>
        <span>{commentObj.by}</span>
      </Link>
      <p>{commentObj.comment}</p>
    </div>
  );
};

Comment.defaultProps = {
  includePicture: true,
};

Comment.propTypes = {
  commentObj: PropTypes.shape({
    by: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  includePicture: PropTypes.bool,
};

export default Comment;