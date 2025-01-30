import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SkeletonPlaceholder: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <Image
        source={require('../../assets/mute2-logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.skeletonInput} />
      <View style={styles.skeletonInput} />
      <View style={styles.skeletonButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 50,
  },
  skeletonInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
  },
  skeletonButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginTop: 20,
  },
});

export default SkeletonPlaceholder;
