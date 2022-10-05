import React, {useState} from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { COLORS } from '../global/styles';



const Button = ({onPress, styleMode="default", title = "", buttonStyle = {}, textStyle = {}, loading}) => {
    

    let _styleMode = {
        "default": {},
        "blue": {backgroundColor:COLORS.mainBlue},
        "pink": {backgroundColor: "#e50077"},
        "outline": {borderWidth:1, borderColor:"rgba(255,255,255,0.5)", backgroundColor:"transparent"},
        "outlineGray": {borderWidth:1, borderColor:"#dadada", backgroundColor:"transparent"},
        "outlineBlue": {borderWidth:1, borderColor:COLORS.mainBlue, backgroundColor:"transparent"},
        "white": {backgroundColor:"white"},
        "gray": {backgroundColor:"#dadada"},
        "blackText": {backgroundColor:"white"}
    }

    let _styleModeText = {
        "default": {},
        "blue": {color: "white"},
        "pink": {color: "white"},
        "outline": {},
        "outlineGray": {color: COLORS.mainText},
        "outlineBlue": {color: COLORS.mainBlue},
        "white": {color: COLORS.mainBlue},
        "gray": {color: COLORS.mainText},
        "blackText": {color: "black"}
    }

    return (
        <KeyboardAvoidingView behavior="height">
            <TouchableOpacity  onPress={loading ? () => {} : onPress} activeOpacity={0.9}>
                <View style={[style.container, _styleMode[styleMode], buttonStyle]}>
                    {loading && <ActivityIndicator color={_styleModeText[styleMode].color || style.text.color} />}
                    {!loading && <Text style={[style.text, _styleModeText[styleMode], textStyle]}>{title}</Text>}
                </View>
            </TouchableOpacity >
        </KeyboardAvoidingView>

    )
};
export default Button

const style = {
    container: {backgroundColor: COLORS.red, paddingHorizontal:25, minWidth:100, paddingVertical:15, borderRadius: 8},
    text: {textAlign: "center", color: "white", fontSize:15, fontFamily: "RobotoB"}
}