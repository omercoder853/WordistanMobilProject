import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './customAlertStyle';
import {useFeedback} from '../../contextapis/FeedbackContext';

export default function CustomAlert() {

  const {alertVisible , alertTitle , alertMessage , alertButtons , alertLoading} = useFeedback();

  return (
    <Modal statusBarTranslucent={true} visible={alertVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{alertTitle}</Text>
          <Text style={styles.message}>{alertMessage}</Text>
          <View style={styles.buttonContainer}>
            {alertButtons.map((button, index) =>
              <TouchableOpacity key={index} disabled={alertLoading}
                style={button.style ? [styles[button.style] , alertLoading && styles[button.style + 'Disabled']] : styles.defaultButton}
                onPress={button.action}>
                  {button.needLoading && alertLoading ? (<ActivityIndicator size="small" color="#fff" />) :
                (<Text style={styles.buttonText}>{button.text}</Text>) }
              </TouchableOpacity>)}
          </View>
        </View>
      </View>
    </Modal>);
}