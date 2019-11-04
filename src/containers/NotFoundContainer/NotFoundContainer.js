import React, { Component } from 'react';

export default class NotFoundContainer extends Component {
  render() {
    return (
      <div className="errors">
        <div className="row f-grey error">
          <div className="col img">
            <i className="error-1" />
          </div>
          <div className="col info">
            <p className="num">404</p>
            <p className="ttl">Страница не найдена</p>
            <p className="desc">Возможно, запрошенная страница временно<br />недоступна или удалена</p>
          </div>
        </div>
        <div className="row arrow">
          <div className="col" />
        </div>
      </div>
    );
  }
}
