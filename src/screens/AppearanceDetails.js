import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppearanceDetails = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appearance Details Screen</Text>
      <Text style={styles.text}>Key: {route.key}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default AppearanceDetails;
