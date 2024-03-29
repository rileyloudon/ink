import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './Header.css';

const Header = ({ profile, updateHeader }) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleRezise = () => setWindowSize(window.innerWidth);

    window.addEventListener('resize', handleRezise);
    return () => window.removeEventListener('resize', handleRezise);
  }, []);

  return windowSize > 735 ? (
    <header className='profile-header'>
      <div className='left'>
        <img className='picture' src={profile.header.photoURL} alt='' />
      </div>
      <section className='right'>
        <div className='top'>
          <h3 className='username'>{profile.header.username}</h3>
          <Button profile={profile} updateHeader={updateHeader} />
        </div>
        <ul className='stats'>
          <li>
            <span>{profile.header.postCount}</span>
            {` post${profile.header.postCount === 1 ? '' : 's'}`}
          </li>
          <li>
            <span>{profile.header.followers.length}</span>
            {` follower${profile.header.followers.length === 1 ? '' : 's'}`}
          </li>
          <li>
            <span>{profile.header.following.length}</span>
            {` follow${profile.header.following.length === 1 ? '' : 'ing'}`}
          </li>
        </ul>
        <div className='info'>
          <h4>{profile.header.fullName}</h4>
          <p>{profile.header.bio}</p>
        </div>
      </section>
    </header>
  ) : (
    <header className='profile-header'>
      <section className='top'>
        <img className='picture' src={profile.header.photoURL} alt='' />
        <div className='right'>
          <h3 className='username'>{profile.header.username}</h3>
          <Button profile={profile} updateHeader={updateHeader} />
        </div>
      </section>
      <ul className='stats'>
        <li>
          <span>{profile.header.postCount}</span>
          {` post${profile.header.postCount === 1 ? '' : 's'}`}
        </li>
        <li>
          <span>{profile.header.followers.length}</span>
          {` follower${profile.header.followers.length === 1 ? '' : 's'}`}
        </li>
        <li>
          <span>{profile.header.following.length}</span>
          {` follow${profile.header.following.length === 1 ? '' : 'ing'}`}
        </li>
      </ul>
      <div className='info'>
        <h4>{profile.header.fullName}</h4>
        <p>{profile.header.bio}</p>
      </div>
    </header>
  );
};

Header.propTypes = {
  profile: PropTypes.shape({
    header: PropTypes.shape({
      photoURL: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      followers: PropTypes.arrayOf(PropTypes.string).isRequired,
      following: PropTypes.arrayOf(PropTypes.string).isRequired,
      fullName: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      postCount: PropTypes.number,
    }),
  }).isRequired,
  updateHeader: PropTypes.func.isRequired,
};

export default Header;
