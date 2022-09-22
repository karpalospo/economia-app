import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image} from "react-native";
import { color } from "react-native-reanimated";

const minus = require('../../assets/icons/minus.png')
const trash = require('../../assets/icons/trash.png')
const plus = require('../../assets/icons/plus.png')

const Cantidad = ({value, onChange, item, showStock = false}) => {


    return (
        <View style={styles.supercontainer}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.decrementar} onPress={() => onChange(-1, item)} >
                    {(value > 1) && <Image source={minus} tintColor="#444" style={styles.ButtonImage} resizeMode='contain' />}
                    {value == 1 && <Image source={trash} tintColor="#444" resizeMode='contain' style={{width:18, height:18}} />}
                </TouchableOpacity>
                <View style={styles.quantyContainer}>
                    <Text style={styles.quantyText}>{value}</Text>
                </View>
                <TouchableOpacity style={styles.incrementar} onPress={() => onChange(1, item)} >
                    {<Image source={plus} style={styles.ButtonImage} tintColor="#444" resizeMode='contain' />}
                </TouchableOpacity>
            </View>
            {showStock && <Text style={styles.stock}>{item.stock} Disponible{item.stock == 1 ? "" : "s"}</Text>}
        </View>
    )
}

export default Cantidad

const styles = {

    supercontainer: {
        position: "relative",
    },

    container: {
        flexDirection:"row", 
        height: 36, 
        borderRadius: 8, 
        backgroundColor: "#F4F4F4", 
        alignItems: 'center', 
        justifyContent: "space-between",
        paddingHorizontal:8,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    stock: {
        position: "absolute",
        top: 42,
        left: 0,
        width: "100%",
        textAlign: "center",
        backgroundColor: "#48b0b0",
        color: "#fff",
        borderRadius: 12,
        paddingVertical: 2,
        fontSize:13,
        fontFamily: "Roboto"
    },
    ButtonImage: {width: 15, height: 15},
    quantyText: {fontSize: 18, color: "#444", fontFamily: "RobotoB"},
    quantyContainer: {width: 30, height: 30, justifyContent: 'center', alignItems: 'center'},
    decrementar: {alignItems: 'center', width: 30, height: 30, marginRight:4, justifyContent: 'center'},
    incrementar: {alignItems: 'center', width: 30, height: 30, marginLeftt:4, justifyContent: 'center'},


}