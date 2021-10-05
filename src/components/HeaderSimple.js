import React from "react";
import { View, Text, Image, TouchableOpacity} from "react-native";

const volver = require('../../../assets/icons/volver.png')
const logo = require('../../../assets/la_economia_h.png')

const HeaderSimple = (props) => {

    const {onBack = () => {}} = props
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={{marginLeft:17, width:35, height:35, borderRadius:18, backgroundColor:"#d6d6d6", alignItems:"center", justifyContent:"center"}}>
                <Image source={volver} tintColor="#333" resizeMode='contain' style={{width:16, height:16}} />
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