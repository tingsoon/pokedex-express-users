var React = require('react');
var LayoutContainer = require('./layout.jsx');

class NewUser extends React.Component {
  render() {
    return (
    	<LayoutContainer>
	    	<div>
	    		<h1>Create New User</h1>
	    		<form action="/users/new" method="POST">
	    			<input name="email" type="text" placeholder="email" />
	    			<input name="password" type="text" placeholder="password"/>
	    			<input name="submit" type="submit" />
	    		</form>
	    	</div>
    	</LayoutContainer>
    );

  }
}

module.exports = NewUser;