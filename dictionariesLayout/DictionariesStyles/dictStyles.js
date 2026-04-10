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
    },
    dictionaryButton:{
        borderRadius:20,
        marginBottom:15,
        elevation:5,
        backgroundColor:'lightblue'
    },
    dictionaryRow:{
        flexDirection:'row',
        width:'100%',
        padding:15,
        alignItems:'center',
        borderRadius:20,
        

    },
    dictionaryCover:{
        width:60,
        height:60,
        borderRadius:25
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
    collectionContainer:{
        backgroundColor:'#A78BFA',
        padding:10,
        marginRight:15,
        marginBottom:10,
        borderRadius:10,
        alignItems:'center'
    },
    collectionTitle:{
        color:'white',
        fontSize:15,
        fontWeight:'700',
        marginVertical:5
    },
    collectionTags:{
        borderRadius:15,
        backgroundColor:'#7C3AED',
        borderWidth:1,
        borderColor:'pink',
        color:'white',
        textAlign:'center',
        paddingHorizontal:5,
        paddingVertical:3,
        fontSize:10
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#c566e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f5e4fb',
    },
    wordTarget: {
        fontWeight: '800',
        fontSize: 16,
        color: '#4B2A63',
        marginBottom: 4,
    },
    wordMeaning: {
        fontWeight: '500',
        fontSize: 14,
        color: '#8e4a7c',
    },
    wordList: {
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    wordId: {
        minWidth: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F7EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingHorizontal: 5,
    },
    wordIdText: {
        color: '#A020F0',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    wordContentWrapper: {
        flex: 1,
        justifyContent: 'center',
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
    }
})

export default styles;