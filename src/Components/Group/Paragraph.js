import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

class Paragraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
    };
  }

  handleShowMore = () => {
    const { showMore } = this.state;
    this.setState({ showMore: !showMore });
  };

  paragraphHeight = () => {
    const { hasPermission, text } = this.props;

    if (!hasPermission && text.length > 1000) {
      return '-midd-height';
    } else if (hasPermission && text.length > 350) {
      return '-small-height';
    } else {
      return '-full-height';
    }
  };

  render() {
    const { text, title } = this.props;

    const { showMore } = this.state;

    return (
      <div className="paragraph">
        <h2 className="paragraph__title">{title}</h2>

        <p
          className={`paragraph__text${
            (showMore && '-full-height') || this.paragraphHeight()
          }`}
        >
          {text}
        </p>
        {!showMore && this.paragraphHeight() !== '-full-height' ? (
          <div className="paragraph__gradient-bg" />
        ) : null}
        {this.paragraphHeight() !== '-full-height' ? (
          <div className="paragraph__btn-container">
            <button className="paragraph__btn" onClick={this.handleShowMore}>
              {showMore ? (
                <span>
                  less
                  <Icon name="angle up" />
                </span>
              ) : (
                <span>
                  more
                  <Icon name="angle down" />
                </span>
              )}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Paragraph;
