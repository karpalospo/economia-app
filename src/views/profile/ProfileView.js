import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, DeviceEventEmitter, AsyncStorage, Alert } from "react-native";
import { COLORS, SIGNOUT_EVENT, FONTS } from "../../utils/constants";
import { NavigationEvents } from "react-navigation";
import Header from "../../components/header/Header";


export default class Profile extends React.Component
{
    state = {
        name: '',
        email: ''
    }

    componentDidMount = async () => {
        return await this.setProfile()
    }

    onNavigationDidFocus = async () => 
    {
        return await this.setProfile()
    }

    async setProfile()
    {
        const auth = JSON.parse(await AsyncStorage.getItem('auth'));

        if(auth)
        {
            this.setState({name: auth.name, email: auth.email})
        }
        else
        {
            this.props.navigation.navigate('SignIn')
        }
    }


    goToAddressList = () => 
    {
        this.props.navigation.navigate('AddressList');
    }


    goToOrderHistory = () => 
    {
        this.props.navigation.navigate('Orders');
    }

    goToEditProfile = () => 
    {
        this.props.navigation.navigate('EditProfile');
    }


    signOut = () => 
    {
        Alert.alert('Atención', '¿Seguro que desea cerrar sesión?', [
            {text: 'Sí', onPress: () => {
                DeviceEventEmitter.emit(SIGNOUT_EVENT)
                this.props.navigation.navigate('Home')
            }},
            {text: 'No'}
        ])
    }

    render()
    {
        return(
            <View style={styles.container}>
                
                <Header navigation={this.props.navigation} />


                <NavigationEvents onDidFocus={this.onNavigationDidFocus.bind(this)} />

                {/* Profile name */}
                {this.state.email != '' &&
                <View style={styles.profileContainer}>
                    
                    <View style={styles.profileImageContainer}>
                        <Image style={styles.profileImage} source={require('../../../assets/icons/profile_image.png')} />
                    </View>

                    <View style={styles.profileEditContainer}>
                        <Text style={styles.profileNameText}>{this.state.name}</Text>

                        <TouchableOpacity style={styles.profileEditButton} onPress={this.goToEditProfile.bind(this)}>
                            <Text style={styles.profileEditButtonText}>EDITAR PERFIL</Text>
                        </TouchableOpacity>
                    </View>

                </View>}


                {/* Account information */}
                {this.state.email != '' &&
                <View style={styles.accountContainer}>

                    <View style={styles.accountInfoContainer}>
                        <Text style={styles.accountInfoTitleText}>DATOS DE LA CUENTA</Text>
                    </View>

                    <View style={styles.accountInfoContainer}>

                        <View style={styles.accountItemContainer}>
                            <Text style={styles.accountItemTitleText}>Nombre de usuario</Text>
                            <View><Text style={styles.accountItemValueText}>{this.state.name.trim().split(' ')[0]}</Text></View>
                        </View>

                        <View style={styles.accountItemContainer}>
                            <Text style={styles.accountItemTitleText}>E-mail</Text>
                            <Text style={styles.accountItemValueText}>{this.state.email}</Text>
                        </View>

                    </View>

                    <View style={styles.optionsContainer}>
                        
                        <TouchableOpacity style={styles.optionButton} onPress={this.goToOrderHistory.bind(this)}>
                            <Text style={styles.accountItemTitleText}>Mis últimos Pedidos</Text>
                            <Image source={require('../../../assets/icons/dropright_arrow.png')} resizeMode='contain' style={styles.optionButtonIcon} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.optionButton} onPress={this.goToAddressList.bind(this)}>
                            <Text style={styles.accountItemTitleText}>Mis direcciones guardadas</Text>
                            <Image source={require('../../../assets/icons/dropright_arrow.png')} resizeMode='contain' style={styles.optionButtonIcon} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.optionButton} onPress={this.signOut.bind(this)}>
                            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
                        </TouchableOpacity>

                        <View style={styles.eticosSerranoContainer}>
                            <Text style={styles.eticosSerranoText}>Powered by <Text style={{fontFamily: FONTS.BOLD}}>Eticos Serrano.</Text></Text>
                        </View>

                    </View>


                </View>}

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS._FFFFFF},

    profileContainer: {padding: 30, paddingTop:10, flexDirection: 'row', },
    profileImageContainer: {padding: 5, width: 90, height: 90, alignItems: 'center', justifyContent: 'center'},
    profileImage: {width: '100%', height: '100%'},

    profileEditContainer: {padding: 10, justifyContent: 'center'},
    profileNameText: {fontSize: 23,color: COLORS._657272, fontFamily: FONTS.BOLD},
    profileEditButton: {padding: 5, borderRadius: 15, borderWidth: 1.4, borderColor: COLORS._1B42CB, alignItems: 'center', marginVertical: 5, maxWidth: 100,},
    profileEditButtonText: {fontSize: 11, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR},

    accountContainer: {width: '100%',},
    accountInfoContainer: {width: '100%', borderBottomColor: COLORS._F4F4F4, paddingHorizontal: 30, paddingVertical: 15, borderBottomWidth: 1, borderColor: COLORS._F4F4F4},
    accountInfoTitleText: {fontSize: 15, color: COLORS._657272, fontFamily: FONTS.BOLD},
    accountItemContainer: {width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10},
    accountItemTitleText: {fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    accountItemValueText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD, paddingLeft: 10},

    optionsContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 30,},
    optionButton: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: COLORS._F4F4F4, paddingVertical: 15, alignItems: 'center'},
    optionButtonIcon: {width: 10, height: 10},

    signOutButtonText: {fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.REGULAR},

    eticosSerranoContainer: {width: '100%', alignItems: 'flex-end', marginTop: 10},
    eticosSerranoText: {fontSize: 15, color: COLORS._657272, fontFamily: FONTS.REGULAR},
})