import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  cancelFollowRequest,
  followUser,
  sendFollowRequest,
  unfollowUser,
} from '../../../firebase';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as Spinner } from '../../../img/spinner/spinner.svg';
import './Button.css';

const Button = ({ profile, updateHeader }) => {
  const { user } = useContext(UserContext);

  const [buttonLoading, setButtonLoading] = useState(false);

  if (user && profile.header.username !== user.username) {
    const userFollowsProfile = profile.header.followers.includes(user.username);
    const userRequestToFollow = profile.header.private && profile.followRequest;

    const buttonText = () => {
      if (buttonLoading) return <Spinner className='spinner' />;
      if (userRequestToFollow) return 'Requested';
      if (!userFollowsProfile) return 'Follow';
      return 'Unfollow';
    };

    const className = () => {
      if (userRequestToFollow) return 'requested';
      if (!userFollowsProfile) return 'follow';
      return 'unfollow';
    };

    const handleClick = async () => {
      setButtonLoading(true);
      if (!userFollowsProfile && !userRequestToFollow) {
        if (profile.header.private) {
          const newData = await sendFollowRequest(profile.header.username);
          updateHeader(newData, true);
        } else {
          const newData = await followUser(profile.header.username);
          updateHeader(newData, false);
        }
      } else if (userRequestToFollow) {
        const newData = await cancelFollowRequest(profile.header.username);
        updateHeader(newData, true);
      } else {
        const newData = await unfollowUser(profile.header.username);
        updateHeader(newData, false);
      }
      setButtonLoading(false);
    };

    return (
      <button onClick={handleClick} className={className()} type='button'>
        {buttonText()}
      </button>
    );
  }

  return (
    <Link to='/account/settings' className='edit'>
      Edit Profile
    </Link>
  );
};

Button.defaultPropts = {
  followRequest: null,
};

Button.propTypes = {
  profile: PropTypes.shape({
    header: PropTypes.shape({
      username: PropTypes.string.isRequired,
      followers: PropTypes.arrayOf(PropTypes.string).isRequired,
      private: PropTypes.bool.isRequired,
    }),
    followRequest: PropTypes.bool,
  }).isRequired,
  updateHeader: PropTypes.func.isRequired,
};

export default Button;
