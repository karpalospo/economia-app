import React, {useState, useContext, useEffect} from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";


import Login from "./Login";
import Ubicacion from './Ubicacion';
import { Feather, Entypo, AntDesign  } from '@expo/vector-icons'; 
import { UtilitiesContext } from '../context/UtilitiesContext'


const BottomMenu = ({navigation, showLocation = false}) => {

    const { location, setLocation, user } = useContext(UtilitiesContext)
    
    const [loginVisible, setLoginVisible] = useState(false)
    const [locationVisible, setLocationVisible] = useState(showLocation)

    const showLogin = () => {
        if(user.logged == undefined) {
            setLoginVisible(true)
        } else {
            navigation.navigate('Profile')
        }
    }

    const onSelectLocation = async (selectedLocation) =>
    {
        setLocation(selectedLocation)
        setLocationVisible(false)
    }

    const onRegister = () => {
        setLoginVisible(false)
        navigation.navigate("Registro")
    }

    return (
        <View style={styles.botonFlotanteCont}>
            <TouchableOpacity style={styles.botonFlotante} onPress={() => navigation.navigate('Home')}>
                <Feather  name="home" size={20} color="#333" />
                <Text style={styles.botonFlotanteText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonFlotante} onPress={() => {}}>
                <AntDesign name="appstore-o" size={20} color="#333" />
                <Text style={styles.botonFlotanteText}>Categorias</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonFlotante} onPress={() => showLogin()}>
                <Feather  name="user" size={20} color="#333" />
                <Text style={styles.botonFlotanteText}>{user.logged == undefined ? "Accede" : "Mi Perfil"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonFlotante, {backgroundColor: "#FF2F6C"}]} onPress={() => setLocationVisible(true)}>
                <Entypo name="location-pin" size={20} color="white" />
                <Text style={[styles.botonFlotanteText, {color: "#fff", textTransform: "capitalize"}]}>{location.id ? location.city : "SELECCIONE..."}</Text>
            </TouchableOpacity>

            <Login
                visible={loginVisible} 
                onLogin={() => setLoginVisible(false)} 
                onCancel={() => setLoginVisible(false)} 
                onRegister={onRegister} 
            />
            
            <Ubicacion visible={locationVisible} onSelectLocation={location => onSelectLocation(location)} onCancel={() => setLocationVisible(false)} />

        </View>
    )
}

export default BottomMenu


const styles = {

    botonFlotante: {
        flexDirection:"column",
        alignItems: "center",
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius: 10,
        margin:3
    },
    botonFlotanteText: {
        color: "#555",
        fontSize: 12,
        paddingVertical: 2,
        fontFamily: "Roboto",
        minWidth:45,
        textAlign: "center"
    },
    botonFlotanteCont: {
        paddingHorizontal:3,
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems: "center",
        width:"100%", 
        backgroundColor:"white", 
        position: "absolute", 
        bottom: 0, 
        left: 0,
        paddingBottom: Platform.OS === 'ios'? 20 : 5,
        borderTopWidth:1,
        borderColor:"#ddd",
     },

}