import React, { useContext } from 'react';

const ProfilePageContext = React.createContext({
  profileId: null,
});

export function useProfilePageContext() {
  const ctx = useContext(ProfilePageContext);
  return ctx;
}

export function withProfilePageContext(Component) {
  const ctx = useContext(ProfilePageContext);
  return (props) => <Component {...ctx} {...props} />;
}

export default ProfilePageContext;
