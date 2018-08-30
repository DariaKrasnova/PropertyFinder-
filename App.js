import React, {Component} from 'react';
import { StyleSheet, NavigatorIOS} from 'react-native';
import SearchPage from './SearchPage';


export default class PropertyFinderApp extends Component {
  render() {
    return (
      <NavigatorIOS
          initialRoute={{
          title: 'Поиск',
          component: SearchPage,
        }}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


