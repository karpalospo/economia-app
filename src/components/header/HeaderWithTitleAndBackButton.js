import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";

export const HeaderWithTitleAndBackButton = props =>
{

    const {title = '', subtitle = '', onPress = () => {}, showBackButton = true, } = props

    return (
                
        <View style={styles.categoryTiltleWrapper}>

            {showBackButton &&
            <TouchableOpacity onPress={onPress} style={styles.categoryBackButton}>
                <Image source={require('../../../assets/icons/dropleft_arrow.png')} style={styles.backButtonContainer} resizeMode='contain' />
            </TouchableOpacity>}

            <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryMainTitleText}>{title}</Text>
                <Text style={styles.categorySubTitleText}>{subtitle}</Text>
            </View> 

        </View>

    )
}


const styles = StyleSheet.create({
    
    backButtonContainer: {width: 15, height: 15},

    categoryTiltleWrapper: {padding: 20, flexDirection: 'row'},
    categoryBackButton: {alignItems: 'flex-start', justifyContent: 'center', width: '10%', paddingVertical: 10, paddingRight: 10},
    categoryTitleContainer: {width: '90%', justifyContent: 'center'},
    categoryMainTitleText: {fontSize: 15, color: COLORS._A5A5A5, fontFamily: FONTS.BOLD},
    categorySubTitleText: {fontSize: 17, color: COLORS._657272, fontFamily: FONTS.BOLD},

})