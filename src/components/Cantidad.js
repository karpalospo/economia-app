import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const minus = require('../../assets/icons/minus.png')
const trash = require('../../assets/icons/trash.png')
const plus = require('../../assets/icons/plus.png')

const Cantidad = ({style = 1, value, onChange, item, showStock = true}) => {

    const button = (image, value) => {

        if(image == 0) image = trash;
        else if(image == 1) image = minus;
        else image = plus;

        if(style == 2) {
            return (
                <TouchableOpacity style={styles.button} onPress={() => onChange(value, item)} >
                    {<Image source={image} style={[styles.ButtonImage, {tintColor: "#555", width: image == trash ? 20 : 17, height: image == trash ? 20 : 17}]} resizeMode='contain' />}
                </TouchableOpacity>
            )
        }
        return (
            <LinearGradient
                colors={['#33bbff', '#1B42CB']}
                start={[1, 0]}
                end={[1, 1]}
                location={[0, 0.5]}
                style={{borderRadius:17, width: 32, height: 32}}
            >
                <TouchableOpacity style={styles.button} onPress={() => onChange(value, item)} >
                    {<Image source={image} style={styles.ButtonImage} resizeMode='contain' />}
                </TouchableOpacity>
            </LinearGradient>
        )
    }

    return (
        <View style={styles.supercontainer}>
            <View style={styles.container}>
                {button(value > 1 ? 1 : 0, -1)}
                <View style={styles.quantyContainer}>
                    <Text style={styles.quantyText}>{value}</Text>
                </View>
                {button(2, 1)}
            </View>
            {showStock && <Text style={[styles.stock, style != 1 ? {} : {position: "relative", top: 10}]}>{item.stock} Disponible{item.stock == 1 ? "" : "s"}</Text>}
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
        alignItems: 'center', 
        justifyContent: "space-between",
        paddingHorizontal:8,
    },
    stock: {
        position: "absolute",
        top: 38,
        left: "50%",
        width: 100,
        marginLeft:-50,
        textAlign: "center",
        backgroundColor: "#eee",
        color: "#fff",
        borderRadius: 12,
        paddingVertical: 2,
        fontSize:12,
        fontFamily: "Roboto",
        color:"#333"
    },
    ButtonImage: {width: 18, height: 18, tintColor:"white"},
    quantyText: {fontSize: 18, color: "#444", fontFamily: "Tommy"},
    quantyContainer: {
        width: 40, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor:"#f2f2f2",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginHorizontal:10
    },
    button: {
        alignItems: 'center', 
        width: 32, 
        height: 32, 
        justifyContent: 'center',
    },


}