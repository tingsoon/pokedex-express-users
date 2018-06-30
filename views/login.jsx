var React = require('react');
var LayoutContainer = require('./layout.jsx');

class Login extends React.Component {
  render() {
    return (
    	<LayoutContainer>
	    	<div>
	    		<div>
		    		<h1>LOGIN</h1>
		    		<form action="/users/login" method="POST">
		    			<input name="email" type="text" placeholder="email" />
		    			<input name="password" type="text" placeholder="password"/>
		    			<input name="submit" type="submit" />
		    		</form>
	    		</div>
	    		<p></p>
	    		<div>
		    		<form className="createuser" method="GET" action='/users/new'>
	                <input type="hidden" name="createuser" />
	                <div className="buttonDiv">
	                	<input className="createuser" type="submit" value="Create User" />
		            </div>
		            </form>
       		   </div>
	    	</div>
    	</LayoutContainer>
    );

  }
}

module.exports = Login;