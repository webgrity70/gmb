import React from 'react';
import { Link } from 'react-router-dom';

import NoBuddyCategory from './NoBuddyCategory';

const InactiveCategory = ({
  category,
  onActivatingCategory,
  canEdit,
  disabled,
}) => (
  <React.Fragment>
    {!canEdit && (
      <div className="content inactive">
        {/*
        <p className="reach-level"> Category  <br/> Unavailable. </p>
        */}
        <div>
          <div className="title">Plan</div>
          <div>2x / week</div>
        </div>
        <div className="title">Behaviors</div>
        <div className="description"> Category not yet activated.</div>
      </div>
    )}

    {canEdit && (
      <div className="content">
        <div>
          <div className="title">Plan</div>
          <div>2x / week</div>
        </div>
        <div className="title">Behaviors</div>
        <div className="description"> Click Activate Plan to set a Habit</div>
      </div>
    )}

    <NoBuddyCategory isCategoryActive={false} />
    {canEdit && (
      <div className={`no-active-actions ${category.slug}`}>
        <button
          type="button"
          className="ui button secondary active-category"
          disabled={disabled}
          onClick={() => onActivatingCategory(true)}
        >
          Activate Plan
        </button>
        <Link to="/plan/one-off" className="ui button primary create-event">
          Create Event
        </Link>
      </div>
    )}
  </React.Fragment>
);

export default InactiveCategory;
