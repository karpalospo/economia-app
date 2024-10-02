import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { COLORS } from '../global/styles';

const cart = require('../../assets/cart-button.png');

const Button = ({onPress, styleMode="default", title = "", buttonStyle = {}, textStyle = {}, loading, image}) => {
    

    let _styleMode = {
        "default": {},
        "blue": {},
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
        <KeyboardAvoidingView behavior="height" style={{width:"100%"}}>
            <TouchableOpacity  onPress={loading ? () => {} : onPress} activeOpacity={0.9}>
                <View style={[style.container, _styleMode[styleMode], buttonStyle]}>
                    {loading && <ActivityIndicator color={_styleModeText[styleMode].color || style.text.color} />}
                    {!loading && 
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent: "center"}}>
                            {image && <Image source={cart} style={{width:20, height: 20, tintColor:"#fff", marginRight:6}} resizeMode="contain" />}
                            <Text style={[style.text, _styleModeText[styleMode], textStyle]}>{title}</Text>
                        </View>
                    }
                </View>
            </TouchableOpacity >
        </KeyboardAvoidingView>
    )
};
export default Button

const style = {
    container: {paddingHorizontal:15, minWidth:100, paddingVertical:10, width:"100%", backgroundColor: "#005BD4", borderRadius: 45},
    text: {textAlign: "center", color: "white", fontSize:15, fontFamily: "TommyR"}
}