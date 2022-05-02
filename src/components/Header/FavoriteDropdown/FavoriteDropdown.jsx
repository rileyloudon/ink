import { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import { ReactComponent as FavoriteOutline } from '../../../img/favorite/favorite-outline.svg';
import { ReactComponent as FavoriteFilled } from '../../../img/favorite/favorite-filled.svg';
import './FavoriteDropdown.css';

const FavoriteDropdown = ({
  favoriteDropdownOpen,
  changeFavoriteDropdownOpen,
}) => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const favoriteDropdownRef = useRef(null);

  const handleClick = () => changeFavoriteDropdownOpen(!favoriteDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        favoriteDropdownRef.current !== null &&
        !favoriteDropdownRef.current.contains(e.traget)
      ) {
        changeFavoriteDropdownOpen(!favoriteDropdownOpen);
      }
    };

    if (favoriteDropdownOpen)
      window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [favoriteDropdownOpen, changeFavoriteDropdownOpen]);

  return (
    <div className='favorite-dropdown-container'>
      {favoriteDropdownOpen ? (
        <FavoriteFilled onClick={handleClick} />
      ) : (
        <FavoriteOutline onClick={handleClick} />
      )}
      <div
        ref={favoriteDropdownRef}
        className={`favorite-dropdown ${
          favoriteDropdownOpen ? 'displayed' : ''
        }`}
      >
        {user.private && (
          <button
            type='button'
            onClick={() => {
              history.push('/settings/follow-requests');
            }}
          >
            {user.followRequests} Follow Request
            {user.followRequests === 1 ? '' : 's'}
          </button>
        )}
        <button
          type='button'
          onClick={() => {
            history.push(`/${user.username}/new-likes`);
          }}
        >
          {user.newLikes.length} New Like{user.newLikes.length === 1 ? '' : 's'}
        </button>
        <button
          type='button'
          onClick={() => {
            history.push(`/${user.username}/new-followers`);
          }}
        >
          {user.newFollowers.length} New Follower
          {user.newFollowers.length === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  );
};

FavoriteDropdown.propTypes = {
  favoriteDropdownOpen: PropTypes.bool.isRequired,
  changeFavoriteDropdownOpen: PropTypes.func.isRequired,
};

export default FavoriteDropdown;