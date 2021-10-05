import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import { Asset } from "expo-asset";
import SessionStore from "../../reducers/session.reducer";
import { REDUCER_SET_SESSION, FONTS } from "../../utils/constants";

import * as Font from 'expo-font';

export default class Entry extends React.Component
{

    // Later on in your component
    async componentDidMount() {

        // Prevent device font scalling 
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;

        await Font.loadAsync({
            [FONTS.BOLD]: require('../../../assets/fonts/roboto/Roboto-Bold.ttf'),
            [FONTS.REGULAR]: require('../../../assets/fonts/roboto/Roboto-Regular.ttf'),
        })

        await Asset.loadAsync(
            [
                require('../../../assets/icons/shop_cart/circle_currency.png'),
                require('../../../assets/icons/shop_cart/circle_flag.png'),
                require('../../../assets/icons/shop_cart/circle_location_mark.png'),
                require('../../../assets/icons/shop_cart/circle_shop_cart.png'),
                
                require('../../../assets/icons/bar_scan.png'),
                require('../../../assets/icons/dropup_arrow.png'),
                require('../../../assets/icons/dropleft_arrow.png'),
                require('../../../assets/icons/dropright_arrow.png'),
                require('../../../assets/icons/dropdown_arrow.png'),
                require('../../../assets/icons/burger_button.png'),


            ]
        )

        const session = JSON.parse(await AsyncStorage.getItem('auth'))
        
        if(session)
        {
            SessionStore.dispatch({type: REDUCER_SET_SESSION, session})
        }

        this.props.navigation.navigate('Home')
    }

    render()
    {
        return (
            <View />
        )
    }

}
