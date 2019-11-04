import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeLang } from 'reducers/intl';

class MainPageContainer extends PureComponent {
  render() {
    return (
      <div>
        test {this.props.lang}
        <button onClick={this.props.changeLang('uk')}>change to uk</button>
        <button onClick={this.props.changeLang('ru')}>change to ru</button>
      </div>
    );
  }
}

MainPageContainer.propTypes = {
  lang: PropTypes.string,
  changeLang: PropTypes.func,
};

const mapStateToProps = state => ({
  lang: state.intl.lang
});

export default connect(mapStateToProps, { changeLang })(MainPageContainer);
