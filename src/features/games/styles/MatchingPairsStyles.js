import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#2D2438',
        alignItems:'center',
        paddingHorizontal:20
    },
    gameContainer:{
        flex:1,
        gap:15,
        flexDirection:'row'
    },
    questionArea:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },
    answerArea:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },
    question:{
        borderWidth:1,
        width:'100%',
        paddingVertical:15,
        borderRadius:10,
        marginBottom:10,
        borderColor:'#5A4E6B'
    },
    answer:{
        borderWidth:1,
        width:'100%',
        paddingVertical:15,
        borderRadius:10,
        marginBottom:10,
        backgroundColor:'#322B3D',
        borderColor:'#453D52'
    }
})

export default styles