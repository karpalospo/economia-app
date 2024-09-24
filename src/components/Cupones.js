import React, {useState, useContext} from "react";
import { View, Text, Modal, FlatList } from "react-native";


import { format_date, f, Arrayfy } from '../global/functions';
import Button from "../components/Button";
import Title from "../components/Title";
import { styles } from '../global/styles';
import { UtilitiesContext } from '../context/UtilitiesContext';

const Cupones = ({visible, onclose}) => {

    const { cupones, setCupon } = useContext(UtilitiesContext)

    const setCuponLocal = (item) => {
        setCupon({IdCupon: false, NombreCupon: item.nombrecupon, Aplica: false, ...item})
        onclose()
    }
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            <View style={[styles.containerTrans, {paddingVertical:30}]}>
                <View style={{padding:5, paddingBottom:20, borderRadius:10, backgroundColor:"white"}}>
                    <Title title="Cupones de descuento" onCancel={onclose} />
                    <FlatList
                        data={Arrayfy(cupones)}
                        style={{marginTop:5, height:"90%"}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={_styles.couponItem}>
                                    <View style={_styles.dashed}>
                                        <Text style={_styles.couponText}>{item.nombrecupon}</Text>
                                        <Text style={_styles.couponPrice}>{f(item.valorcupon)}</Text>
                                
                                        <Text style={{paddingVertical:10, color:"white"}}>{'\u2022'} {f(item.valorcupon)} de descuento para compras mínimas de {f(item.vlrminimo)}. Válido hasta {format_date("compact2+time", item.hasta)}</Text>
                                        <Text style={{color:"white", paddingBottom:10}}>{'\u2022'} Cupón válido para redimir máximo {item.maximaventacliente} veces por usuario en un mismo día.</Text>
                                        <Text style={{color:"white"}}>{'\u2022'} Aplican condiciones y restricciones</Text>
                                        <View style={{height:20}} />
                                        <Button onPress={() => setCuponLocal(item)} title="UTILIZAR ESTE CUPÓN" styleMode="pink" buttonStyle={{paddingVertical:10}} />
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default Cupones

const _styles = {

    couponItem: {padding: 10, backgroundColor: "#004baa", margin:10, borderRadius:12},
    couponText: {color:"white", fontSize:20, fontWeight:"bold", textAlign: "center", backgroundColor:"rgba(0,0,0,0.2)", padding:3, borderRadius: 5},
    couponPrice: {color:"white", fontSize:24, fontWeight:"bold", textAlign: "center", padding:3, color: "#f1ff34"},
    dashed: {borderWidth:1, borderColor:"white", borderStyle:"dashed", borderRadius: 10, padding: 15},

}