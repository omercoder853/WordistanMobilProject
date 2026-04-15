import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    gameButton:{
        width:'100%',
        alignSelf:'center',
        marginBottom:15,
        backgroundColor:'white',
        elevation:5,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#dc9f9f',
    },
    gameRow:{
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:15,
        alignItems:'center',
        paddingHorizontal:10,
    },
    gameCover:{
        width:60,
        height:60
    },
    gameName:{
        fontSize:15,
        fontWeight:'700',
        marginBottom:5
    },
    gameTitle:{
        textAlign:'center',
        fontWeight:'900',
        fontSize:25,
        marginVertical:10
    },
    gameDesc:{
        textAlign:'center'
    },
    sourceButton:{
        backgroundColor:'white',
        paddingVertical:10,
        paddingHorizontal:10,
        borderWidth:1,
        borderColor:"#dc9f9f",
        borderRadius:10,
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    selectedSourceButton:{
        backgroundColor:"#e8b4b4",
        borderColor:"#a36e6e"
    },
    optionLabel:{
        fontSize:16,
        fontWeight:'700',
        marginBottom:8,
        color:'#a36e6e',
        marginTop:15
    },
    inputRow:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        paddingVertical:5,
        paddingHorizontal:15,
        borderRadius:10,
        backgroundColor:'#f8f1f1',
        elevation:5
    },
    numericInput:{
        flex:6,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'white',
        paddingHorizontal:15
    },
    increaseButton:{
        backgroundColor:'green',
        flex:1,
        padding:5,
        alignItems:'center',
        borderRadius:10
    },
    decreaseButton:{
        backgroundColor:'red',
        flex:1,
        padding:5,
        alignItems:'center',
        marginHorizontal:8,
        borderRadius:10
    },
    startGameButton:{
        backgroundColor:'green',
        width:'60%',
        alignSelf:'center',
        marginTop:30,
        paddingVertical:10,
        borderRadius:10
    },
    startGameText:{
        fontSize:18,
        color:'white',
        fontWeight:'900',
        textAlign:'center'
    },
    gameHeaderRow:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        marginTop:25
    },
    gameHeaderItem:{
        backgroundColor:'#382E45',
        paddingVertical:10,
        paddingHorizontal:15,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#5A4E6B'
    },
    questionNavArea:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:35,
        marginTop:'auto',
        alignItems:'center'
    },
    questionNavButton:{
        paddingVertical:15,
        paddingHorizontal:25,
        borderRadius:15
    },
    setupCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 3,
        zIndex: 1
    },
    setupCardTop: {
        zIndex: 3000
    },
    setupOptionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: '#5B3FD3',
    },
    primarySourceButton: {
        backgroundColor: "#5B3FD3",
        borderColor: "#412a9e"
    },
    primaryStartButton: {
        backgroundColor: "#5B3FD3",
        elevation: 8,
        shadowColor: "#5B3FD3",
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10
    },
    primaryStartText: {
        letterSpacing: 1
    }
})

export default styles