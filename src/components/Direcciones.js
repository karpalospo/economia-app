import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, Image } from "react-native";


const circle = require('../../assets/icons/add-circle.png')


export const Direcciones = ({
    addresses = [], 
    selectedAddress = -1,
    onSelectAddress = () => {},
    onPressAddNewAddress = () => {}
}) => {


    return (
        <View style={styles.container}>
                                
            <FlatList 
                keyExtractor={(item, index) => `address_${index}`}
                data={addresses}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={[styles.addressItemButton, (index == selectedAddress ? {borderColor: "#ccc", backgroundColor:"#dde"} : {})]} onPress={() => onSelectAddress(index, item.address)}>
                            <Text style={styles.addressItemButtonText}>{item.nombre_direccion != "" ? item.nombre_direccion : "(Sin Nombre)"}</Text>
                            <Text style={[styles.addressItemButtonText, {fontFamily: "Roboto"}]}>{item.direccion}</Text>
                        </TouchableOpacity>                                    
                    )
                }}
            />

            <View style={{height:10}}></View>

            <TouchableOpacity style={styles.addNewAddressButton} onPress={onPressAddNewAddress}>
                <Image source={circle} style={{width: 20, height: 20}} tintColor="#888" resizeMode='contain'  />
                <Text style={styles.addNewAddressButtonText} >Agregar nueva dirección</Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 20},
    ciudadSelected: {flexDirection: "row", alignItems:"center", borderWidth:1, borderColor:"#f2f2f2", borderRadius: 10, padding: 10, paddingHorizontal:20},
    selectedAddressWrapper: {padding: 20, alignItems: 'center', },
    selectedAddressContainer: {padding: 20, backgroundColor: "#FFFFFF", flexDirection: 'row', alignItems: 'center', borderRadius: 10, elevation: 5, shadowColor: "black", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.65, shadowRadius: 2,},
    selectedAddressIcon: { width: 25, height: 25, tintColor: "#FF2F6C"},
    selectedAddressText: {fontSize: 18, color: "#707070", marginHorizontal: 15, fontFamily: "Roboto"},
    selectedAddressNameText: {fontSize: 14, color: "#BABABA", marginHorizontal: 15, fontFamily: "Roboto"},

    addNewAddressButton: {paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent:"center", borderRadius: 10, borderWidth:2, borderColor:"#ccc", borderStyle:"dashed"},
    addNewAddressButtonText: {fontSize: 18, color: "#888", marginLeft: 10, fontFamily: "Roboto" },

    addressListTitleText: {fontSize: 22, color: "#657272", marginBottom: 10, fontFamily: "Roboto" },

    addressItemButton: {
        borderWidth: 1, 
        borderColor: "#ddd",
        borderRadius: 10,
        paddingVertical: 15, 
        paddingHorizontal: 10, 
        backgroundColor:"white", 
        marginVertical: 8, 
    },
    addressItemButtonText: {fontSize: 16, color: "#444", fontFamily: "RobotoB"},
})