import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, TouchableHighlight, Image, ActivityIndicator} from 'react-native';
import SearchResults from './SearchResults';

function urlForQueryAndPage(key, value, pageNumber) {
    data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };
    data[key] = value;
   
    querystring = Object.keys(data)
      .map(key => key + '=' + encodeURIComponent(data[key]))
      .join('&');
   
    return 'https://api.nestoria.co.uk/api?' + querystring;
  };


export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          searchString: 'london',
          message: '',
          isLoading: false
          
        };
      }

      onSearchTextChanged(event) {
        console.log('onSearchTextChanged');
        this.setState({ searchString: event.nativeEvent.text });
        console.log(this.state.searchString);
      }

      _executeQuery(query) {
        console.log(query);
        this.setState({ isLoading: true });
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error =>
                this.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            }));
      }
       
      onSearchPressed() {
        query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
      }

      _handleResponse(response) {
        this.setState({ isLoading: false , message: '' });
        if (response.application_response_code.substr(0, 1) === '1') {
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings}
              });
        } else {
          this.setState({ message: 'Location not recognized; please try again.'});
        }
      }

      onLocationPressed() {
        navigator.geolocation.getCurrentPosition(
          location => {
            let search = location.coords.latitude + ',' + location.coords.longitude;
            this.setState({ searchString: search });
            let query = urlForQueryAndPage('centre_point', search, 1);
            this._executeQuery(query);
          },
          error => {
            this.setState({
              message: 'There was a problem with obtaining your location: ' + error
            });
          });
      }

    render() {
        spinner = this.state.isLoading ?
        ( <ActivityIndicator
            size='large'/> ) :
        ( <View/>);
        console.log('SearchPage.render');
        
      return (
    <View style={styles.container2}>
        <View style={styles.container}>
          <Text style={styles.description}>
            Search for houses to buy!
          </Text>
          <Text style={styles.description}>
            Search by place-name, postcode or search near your location.
          </Text>
        </View>
        <View style={styles.flowRight}>
                <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholder='Поиск по имени или почтовому индексу'/>
                <TouchableHighlight style={styles.buttonNew}
                        onPress={this.onSearchPressed.bind(this)}
                        underlayColor='#99d9f4'> 
                        <Text style={styles.buttonText}>Go</Text>
                </TouchableHighlight>
         </View>
        <View style={styles.container3}>
                <TouchableHighlight style={styles.button2}
                        onPress={this.onLocationPressed.bind(this)}
                        underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>location</Text>   
                </TouchableHighlight>
                </View>
                <Image source={require('./house.jpg')} style={styles.image}/>
                <Text style={styles.description}>{this.state.message}</Text>
                {spinner}
    </View>

      );
    }
  }

const styles = StyleSheet.create({
    description: {
      marginBottom: 30,
      fontSize: 18,
      textAlign: 'center',
      color: '#656565'
    },
    container: {
      padding: 10,
      marginTop: 10,
      alignItems: 'center'
    },
    container2: {
        height: 100,
        padding: 30,
        marginTop: 65,
        alignItems: 'center',
        flex: 1
    },
    container3: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 7
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    buttonNew: {
        height: 36,
        flex: 1,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
      },
      button2: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
      },
      searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC'
      },
      image: {
        width: 220,
        height: 151
      }
  });