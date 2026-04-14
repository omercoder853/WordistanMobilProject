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
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333', 
  },
});

export default ProgressBar;