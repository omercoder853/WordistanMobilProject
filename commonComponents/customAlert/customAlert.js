import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './customAlertStyle';
export default function CustomAlert({ visible, title, message,buttons })
{
return (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.alertBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
            {buttons.map((button,index)=>
            <TouchableOpacity key={index} 
            style={button.style ? styles[button.style] : styles.defaultButton} 
            onPress={button.action}>
                <Text style={styles.buttonText}>{button.text}</Text>
            </TouchableOpacity>)}
        </View>
      </View>
    </View>
  </Modal>);
}