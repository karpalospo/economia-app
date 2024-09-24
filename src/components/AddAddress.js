import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, StatusBar, Modal, SafeAreaView, Platform } from "react-native";

import { API } from "../services/services";

import { UtilitiesContext } from '../context/UtilitiesContext'
import { styles } from '../global/styles';
import { CustomSelectPicker } from './CustomSelectPicker'
import Button from "../components/Button";
import Title from "../components/Title";

const AddAddress = ({visible = false, onCancel = () => {}, onSuccess = () => {}}) => {


    const { user, params } = useContext(UtilitiesContext)

    const [addressAlias, setAddressAlias] = useState("");
    const [address, setAddress] = useState("");
    const [tipovia, setTipovia] = useState("Carrera");
    const [principal, setPrincipal] = useState("");
    const [secundario, setSecundario] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [barrio, setBarrio] = useState("");
    const [ciudad, setCiudad] = useState({id:0});
    const [ciudades, setCiudades] = useState([]);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(ciudades.length != 0) return
        let _ciudades = params.centroscostos.map(item => ({id: item.id, label: item.city, value: item.city}))
        setCiudades([{id:0, label:"Seleccione...", value:"Seleccione..."}, ..._ciudades])
        
    }, [params])


    const guardar = async () => 
    {
        if(principal.trim() == "" || secundario.trim() == "") return Alert.alert('Atención', 'La dirección no parece válida, verifíquela.');
        if(addressAlias.trim() == "") return Alert.alert('Atención', 'El nombre de la dirección es obligatorio.');
        if(ciudad.id == 0) return Alert.alert('Atención', `Seleccione una ciudad.`)
        if(barrio.trim() == "") return Alert.alert('Atención', `El barrio es requerido`)

        setLoading(true)
        const res = await API.POST.saveAddress(address + ", Barrio: " + barrio, addressAlias, user.nit, user.nombres, user.email, user.token, ciudad.id);
        setLoading(false)

        if(!res.error) {
            onSuccess()
        }
        else Alert.alert('Atención', 'No se ha podido guardar esta dirección, por favor vuelve a intentarlo.')
    }

    const onEdit = (_tipovia) => {
        if(_tipovia) {
            setTipovia(_tipovia)
            setAddress(`${_tipovia} ${principal} #${secundario} - ${numero} ${complemento}`)
        } else setAddress(`${tipovia} ${principal} #${secundario} - ${numero} ${complemento}`)
    }

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {}}
        >
            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
                <View style={{backgroundColor: "white", padding:5, borderBottomWidth: 2, borderBottomColor: "#eee"}} >
                    <Title title="Agregar dirección" onBack={onCancel} />
                </View>
                <ScrollView style={{paddingHorizontal:20, backgroundColor: "white"}}>
                    
                    <Text style={_styles.label}>Nombre</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder = 'Ejemplo: Casa, Oficina, Novi@...'
                            placeholderTextColor = {"#aaa"}
                            autoCapitalize='none'
                            maxLength={100}
                            style={_styles.input}
                            onChangeText={text => setAddressAlias(text)}
                            onBlur={() => onEdit()}
                            value={addressAlias}
                        />
                    </View>
            
                    <Text style={_styles.label}>Vía Principal</Text>
                    <View style={_styles.selectContainer}>
                        <CustomSelectPicker
                            items={[
                                {id:0, label:"Carrera", value:"Carrera" },
                                {id:0, label:"Calle", value:"Calle" },
                                {id:0, label:"Avenida", value:"Avenida" },
                                {id:0, label:"Avenida Calle", value:"Avenida Calle" },
                                {id:0, label:"Autopista", value:"Autopista" },
                                {id:0, label:"Manzana", value:"Manzana" },
                                {id:0, label:"Diagonal", value:"Diagonal" },
                                {id:0, label:"Circular", value:"Circular"},
                                {id:0, label:"Transversal", value:"Transversal" },
                                {id:0, label:"Vía", value:"Vía" }
                            ]}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => {onEdit(itemValue.value)}}
                            placeHolder="Seleccione..."
                            InitialselectedItem={"Seleccione..."}
                        />
                    </View>
                    <View style={{height:20}} />
                    <View style={styles.row}>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={_styles.input}
                                onChangeText={(text) => setPrincipal(text)}
                                onBlur={() => onEdit()}
                                value={principal}
                            />
                        </View>
                        <Text style={[_styles.label, {fontSize:19, paddingRight:5}]}>#</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={[_styles.input]}
                                onChangeText={text => setSecundario(text)}
                                onBlur={() => onEdit()}
                                value={secundario}
                            />
                        </View>
                        <Text style={[_styles.label, {fontSize:19, paddingRight:15}]}>-</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={_styles.input}
                                onChangeText={text => setNumero(text)}
                                onBlur={() => onEdit()}
                                value={numero}
                            />
                        </View>
                    </View>

                    <Text style={_styles.label}>Complemento</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder = 'Ejemplo: Apto 105, Casa 3, Piso 2'
                            placeholderTextColor = {"#aaa"}
                            autoCapitalize='none'
                            maxLength={200}
                            style={_styles.input}
                            onChangeText={text => setComplemento(text)}
                            onBlur={() =>onEdit()}
                            value={complemento}
                        />
                    </View>
            
                    <Text style={{color: "#777", fontSize:14, marginTop: 20, marginBottom:4, textAlign: "center", fontFamily:"TommyR"}}>Dirección generada:</Text>
                    <View style={{paddingVertical:4,  borderTopWidth: 1, borderTopColor:"#999", borderBottomWidth: 1, borderBottomColor:"#999"}}>
                        <Text style={{color: "#333", fontSize:17, textAlign: "center", fontFamily:"Tommy"}}>{address}</Text>
                    </View>
                    

                    <Text style={_styles.label}>Ciudad</Text>
                    <View style={_styles.selectContainer}>
                        <CustomSelectPicker
                            items={ciudades}
                            style={{ justifyContent: 'center' }}
                            onValueChange={itemValue => setCiudad(itemValue)}
                            placeHolder="Seleccione..."
                            InitialselectedItem={"Seleccione..."}
                        />
                    </View>
            
            
                    <Text style={_styles.label}>Barrio</Text>
                    <View style={{flex: 1}}>
                        <TextInput
                            style={_styles.input}
                            onChangeText={(text) => setBarrio(text)}
                            onBlur={() => onEdit()}
                            value={barrio}
                        />
                    </View>
            
    
                    <View style={{alignItems: "center", marginVertical:30}}>
                        <Button loading={loading} title="GUARDAR DIRECCIÓN" onPress={() => guardar()}></Button>
                    </View>


                </ScrollView>
            </SafeAreaView>

        </Modal>
    )
    
}

export default AddAddress

const _styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    selectContainer: {flex: 1, borderWidth:1, borderColor:"#bbb", height:40, borderRadius:25},
    label: {paddingTop:15, paddingLeft:15, marginBottom:4, color: "#333", fontSize:15, fontFamily: "TommyR" },
    titleText: {fontSize: 20, marginBottom: 30, fontFamily: "RobotoB"},
    input: {fontSize: 17, borderWidth: 1, borderColor: "#bbb", paddingVertical: 5, color:"#333", paddingHorizontal:15, borderRadius: 25},



})