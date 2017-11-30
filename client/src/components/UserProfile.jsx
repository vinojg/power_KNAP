import React from 'react';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        { this.props.user.google_name }
      </div>
    );
  }
}

export default UserProfile;
