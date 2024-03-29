import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { fetchProfilePicture } from '../../firebase';
import Loading from '../Loading/Loading';
import './NewLikes.css';

const NewLikes = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [mergedNewLikes, setMergedNewLikes] = useState();

  useEffect(() => {
    let isSubscribed = true;

    if (user) {
      (async () => {
        const res = await fetchProfilePicture(user.newLikes);

        const merged = [];

        for (let i = 0; i < user.newLikes.length; i += 1) {
          merged.push({
            ...user.newLikes[i],
            ...res.find((item) => item.username === user.newLikes[i].username),
          });
        }

        if (isSubscribed) {
          setMergedNewLikes(merged);
          setLoading(false);
        }
      })();
    }
    return () => {
      isSubscribed = false;
    };
  }, [user]);

  if (!user) return null;

  return loading ? (
    <Loading />
  ) : (
    <div className='new-likes'>
      <div className='title'>
        <h3>New Likes</h3>
        <p>(since last login)</p>
      </div>
      <div className='likes'>
        {mergedNewLikes.map((like) => (
          <div className='like' key={like.username + like.postId}>
            <Link to={`/${like.username}`}>
              <img className='profile-picture' src={like.photoURL} alt='' />
              <span>{like.username}</span>
            </Link>
            <span> liked post </span>
            <Link to={`${like.postId}`}>
              <img className='post-photo' src={like.postPhoto} alt='' />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewLikes;
