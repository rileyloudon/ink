import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { searchUsers } from '../../firebase';
import './Search.css';

const Search = ({ updateCurrentSelectedUser }) => {
  const searchResultsRef = useRef(null);
  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState();
  const [resultsOpen, setResultsOpen] = useState(false);

  const handleClick = async () => {
    setResultsOpen(true);

    if (!results) {
      const matchingUsers = await searchUsers('');
      setResults(matchingUsers);
    }
  };

  const handleSearch = async (e) => {
    setSearchString(e.target.value);

    const matchingUsers = await searchUsers(e.target.value);
    setResults(matchingUsers);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchResultsRef.current !== null &&
        !searchResultsRef.current.contains(e.traget) &&
        e.target.className !== 'search-box'
      ) {
        setResultsOpen(false);
      }
    };

    if (resultsOpen) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [resultsOpen]);

  const displaySearchResult = (user) => {
    if (updateCurrentSelectedUser) {
      return (
        <button
          className='search-item'
          type='button'
          key={user.username}
          onClick={() =>
            updateCurrentSelectedUser({
              username: user.username,
              photoURL: user.photoURL,
            })
          }
        >
          <img src={user.photoURL} alt='' />
          <span>{user.username}</span>
        </button>
      );
    }

    return (
      <Link
        className='search-item'
        to={`/${user.username}`}
        key={user.username}
      >
        <img src={user.photoURL} alt='' />
        <span>{user.username}</span>
      </Link>
    );
  };

  return (
    <div className='search'>
      <input
        className='search-box'
        type='text'
        placeholder='Search'
        autoCapitalize='none'
        value={searchString}
        onClick={handleClick}
        onChange={(e) => handleSearch(e)}
      />
      <div
        ref={searchResultsRef}
        className={`search-results ${resultsOpen ? 'displayed' : ''}`}
      >
        {results && results.map((user) => displaySearchResult(user))}
      </div>
    </div>
  );
};

export default Search;

Search.defaultProps = {
  updateCurrentSelectedUser: null,
};

Search.propTypes = {
  updateCurrentSelectedUser: PropTypes.func,
};