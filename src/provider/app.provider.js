// import { createContext } from 'react';
// import { authMethods } from '../firebase/auth.methods';

// // export const firebaseAuth = React.createContext();
// export const firebaseAuth = createContext();

// const AuthProvider = (props) => {
//   const handleSignup = () => {
//     // middle man between firebase and signup
//     console.log('handleSignup');
//     // calling signup from firebase server
//     return authMethods.signup();
//   };

//   return (
//     <firebaseAuth.Provider
//       value={{
//         handleSignup,
//       }}
//     >
//       {props.children}
//     </firebaseAuth.Provider>
//   );
// };

// export default AuthProvider;

//////////////////////////////////////////

import React from 'react';

// Creating a context for the store.
const AppContext = React.createContext({});

export default AppContext;
