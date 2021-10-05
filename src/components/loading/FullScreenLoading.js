import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { COLORS } from "../../utils/constants";

export const FullScreenLoading = (props) =>
{
    const {color = COLORS._1B42CB, size = "large", backgroundColor = "rgba(255,255, 255, 0.5)",} = props 

    return(
        <View style={[styles.conatiner, {backgroundColor}]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}


const styles = StyleSheet.create({
    conatiner: {position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}
})