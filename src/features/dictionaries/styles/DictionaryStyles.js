import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    tabBarStyle:{
        marginTop:20,
        backgroundColor:'transparent',
        elevation:0,
        borderBottomWidth:0.2,
        borderColor:'gray'
    },
    addDictButton:{
        backgroundColor:'green',
        borderRadius:30,
        padding:15,
        aspectRatio:1,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:15,
        bottom:20
    },
    wordList: {
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    wordsTable:{
        backgroundColor:'#FAFAFD',
        flex:1
    },
    wordsTitle: {
        borderRadius: 20,
        padding: 24,
        marginVertical: 15,
        marginHorizontal: 15,
        elevation: 8,
        shadowColor: '#b565f5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    dictName :{
        fontWeight: '900',
        fontSize: 28,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    dictDirectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
    },
    dictDirection: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
        overflow: 'hidden',
    },
    dictDescription: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
        fontWeight: '500',
    },
    addDictTitle:{
        color:'#dd69d8',
        marginBottom:20,
        fontWeight:'900',
        fontSize:20,
        alignSelf:'center'
    },
    addDictLabel:{
        color:'#6b3fa0',
        marginBottom:10,
        fontWeight:'500'
    },
    addDictInput:{
        borderRadius:15,
        borderWidth:2,
        borderColor:'#e8d0fc',
        marginBottom:15,
        width:'100%',
        paddingHorizontal:10
    },
    dictLangButton:{
    backgroundColor: '#c967e6', 
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    flex:1,
    borderWidth:1,
    borderColor:"#c967e6"
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
})

export default styles;