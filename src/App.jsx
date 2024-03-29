import { useEffect, useState, useRef } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Home from './components/Home';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';
import AddPost from './components/AddPost/AddPost';
import HorizontalPost from './components/Post/HorizontalPost/HorizontalPost';
import LikedFeed from './components/LikedFeed/LikedFeed';
import UserContext from './Context/UserContext';
import ThemeContext from './Context/ThemeContext';
import Settings from './components/Settings/Settings';
import FollowRequests from './components/FollowRequests/FollowRequests';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import EditPost from './components/Post/EditPost/EditPost';
import NewFollowers from './components/NewFollowers/NewFollowers';
import NewLikes from './components/NewLikes/NewLikes';
import PrivateRoute from './PrivateRoute';
import { fetchUserData, setupAnon, setupUser, signInAnon } from './firebase';
import './App.css';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light';
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || fallbackTheme
  );

  const [user, setUser] = useState();
  const newUserData = useRef(null);

  const [loading, setLoading] = useState(
    JSON.parse(localStorage.getItem('userWillSignIn')) || false
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);

  const updateNewUserData = (value) => {
    newUserData.current = value;
  };
  const updateLoading = (value) => setLoading(value);
  const updateAddModal = (value) => setShowAddModal(value);
  const updateScrollPosition = (value) => setScrollPosition(value);

  const signInGuest = async () => {
    setLoading(true);
    await signInAnon();
  };

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (newUserData.current) {
          await setupUser(newUserData.current);
          newUserData.current = null;
        }
        if (currentUser.isAnonymous) await setupAnon();

        const res = await fetchUserData();

        setLoading(false);
        setUser(res);

        if (!localStorage.getItem('userWillSignIn'))
          localStorage.setItem('userWillSignIn', 'true');
      } else {
        setUser();
        localStorage.removeItem('userWillSignIn');
      }
      return () => unsub;
    });
  }, []);

  useEffect(() => {
    document.querySelector('html').style.backgroundColor =
      theme === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(250, 250, 250)';
  }, [theme]);

  return (
    <div className='App' data-theme={theme}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          {user && (
            <Header
              updateAddModal={updateAddModal}
              showAddModal={showAddModal}
            />
          )}
          <Switch location={background || location}>
            <PrivateRoute exact path='/direct/chat'>
              <Chat loading={loading} />
            </PrivateRoute>
            <PrivateRoute exact path='/account/follow-requests'>
              <FollowRequests />
            </PrivateRoute>
            <PrivateRoute exact path='/account/settings'>
              <Settings />
            </PrivateRoute>
            <PrivateRoute exact path='/account/liked'>
              <LikedFeed />
            </PrivateRoute>
            <PrivateRoute exact path='/account/new-followers'>
              <NewFollowers />
            </PrivateRoute>
            <PrivateRoute exact path='/account/new-likes'>
              <NewLikes />
            </PrivateRoute>
            <PrivateRoute exact path='/account/:postId/edit'>
              <EditPost />
            </PrivateRoute>
            <Route
              exact
              path='/'
              render={() => (
                <Home
                  updateLoading={updateLoading}
                  loading={loading}
                  signInGuest={signInGuest}
                />
              )}
            />
            <Route
              exact
              path='/account/reset-password'
              render={() => <ForgotPassword />}
            />
            <Route
              exact
              path='/account/register'
              render={() => (
                <Register
                  updateLoading={updateLoading}
                  signInGuest={signInGuest}
                  updateNewUserData={updateNewUserData}
                />
              )}
            />
            <PrivateRoute exact path='/:username/:postId'>
              <HorizontalPost />
            </PrivateRoute>
            <PrivateRoute path='/:username'>
              <Profile
                scrollPosition={scrollPosition}
                updateScrollPosition={updateScrollPosition}
              />
            </PrivateRoute>
          </Switch>
          {showAddModal && <AddPost updateAddModal={updateAddModal} />}
          {background && (
            <Route path='/:username/:postId'>
              <HorizontalPost modal />
            </Route>
          )}
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
