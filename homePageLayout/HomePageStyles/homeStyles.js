import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    profileRowContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        justifyContent:'space-between',
        paddingVertical:5,
        paddingRight:10,
        backgroundColor: 'transparent'
    },
    textWelcome:{
        fontSize:18,
        marginLeft:-12
    },
    profileContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    greeting:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    profileImage:{
        width:50,
        borderRadius:25,
        aspectRatio:1,
        marginRight:5,
        
    },
    logoImage : {
        width:72,
        aspectRatio:1,
        borderRadius:25,
    },
    dailyWordContainer:{
        padding:20,
        borderRadius:25,
        elevation:8,
        shadowColor: '#8E4A7C',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginHorizontal:10,
        marginVertical:15
    },
    dailyWordRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    dailyWordButtons:{
        flexDirection:'row',
        marginLeft:'auto'
    },
    dailyWordTitle:{
        color:'#8E4A7C',
        fontSize:23,
        fontWeight:'900'
    },
    dailyWordLabel:{
        fontSize:12,
        fontStyle:'italic',
        color:'gray',
        marginTop:10
    },
    dailyWordContent:{
        fontSize:15,
        fontWeight:'700'
    },
    statRow:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingHorizontal:15,
        gap:10,
        marginTop:5
    },
    statItemButton:{
        borderRadius:25,
        borderWidth:1,
        borderColor:'#E6E1F0',
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'white',
        flex:1,
        height:70,
        elevation:5
    },
    statItemRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    statColumn:{
        alignItems:'center'
    },
    quickMenu:{
        padding:20
    },
    quickMenuColumn:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'white',
        marginRight:15,
        paddingHorizontal:10,
        paddingVertical:10,
        width:90,
        height:80,
        borderRadius:10,
        elevation: 1,
        shadowColor: '#8E4A7C',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    quickMenuText:{
        fontSize: 12, 
        fontWeight: '500', 
        color: '#333'
    },
    scrollView:{
        display:'flex',
        flexDirection:'row'
    },
    recentWord:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'white',
        borderRadius:15,
        marginBottom:10
    }
})

export default styles;