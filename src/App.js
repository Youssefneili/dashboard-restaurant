import React, { useEffect, useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import axios from "axios";

function App() {
  const history = useHistory();
  const [user, setUser] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log(response); // Log the entire response object to inspect its structure
        const { access_token } = response; // Access the correct property (access_token)
        console.log(access_token);
        const res = await axios.post('/admin/login/success', { idToken: access_token });
        console.log(res.data); 
        setUser(res.data.admin); 
        history.push('/admin');
      } catch (error) {
        console.log('Login Failed:', error);
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      history.push("/admin/dashboard");
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    googleLogout();
    setUser(null);
    history.push("/");
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Logged in as {user.name}</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;