var React = require('react');
var LayoutContainer = require('./layout.jsx');

class ShowPokemon extends React.Component {
  render() {

  	const imgStyle = {
		backgroundColor: '#F2F2F2',
		'text-align': 'center',
		'margin': '50px 0',
  	}

  	let formActionEdit = '/pokemon/' + this.props.id + '/edit?_method=PUT';
  	let formActionDelete = '/pokemon/' + this.props.id + '/delete?_method=DELETE';


    return (
    	<LayoutContainer>
 			<div className="container">
 				<div className="col-sm pic_container" style={imgStyle}>
		      	<img src ={this.props.img} />
		      	</div>
		      	<div className="col-sm information">
		      	<h1>{this.props.name}</h1>
		      	<ul>
		      	<li>Id : {this.props.id} </li>
		      	<li>Num : {this.props.num} </li>
		      	<li>Weight : {this.props.weight} </li>
		      	<li>Height : {this.props.height} </li>
		      	</ul>
		      	</div>
		      	<div className="col-sm buttons">
		      	<form method="GET" action={formActionEdit}>
		      	<button type="submit">EDIT</button>
		      	</form>
		      	<p></p>
		      	<form method="POST" action={formActionDelete}>
		      	<button type="submit">DELETE</button>
		      	</form>
		      	</div>
		      	<p></p>
		      	<div>
		            <form className="home" method="POST" action="/pokemon/sortId?_method=PUT">
                      <input type="hidden" name="home" />
                      <div className="buttonDiv">
                          <input className="Home" type="submit" value="Go Back to Pokedex." />
                      </div>
                  	</form>
		        </div>
	      	</div>
	    </LayoutContainer>
     
    );
  }
}

module.exports = ShowPokemon;