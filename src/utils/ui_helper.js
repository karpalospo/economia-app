import { StatusBar, Platform, StyleSheet} from "react-native";
import { IsIphoneX } from "./helper";
import { COLORS } from "./constants";

export const CalculateMarginTopForAndroid = (key = "marginTop") => 
{   
    if(Platform.OS == 'android')
    {
        return { [key]: StatusBar.currentHeight }
    }
    else if (IsIphoneX())
    {
        return { [key]: 25 }
    }

    return {}
}


export const GlobalStyles = StyleSheet.create({

    primaryShadowBox: {elevation: 4, shadowOpacity: .2, shadowOffset: {width: 0, height: 3}, shadowColor: COLORS._657272,},

})