import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, FlatList, Text, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import { styles } from '../global/styles';
import { UtilitiesContext } from '../context/UtilitiesContext'
import { CapitalizeWord } from '../global/functions';

export const Direcciones = ({
    loading = false,
    addresses = [], 
    selected = -1,
    onSelect = () => {},
    onPressNewAddress = () => {}
}) => {

    const { params } = useContext(UtilitiesContext)

    const getNombreCiudad = (id) => {
        if(id == undefined) return "(Sin ciudad)"
        const index = params.centroscostos.findIndex(item => item.id == id)
        if(index > -1) return params.centroscostos[index].city
        return "(Sin ciudad)"
    }

    return (
        <View>
            {loading && <ActivityIndicator color="#666" size={24} />}                
            <FlatList 
                keyExtractor={(item, index) => `address_${index}`}
                data={addresses}
                renderItem={({ item, index }) => {

                    return (
                        <LinearGradient
                            colors={index == selected ? ['#ffffff', '#ddeeff'] : ['#fff', '#eee']}
                            start={[1, 0]}
                            end={[1, 1]}
                            style={{borderRadius:10, marginVertical:7}}
                        >
                            <View style={[_styles.item, (index == selected ? {borderColor: "#444"} : {})]} >
                                <TouchableOpacity style={{flex:1}} onPress={() => onSelect(index, item.address)}>
                                    <View style={styles.rowLeft}>
                                        <Text style={_styles.text}>{item.nombre_direccion != "" ? item.nombre_direccion : "(Sin nombre)"} - </Text>
                                        <Text style={{color:"#FF2F6C", fontFamily:"Tommy"}}> {CapitalizeWord(getNombreCiudad(item.ciudad))}</Text>
                                    </View>
                                    <Text style={[_styles.text, {fontFamily: "TommyR", flex:1}]}>{item.direccion}</Text>
                                </TouchableOpacity>
                                {/*<TouchableOpacity style={{paddingLeft:10}}>
                                    <Entypo name="dots-three-vertical" size={24} color="black" />
                                </TouchableOpacity>*/}
                            </View>
                        </LinearGradient>                               
                    )
                }}
            />

            <View style={{height:10}}></View>

            <TouchableOpacity style={_styles.button} onPress={onPressNewAddress}>
                <AntDesign name="pluscircle" size={20} color="black" />
                <Text style={_styles.buttonText} >Agregar nueva dirección</Text>
            </TouchableOpacity>

        </View>
    )
}


const _styles = {

    button: {paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent:"center", borderRadius: 10, borderWidth:1.5, borderColor:"#ccc", borderStyle:"dashed"},
    buttonText: {fontSize: 15, color: "#444", marginLeft: 10, fontFamily: "TommyR" },

    item: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5, 
        borderColor: "#f2f2f2",
        borderRadius: 10,
        paddingVertical: 10, 
        paddingHorizontal: 15, 
    },
    text: {fontSize: 14, color: "#333", fontFamily: "Tommy", paddingVertical:2},
}