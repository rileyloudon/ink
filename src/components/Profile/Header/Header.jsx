import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './Header.css';

const Header = ({ profile, isUsersProfile, updateProfile }) => {
  return (
    <header className='profile-header'>
      <div className='left'>
        <img className='picture' src={profile.photoURL} alt='' />
      </div>
      <section className='right'>
        <div className='top'>
          <h3 className='username'>{profile.username}</h3>
          <Button
            profile={profile}
            isUsersProfile={isUsersProfile}
            updateProfile={updateProfile}
          />
        </div>
        <ul className='stats'>
          <li>
            <span>{profile.posts.length}</span> post
            {profile.posts.length === 1 ? '' : 's'}
          </li>
          <li>
            <span>{profile.followers.length}</span> follower
            {profile.followers.length === 1 ? '' : 's'}
          </li>
          <li>
            <span>{profile.following.length}</span> follow
            {profile.following.length === 1 ? '' : 'ing'}
          </li>
        </ul>
        <div className='info'>
          <h4>{profile.fullName}</h4>
          <p>{profile.bio}</p>
        </div>
      </section>
    </header>
  );
};

Header.propTypes = {
  profile: PropTypes.shape({
    photoURL: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf.isRequired,
    followers: PropTypes.arrayOf.isRequired,
    following: PropTypes.arrayOf.isRequired,
    fullName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
  isUsersProfile: PropTypes.bool.isRequired,
  updateProfile: PropTypes.func.isRequired,
};

export default Header;
