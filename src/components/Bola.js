import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const Bola = ({item, onTap, enable}) =>
{

    return(
        <View style={styles.container}>
            {enable &&
            <TouchableOpacity style={styles.button} onPress={() => onTap(item)}>
                <Image source={item.image} resizeMode='contain' style={styles.image} />
            </TouchableOpacity>
            }
            {!enable && 
            <View style={styles.button} >
                <Image source={item.image2} resizeMode='contain' style={styles.image} />
            </View>
            }
            <Text style={styles.text}>{item.title}</Text>
        </View>
    )

}
export default Bola

const styles = StyleSheet.create({

    container: {alignItems: 'center', width: 90, padding: 5, marginTop: 5}, 
    button: {width: 80, height: 80, padding:10, overflow: 'hidden',},
    image: {width: '100%', height: '100%'},
    text: {fontSize: 12, color: "#657272", textAlign: 'center', marginTop: 5, fontFamily: "Roboto"},

})