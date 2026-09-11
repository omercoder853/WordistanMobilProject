import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    headerTopRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        alignItems:'center',
        marginBottom:20,
        marginTop:15
    },
    headerRowButtons:{
        padding:5,
        aspectRatio:1,
        backgroundColor:'white',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    subscriptionArea:{
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#8B5CF6',
        flexDirection:'row',
        backgroundColor:'white'
    },
    profilePhoto:{
        width:120,
        height:120,
        borderRadius:10,
        marginBottom:10
    },
    statColumn:{
        flex:1,
        alignItems:'center',
        gap:5
    },
    inviteButton:{
        flexDirection:'row',
        alignItems:'center',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#8DB580',
        backgroundColor:'#E9F5DB',
        width:'100%',
        paddingVertical:7,
        marginBottom:20
    },
    consoleButton:{
        flexDirection:'row',
        alignItems:'center',
        borderRadius:15,
        width:'100%',
        paddingVertical:7,
        marginBottom:10
    },

});

export default styles;