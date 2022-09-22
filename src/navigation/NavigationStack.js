import React, { useEffect, useState, useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { View,  ActivityIndicator, SafeAreaView } from 'react-native'
import AppStacks from './AppStacks'
import { UtilitiesContext } from '../context/UtilitiesContext'
import { styles } from '../global/styles'

const NavigationStack = () => {
     
    const { loading} = useContext(UtilitiesContext)

    return (
        <NavigationContainer>
            {loading ? 
                <SafeAreaView style={styles.main}>
                    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                        <ActivityIndicator color="#FF2F6C" />
                    </View>
                </SafeAreaView >
                :
                <AppStacks />
            }       
        </NavigationContainer>
    )
}
export default NavigationStack

