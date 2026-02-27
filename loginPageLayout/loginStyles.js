import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#EBE1FF70',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    loginArea:{
        width:'85%',
        borderWidth:3,
        borderColor:'#B565F54D',
        paddingHorizontal:35,
        paddingVertical:30,
        borderRadius:25,
        backgroundColor:'#FCFAFF90'
    },
    loginTitleRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    loginTitle:{
        color:'#b565f5',
        fontWeight:'900',
        fontSize:30
    },
    loginTitleSmall:{
        color:'#555',
        fontSize:12,
        width:'70%',
        textAlign:'center',
        alignSelf:'center',
        marginBottom:25
    },
    inputLabelRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        marginBottom:10
    },
    inputLabel:{
        color: '#6b3fa0',
        fontWeight:'800'
    },
    textInput:{
        borderWidth:2,
        borderColor:'#B565F54D',
        borderRadius:10,
        marginBottom:20,
        paddingHorizontal:10
    },
    loginButton:{
        paddingHorizontal:35,
        paddingVertical:13,
        backgroundColor:'#e86ad0',
        borderRadius:10,
        alignSelf:'center'
    }
})

export default styles;