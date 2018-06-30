var React = require('react');

class LayoutContainer extends React.Component {
  render() {

    var imgUrl = 'wallpaper.png';

    // const bodyStyle = {
    //   backgroundImage: 'url("' + imgUrl + '")'
    // }

  	return ( 
      <html>
  		  <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous" />
    			<title>Pokedex!</title>   
  		</head>
  		<body>
  			{this.props.children}
  		</body>
  	</html> );

  }
}

module.exports = LayoutContainer;