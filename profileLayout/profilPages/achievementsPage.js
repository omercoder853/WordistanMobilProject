import { View,Text,ImageBackground,Dimensions,ScrollView } from "react-native";
import styles from "../profileStyle/achievementsStyle";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import Achievement from "./achievement";
import ACHIEVEMENTLIST from "../../assets/data/achievementList";
import { useState } from "react";
import { useAuth } from "../../contextapis/AuthContext";


export default function Achievements(){
    const { user } = useAuth();
    const earnedAchievements = user?.achievements || []
    const {t} = useTranslation();
    const { width: screenWidth } = Dimensions.get('window');
    const counts = ACHIEVEMENTLIST.reduce((acc, ach) => {
        const isEarned = earnedAchievements.some((ac) => ac.achievementId === ach.id);
        if (isEarned) {
            acc[ach.type] = (acc[ach.type] || 0) + 1;
        }
        return acc;
    }, { bronze: 0, silver: 0, gold: 0 });
    return (
        <View style={{flex:1,alignItems:'center'}}>
            <View style={styles.achievementSumMainContainer}>
                <Text style={styles.achievementSumTitle}>{t("achievementSummary")}</Text>
                <View style={styles.achievementSumContainer}>
                    <ImageBackground style={styles.achievementSumCover} 
                    resizeMode="contain" imageStyle={{resizeMode:'contain'}}
                    source={require("../../assets/achievement_images/bronze.png")}>
                        <Text style={styles.achievementCount}>{counts.bronze}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover} 
                    resizeMode="contain" imageStyle={{resizeMode:'contain'}}
                    source={require("../../assets/achievement_images/silver.png")}>
                        <Text style={[styles.achievementCount,{top:'28%'}]}>{counts.silver}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover} 
                    resizeMode="contain" imageStyle={{resizeMode:'contain'}}
                    source={require("../../assets/achievement_images/gold.png")}>
                        <Text style={styles.achievementCount}>{counts.gold}</Text>
                    </ImageBackground>
                </View>
            </View>
            <View style={{flexDirection:'row',width:'90%',marginTop:15,alignItems:'center'}}>
                <Text style={styles.mainTitle}>{t("achievements")}</Text>
                <Ionicons style={{marginLeft:'auto'}} name="filter-sharp" size={screenWidth*0.07} color="black" />
            </View>
            <View style={{borderWidth:1,borderColor:'#E0E0E0',width:'90%',marginVertical:10}}></View>
            <ScrollView style={{ width: '100%' }} 
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}>
                {ACHIEVEMENTLIST.map((ach)=>{
                    const isEarned = earnedAchievements.some((ac) => ac.achievementId === ach.id)
                    return <Achievement key={ach.id} ach={ach} isEarned={isEarned}/>
                })}
            </ScrollView>
            
            
        </View>
    )
}