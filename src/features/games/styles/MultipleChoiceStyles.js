import { StyleSheet } from "react-native";

const mcqStyles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#2D2438',
        alignItems:'center',
        paddingHorizontal:20
    },
    optionArea:{
        marginTop:'auto',
        width:'100%',
        alignSelf:'center'
    },
    quizOption:{
        paddingVertical:18,
        backgroundColor:'#382E45',
        width:'100%',
        marginBottom:15,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#5A4E6B'
    },
    questionArea:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    gameResultRow:{
        flexDirection:'row',
        gap:10,
        marginBottom:30
    },
    gameResulItem:{
        borderWidth:1,
        borderRadius:10,
        flex:1,
        flexBasis:0,
        alignItems:'center',
        paddingVertical:10
    },
    resultLabel:{
        color:"white",
        fontWeight:'900',
    },
    result:{
        backgroundColor:'white',
        marginTop:5,
        width:"60%",
        textAlign:'center',
        borderRadius:5
    }
})

export default mcqStyles