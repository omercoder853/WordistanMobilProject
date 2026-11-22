import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const ProgressBar = ({ progress,totalProgress,percantage }) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <View style={[styles.progressBar, { width: `${percantage ? percantage : (100*progress/totalProgress)}%` }]} />
        <View style={styles.textOverlay}>
          <Text style={styles.progressText}>{percantage ? `%${Math.ceil(percantage)}` : `${progress}/${totalProgress}`} {t("completed")}</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginVertical: 7,
  },
  backgroundBar: {
    height: 18, 
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative', 
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: '#10B981',
    zIndex: 0,
    elevation: 0,
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 10,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#333', 
    letterSpacing: 0,
    paddingTop:1
  },
});

export default ProgressBar;