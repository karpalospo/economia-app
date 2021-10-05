import React from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../../utils/constants";


export const FullWidthLoading = (props) =>
{
    const {color = COLORS._1B42CB, size = "large", style = {width: '100%', padding: 10, alignItems: 'center'}} = props 

    return(
        <View style={style}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}