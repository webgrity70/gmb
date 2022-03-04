import React, { useContext } from 'react';

const EditableModuleCardContext = React.createContext({
  isEditMode: false,
});

export function useModuleCardContext() {
  const ctx = useContext(EditableModuleCardContext);
  return ctx;
}

export default EditableModuleCardContext;
