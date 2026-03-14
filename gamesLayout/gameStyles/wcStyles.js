import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#2D2438',
        alignItems:'center',
        paddingHorizontal:20
    },
    lettersArea:{
        flexDirection:'row',
        gap:10,
        justifyContent:'center',
        alignItems:'center',
        flexWrap:'wrap'
    },
    letterInputContainer:{
        aspectRatio:1,
        width:45,
        justifyContent:'center',
        alignItems:'center',
    },
    letterInput:{
        flex:1,
        width:'100%',
        textAlign:'center',
        fontSize:19,
        textAlignVertical:'center',
        fontWeight:'900',
        backgroundColor:'white',
        borderRadius:6,
        borderColor:"#5A4E6B",
        borderWidth:1
    },
    questionArea:{
        backgroundColor:'#382E45',
        width:'100%',
        paddingVertical:40,
        marginTop:30,
        marginBottom:40,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#5A4E6B'
    },
    question:{
        color:"white",
        fontSize:25,
        fontWeight:'900',
        textAlign:'center'
    }
})

export default styles