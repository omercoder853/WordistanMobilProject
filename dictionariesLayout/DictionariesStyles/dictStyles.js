import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title:{
        fontWeight:'900',
        fontSize:25,
        paddingHorizontal:25,
        marginTop:20
    },
    searchBarRow:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:25,
        marginTop:20,
        justifyContent:'center',
    },
    searchBarInput:{
        borderWidth:1,
        borderColor:'#D1D5DB',
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15,
        paddingHorizontal:15,
        paddingVertical:10,
        flex:10
    },
    searchButton:{
        padding:10,
        backgroundColor:'#F462B6',
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    tabBarStyle:{
        marginTop:20,
        backgroundColor:'transparent',
        elevation:0,
        borderBottomWidth:0.2,
        borderColor:'gray'
    }
})

export default styles;