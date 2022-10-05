import React, {useState, useContext, useEffect} from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";


import { SignInCard } from "../components/SignInCard";
import LocationSelector from '../components/LocationSelector';
import { Feather, Entypo, AntDesign  } from '@expo/vector-icons'; 
import { UtilitiesContext } from '../context/UtilitiesContext'


const BottomMenu = ({navigation, showLocation = false}) => {

    const { location, setLocation, user } = useContext(UtilitiesContext)
    
    const [signInVisible, setSignInVisible] = useState(false)
    const [locationVisible, setLocationVisible] = useState(showLocation || (!location.id ? true : false))

    

    showLogin = () => {
        
        if(user.logged == undefined) {
            console.log(user,user.logged, signInVisible)
            return setSignInVisible(true)
        }
        navigation.navigate('Profile')
  
        
    }

    onSelectLocation = async (selectedLocation) =>
    {
        setLocation(selectedLocation)
        setLocationVisible(false)
    }

    onCancelSignIn = () => {
        setSignInVisible(false)
    }

    onRegisterSignIn = () => {
        setSignInVisible(false)
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
                <Text style={styles.botonFlotanteText}>Mi Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonFlotante, {backgroundColor: "#FF2F6C"}]} onPress={() => setLocationVisible(true)}>
                <Entypo name="location-pin" size={20} color="white" />
                <Text style={[styles.botonFlotanteText, {color: "#fff", textTransform: "capitalize"}]}>{location.id ? location.name : "SELECCIONE..."}</Text>
            </TouchableOpacity>

            <SignInCard
                visible={signInVisible} 
                onLogin={() => setSignInVisible(false)} 
                onCancel={onCancelSignIn} 
                onRegister={onRegisterSignIn} 
            />
            <Modal
                animationType="fade"
                transparent={false}
                visible={locationVisible}
                onRequestClose={() => {}}
            >
                <LocationSelector onSelectLocation={(location) => onSelectLocation(location) } onCancel={() => setLocationVisible(false)} />
            </Modal>

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
        paddingBottom: 20,
        borderTopWidth:1,
        borderColor:"#ddd",
     },

}