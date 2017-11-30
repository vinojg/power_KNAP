import React from 'react';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main role="main">
        <div className="starter-template">
          <section className="jumbotron text-center">
            <div className="container">
              <p><img className="img-thumbnail" src={ this.props.user.google_avatar }></img></p>
              <h1 className="jumbotron-heading">{ this.props.user.google_name }</h1>
            </div>
          </section>
        </div>

      </main>
    );
  }
}

export default UserProfile;
