import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBarWithText = ({ progress }) => {
  return (
    <View style={styles.container}>
      {/* Ana Bar Kapsayıcısı */}
      <View style={styles.backgroundBar}>
        
        {/* İlerleyen Renkli Kısım */}
        <View style={[styles.progressBar, { width: `${progress}%` }]} />

        {/* Üzerine Binen Metin */}
        <View style={styles.textOverlay}>
          <Text style={styles.progressText}>%{progress} Tamamlandı</Text>
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
    height: 18, // Metin sığması için biraz kalınlaştırdık
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative', // İçindeki absolute elemanlar için referans
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  textOverlay: {
    // Metni barın tam üzerine, her köşeye sıfırlayarak yayıyoruz
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', // Dikeyde ortala
    alignItems: 'center',     // Yatayda ortala
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333', // Yeşil barın üzerinde de, gri barın üzerinde de okunur bir renk
  },
});

export default ProgressBarWithText;