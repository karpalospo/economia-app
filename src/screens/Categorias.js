import React, {useState, useContext, useEffect } from "react";
import { View, StyleSheet, FlatList, SectionList, Text, StatusBar} from "react-native";
import { CategoryHorizontalCard } from "../components/CategoryHorizontalCard";
import { HeaderWithTitleAndBackButton } from "../components/HeaderWithTitleAndBackButton";
import { URL, PANEL_API } from "../services/services";
import { FormatBannerItem } from "../utils/formatter";
import Carousel from "../components/Carousel";
import BottomMenu from "../components/BottomMenu";

const Categorias = (props) => {

    const { id, categories, title } = props.route.params;

    const [idCat, setIDCat] = useState(id);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [todasLasCategorias, setTodasLasCategorias] = useState(false);
    const [groupGallery, setGroupGallery] = useState([]);


    const retrieveMedia = async (media, group = '') => 
    {
        let gallery = []

        const res = await PANEL_API.GET.RetrieveBanners(media, false, '', group)

        if(!res.error)
        {
            for (let i = 0; i < res.message.data.length; i++) {
                const element = res.message.data[i];
                gallery.push(FormatBannerItem(element));
            }
        }

        return gallery
    }

    useEffect(() => {
        (async function () {
            if(id == 0) setTodasLasCategorias(true)
            if(id > 0) {
                setLoadingGallery(true)
                const groupGallery = await retrieveMedia(8, id)
                setLoadingGallery(false)
                setGroupGallery(groupGallery)
            }
        })

    }, [idCat])

    onTapCategory = (title, id, subCategories) =>
    {
        props.navigation.navigate('CategoriaView', {title, id, subCategories})
    }


    return (
        <View style={styles.container}>

            <View style={styles.groupSectionContainer}>

                <HeaderWithTitleAndBackButton title='Categorias' subtitle={title} onPress={() => props.navigation.goBack()} />

            </View>

            {todasLasCategorias && <Text>Todas las categorias</Text>}

            <View style={styles.categoriesContainer}>

                {groupGallery.length > 0 &&
                    <View style={styles.groupGalleryContainer}>
                        <Carousel 
                            imageContainerStyle={styles.carouselImageContainer}
                            images={groupGallery}
                            imageResizeMode={'cover'} 
                            dotsColor="#1B42CB"
                            onTapImage={() => {}}
                            autoscroll={true}
                            showIndicator={false}
                        />
                    </View>
                }

                <FlatList
                    style={{marginBottom:80}}
                    keyExtractor={(item, index) => `category_${index}`}
                    data={categories}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => { 
                        return (
                            <CategoryHorizontalCard title={item.name} image={{uri: `${URL.S3_GROUPS}${idCat}/${item.id}.png`}} onPress={() => onTapCategory(item.name, item.id, item.subCategories)} />
                        )
                    }}
                />


            </View>

            <View style={{height:60}} />

            <BottomMenu navigation={props.navigation} />

        </View>
    )
    
}

export default Categorias

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F4F4", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 0 },

    groupSectionContainer: { width: '100%', marginTop: 0 },

    categoriesContainer: {width: '100%', paddingHorizontal: 15, },

    groupGalleryContainer: {width: '100%', padding: 15,},
    carouselImageContainer: {borderRadius: 10, overflow: 'hidden'},
})