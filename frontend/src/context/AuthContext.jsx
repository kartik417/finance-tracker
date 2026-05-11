import {
   createContext,
   useState
} from "react";

export const AuthContext =
   createContext();

function AuthProvider({ children }) {

   const [token, setToken] = useState(
      localStorage.getItem("token")
   );

   const [role, setRole] = useState(
      localStorage.getItem("role")
   );

   const login = (newToken, newRole) => {

      localStorage.setItem(
         "token",
         newToken
      );

      localStorage.setItem(
         "role",
         newRole
      );

      setToken(newToken);

      setRole(newRole);

   };

   const logout = () => {

      localStorage.removeItem("token");

      localStorage.removeItem("role");

      setToken(null);

      setRole(null);

   };

   return (

      <AuthContext.Provider
         value={{
            token,
            role,
            login,
            logout
         }}
      >

         {children}

      </AuthContext.Provider>

   );
}

export default AuthProvider;