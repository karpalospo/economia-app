import React from "react";
import { View, Text, Image, TouchableOpacity} from "react-native";

const volver = require('../../assets/icons/volver.png')
const logo = require('../../assets/la_economia_h.png')

const HeaderSimple = (props) => {

    const {onBack = () => {}} = props
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={{marginLeft:19, width:40, height:40, borderRadius:20, elevation:5, backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
                <Image source={volver} tintColor="#444" resizeMode='contain' style={{width:19, height:19}} />
            </TouchableOpacity>
            <View style={{flex:1, alignItems:"center"}}><Image style={{width: 150, height: 40}} resizeMode='contain' source={logo} /></View>
            <View style={{width:60}}></View>
        </View>
    )
}

export default HeaderSimple

const styles = {
    container: { alignItems: 'center', flexDirection:"row", backgroundColor:"white", paddingBottom: 20, borderBottomColor:"#ccc", borderBottomWidth:1 },

}