import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    profilePhoto:{
        width:120,
        height:120,
        borderRadius:10,
        marginBottom:10
    },
    editPhoto:{
        marginTop:'auto',
        marginBottom:10,
        backgroundColor:'#8e4a7c',
        padding:5,
        borderRadius:13,
        marginLeft:-35
    },
    profileDetailContainer:{
        width:'90%',
        backgroundColor:'white',
        borderRadius:10,
        marginTop:10
    },
    profileDetailItem:{
        flexDirection:'row',
        paddingHorizontal:10,
        paddingVertical:12,
        alignItems:'center'
    },
    profileLabel:{
        color:'#64748B'
    },
    profileValue:{
        color:'#8e4a7c',
        marginLeft:'auto',
        fontWeight:'500'
    },
    changePasswordButton:{
        backgroundColor:'#8e4a7c',
        marginLeft:'auto',
        padding:5,
        borderRadius:5
    },
    deleteAccountButton:{
        marginTop:'auto',
        marginBottom:30,
        borderWidth:1,
        borderColor:'red',
        width:'90%',
        borderRadius:15,
        paddingVertical:10,
    },
})

export default styles;