import React, {useEffect, useState, useRef} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList, Platform, Image} from "react-native";
import { WebView } from 'react-native-webview'
import { COLORS, FONTS, TOTAL_CHARS_UNTIL_SEARCH } from "../../utils/constants";
import { API, URL } from "../../services/service";
import { SafeAreaView } from "react-navigation";
import { CalculateMarginTopForAndroid } from "../../utils/ui_helper";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";

export default DictinaryView = props =>
{
    const searchInputRef = useRef()

    const [suggestionsOffset, setSuggestionsOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showWebView, setShowWebView] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [uri, setUri] = useState('')

    useEffect(() => {
        if(searchInputRef.current)
        {
            searchInputRef.current.focus()
        }
    }, [])

    const getMedicineSuggestions = async () => 
    {
        setLoading(true)
        const res = await API.GET.RetrieveDictionaryOfMedicines(query)
        setLoading(false)
        
        if(!res.error)
        {   
            setSuggestions([...res.message.diccionario])
        }
    }

    const getMedicine = (url) => 
    {
        setShowSuggestions(false)
        setShowWebView(false)
        setUri(`${URL.HOST}/economia/site/vademecum/${url}`)
        setShowWebView(true)
    }

    const onLayoutSearchBar = (layout) =>
    {
        if(suggestionsOffset === 0)
        {
            setSuggestionsOffset(layout.nativeEvent.layout.height + (Platform.OS == 'ios' ? 35 : 0))
        }
    }

    return (
        <SafeAreaView style={[styles.container, (Platform.OS === 'android' ? CalculateMarginTopForAndroid('paddingTop') : null)]}>

            {/* Search bar */}
            <View style={styles.searchBarWrapper} onLayout={onLayoutSearchBar.bind(this)}>

                <Image source={require('../../../assets/la_economia_h.png')} style={styles.companyLogo} resizeMode='contain' />

                <View style={styles.searchBarInputContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
                        <Image source={require('../../assets/icons/dropleft_arrow.png')} style={{width: 18, height: 18}} resizeMode='contain'  />
                    </TouchableOpacity>

                    {/* Text input search bar */}
                    <TextInput
                        ref = {searchInputRef}
                        autoCapitalize='none'
                        style={styles.searchBarInput}
                        placeholder='Ingresa el nombre del medicamento'
                        placeholderTextColor={COLORS._A5A5A5}
                        onFocus={() => setShowSuggestions(true)}
                        onChangeText={async (query) => {
                            setQuery(query)
                            if(query.length > TOTAL_CHARS_UNTIL_SEARCH)
                            {
                                await getMedicineSuggestions(query)
                            }
                        }}
                        value={query}
                        onSubmitEditing={getMedicineSuggestions.bind(this)}
                    />

                    <View style={{width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Image source={require('../../assets/icons/search.png')} style={{width: 18, height: 18}} tintColor="#666" resizeMode='contain'  />
                    </View>

                </View> 
            </View>

            {showWebView && 
            <WebView 
                source={{ uri }} 
                style={{ width: '80%', alignSelf: 'center', }} 
                scalesPageToFit={false}
                automaticallyAdjustContentInsets={false}
            />}

            {(suggestions.length > 0 && showSuggestions) &&
            <View style={[styles.suggestionsContainer, {marginTop: suggestionsOffset}]}>
                
                {loading && <FullWidthLoading />}

                <FlatList 
                    keyExtractor={(item, index) => `searchMatch_${index}`}
                    data={suggestions}
                    renderItem={({ item, index }) => {
                        return(
                            <TouchableOpacity style={styles.searchMatchItemContainer} onPress={getMedicine.bind(this, item.enlace)}>
                                <Text style={styles.searchMatchItemText}>{item.producto}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />

            </View>}

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._FFFFFF, marginTop: "0.1%", paddingTop:40},

    searchBarWrapper: {width: '100%', paddingHorizontal: 15, alignItems: 'center'},
    searchBarInputContainer: {width: '100%', alignItems: 'center', flexDirection: 'row', paddingVertical: 8, marginTop: 5, marginBottom: 10, borderColor: COLORS._A5A5A5, borderBottomWidth: 1,},
    searchBarInput: {width: '80%', color: COLORS._A5A5A5, backgroundColor: COLORS.NO_COLOR, fontSize: 14, fontFamily: FONTS.REGULAR,},

    searchMatchItemContainer: {width: '100%', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 2, borderColor: COLORS._F4F4F4},
    searchMatchItemText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },

    suggestionsContainer: {position: 'absolute', backgroundColor: COLORS._FFFFFF, width: '100%', height: '70%'},
    backButton: {width: '10%', justifyContent: 'center'},
    companyLogo: {width: '100%', height: 30,},
})