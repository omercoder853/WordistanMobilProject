import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    achievementSumMainContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        paddingTop: 5
    },
    achievementSumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '95%',
        alignItems: 'center',
    },
    achievementSumCover: {
        flex: 1,
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    achievementCount: {
        position: 'absolute',
        top: '30%',
        width: '50%',
        textAlign: 'center',
        fontSize: screenWidth * 0.07,
        fontWeight: '900',
        color: 'white',
    },
    achievementSumTitle: {
        fontSize: screenWidth * 0.07,
        fontWeight: '900',
        textAlign: 'center'
    },
    mainTitle: {
        fontSize: screenWidth * 0.07,
    },
    achievementImage: {
        width: screenWidth * 0.30,
        height: screenWidth * 0.30,
        resizeMode: 'contain',
    },
    achievementRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '92%',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
    },
    achievementDec: {
        color: '#666666',
        fontSize: 12,
        lineHeight: 16
    },
    lockOverlay:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1000,
        backgroundColor:'rgba(0,0,0,0.4)',
        borderRadius: 15,
    },
})

export default styles;