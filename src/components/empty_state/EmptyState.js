import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";

EmptyState = (props) => 
{
    const {mainTitle = '', subTitle = '', image = require('../../../assets/icons/not_found.png')} = props;

    return (
        <View style={styles.container}>

            <Image source={image} style={styles.image} resizeMode='contain' />

            <Text style={styles.mainTitleText}>{mainTitle}</Text>

            {subTitle != '' && <Text style={styles.subTitleText}>{subTitle}</Text>}

        </View>
    )

}

const styles = StyleSheet.create({

    container: {alignItems: 'center', borderWidth:3, borderColor: "#ccc", borderRadius: 20, marginTop:30, marginHorizontal:20, padding: 20, borderStyle: "dotted"},
    image: {width: 80, height: 80, marginVertical: 15},
    mainTitleText: {fontSize: 20, color: COLORS._657272, textAlign: 'center', marginBottom: 8, fontFamily: FONTS.BOLD},
    subTitleText: {fontSize: 18, color: COLORS._A5A5A5, textAlign: 'center', fontFamily: FONTS.REGULAR },

})


export default EmptyState;