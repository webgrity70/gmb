/* eslint-disable react/destructuring-assignment */

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';
import CardButton from '../CardButton';
import ModuleCardContext, {
  useModuleCardContext,
} from './EditableModuleCard.context';

function EditableModuleCard(props) {
  const { form, ...rest } = props;
  const [uncontrolledIsEditMode, setUncontrolledEditMode] = useState(false);
  const isEditMode = props.isEditMode || uncontrolledIsEditMode;
  const setEditMode = props.onSetEditMode || setUncontrolledEditMode;
  const contextValue = useMemo(
    () => ({
      isEditMode,
    }),
    [isEditMode]
  );

  return (
    <ModuleCardContext.Provider value={contextValue}>
      <ModuleCard
        {...rest}
        footer={
          <CardFooter
            isEditMode={isEditMode}
            setEditMode={setEditMode}
            form={form}
          />
        }
      />
    </ModuleCardContext.Provider>
  );
}

EditableModuleCard.propTypes = {
  form: PropTypes.shape({}),
  isEditMode: PropTypes.bool,
  onSetEditMode: PropTypes.func,
};

function CardFooter({ form, setEditMode, isEditMode }) {
  function onCancel() {
    form.resetForm();
    setEditMode(false);
  }

  return (
    <div className="flex">
      <div className="ml-auto">
        {isEditMode ? (
          <div className="flex">
            <CardButton onClick={onCancel}>Cancel</CardButton>
            <CardButton
              onClick={form.handleSubmit}
              disabled={!form.isValid || form.isSubmitting}
            >
              Save
            </CardButton>
          </div>
        ) : (
          <CardButton onClick={() => setEditMode(true)}>Edit</CardButton>
        )}
      </div>
    </div>
  );
}

CardFooter.propTypes = {
  form: PropTypes.shape({}),
  setEditMode: PropTypes.func,
  isEditMode: PropTypes.bool,
};

EditableModuleCard.InfoContent = function ({ children }) {
  const { isEditMode } = useModuleCardContext();
  if (isEditMode) {
    return null;
  }
  return <>{children}</>;
};

EditableModuleCard.InfoContent.propTypes = {
  children: PropTypes.node,
};

EditableModuleCard.EditContent = function ({ children }) {
  const { isEditMode } = useModuleCardContext();
  if (!isEditMode) {
    return null;
  }
  return <>{children}</>;
};

EditableModuleCard.EditContent.propTypes = {
  children: PropTypes.node,
};

export default EditableModuleCard;
