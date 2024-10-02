import React, {useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import { styles } from '../global/styles';
import { UtilitiesContext } from '../context/UtilitiesContext';

import ProductList from "./ProductList";


export default ({navigation}) => {

    const { ofertas } = useContext(UtilitiesContext)

    useEffect(() => {

    }, [ofertas])

    return (
        <View>

            <View style={{flexDirection:"row", justifyContent:"flex-start", paddingBottom:8}}>
                <Text style={styles.h2}>Las mejores ofertas</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Busqueda', {search: "[sales]"})} style={_styles.ofertasCont}>
                    <Text style={_styles.ofertas}>Ver todos</Text>
                </TouchableOpacity>
            </View>

            <ProductList items={ofertas} loading={ofertas.length == 0} />


        </View>
    )

}

const _styles = StyleSheet.create({

    
    ofertasCont: {
        marginVertical: 2, 
        paddingHorizontal: 3, 
    },

    ofertas: {
        textAlign:"center", 
        fontSize: 16, 
        color: "#005BD4", 
        fontFamily: "RobotoB",
        textDecorationLine: "underline"
    },




})