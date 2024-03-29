import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { signInUser } from '../../firebase';
import { ReactComponent as AstronautSvg } from '../../img/misc/astronaut.svg';
import { ReactComponent as Spinner } from '../../img/spinner/spinner.svg';
import UserContext from '../../Context/UserContext';
import './SignIn.css';

const SignIn = ({ updateLoading, signInGuest }) => {
  const { user } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const isFormValid =
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(email) &&
    password.length >= 6;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const res = await signInUser(email, password);

    if (typeof res === 'string') {
      setSignInError(res);
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (typeof user === 'object') updateLoading(true);
  }, [user, updateLoading]);

  return (
    <div className='sign-in-container'>
      <div className='sign-in'>
        <h1 className='ink'>Ink</h1>
        <form>
          <div className='sign-in-method'>
            <input
              className='username'
              type='email'
              aria-label='Email'
              placeholder='Email'
              autoCorrect='off'
              aria-required='true'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              aria-label='Password'
              placeholder='Password'
              autoCorrect='off'
              aria-required='true'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className='sign-in-btn'
              type='submit'
              disabled={!isFormValid}
              onClick={(e) => handleSignIn(e)}
            >
              {!buttonLoading ? 'Sign In' : `Signing In`}
              {buttonLoading && <Spinner className='spinner' />}
            </button>
            <div className='or'>
              <div className='or-line' />
              <p>OR</p>
              <div className='or-line' />
            </div>
            <button className='guest-btn' type='button' onClick={signInGuest}>
              <AstronautSvg />
              Sign In as Guest
            </button>
          </div>
          <p className='sign-in-error' role='alert'>
            {signInError}
          </p>
          <Link to='/account/reset-password' className='reset-password'>
            Forgot password?
          </Link>
        </form>
      </div>

      <div className='create-account'>
        <p>
          Don&#39;t have an account?
          <Link to='/account/register'> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  updateLoading: PropTypes.func.isRequired,
  signInGuest: PropTypes.func.isRequired,
};

export default SignIn;
