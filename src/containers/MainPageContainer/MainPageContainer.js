import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class MainPageContainer extends PureComponent {
  render() {
    return (
      <div>
        lang: {this.props.lang}
        <Link to="/test">test</Link>
      </div>
    );
  }
}

MainPageContainer.propTypes = {
  lang: PropTypes.string,
};

const mapStateToProps = state => ({
  lang: state.intl.lang
});

export default connect(mapStateToProps)(MainPageContainer);
