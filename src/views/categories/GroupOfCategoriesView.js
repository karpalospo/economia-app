import React from "react";
import { View, StyleSheet, FlatList, SectionList, StatusBar} from "react-native";
import { COLORS, ADS_GALLERY } from "../../utils/constants";
import { CategoryHorizontalCard } from "../../components/category/CategoryHorizontalCard";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";
import { URL, PANEL_API } from "../../services/service";
import { FormatBannerItem } from "../../utils/formatter";
import Carousel from "../../components/Carousel";

export default class GroupOfCategories extends React.Component {

    state = {
        id: this.props.navigation.getParam('id', 0),
        categories: this.props.navigation.getParam('categories', []),
        loadingGallery: false,
        groupGallery: [],
    }

    async componentDidMount ()
    {
        await this.retrieveGallery()
    }   

    onTapCategory = (title, id, subCategories) =>
    {
        this.props.navigation.navigate('Category', {title, id, subCategories})
    }

    retrieveGallery = async () =>
    {
        this.setState({loadingGallery: true})

        const groupGallery = await this.retrieveMedia(ADS_GALLERY.GRUPOS, this.state.id)
        
        this.setState({loadingGallery: false, groupGallery})
    }

    retrieveMedia = async (media, group = '') => 
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

    overrideHeaderSection = ({ item, index, section: { title, data } }) => {
        return (
            <View style={styles.groupSectionContainer}>

                <HeaderWithTitleAndBackButton title='Categorias' subtitle={this.props.navigation.getParam('title', '')} onPress={() => this.props.navigation.goBack()} />

            </View>
        )
    }


    overrideCategoriesSection = ({ item, index, section: { title, data } }) => {
        return (
            <View style={styles.categoriesContainer}>

                {/* Gallery  */}
                {this.state.groupGallery.length > 0 &&
                <View style={styles.groupGalleryContainer}>
                    <Carousel 
                        imageContainerStyle={styles.carouselImageContainer}
                        images={this.state.groupGallery}
                        imageResizeMode={'cover'} 
                        dotsColor={COLORS._1B42CB}
                        onTapImage={() => {}}
                        autoscroll={true}
                        showIndicator={false}
                    />
                </View>}

                <FlatList
                    keyExtractor={(item, index) => `category_${index}`}
                    data={this.state.categories}
                    renderItem={({ item, index }) => { 
                        return (
                            <CategoryHorizontalCard title={item.name} image={{uri: `${URL.S3_GROUPS}${this.state.id}/${item.id}.png`}} onPress={this.onTapCategory.bind(this, item.name, item.id, item.subCategories)} />
                        )
                    }}
                />
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>

                <SectionList
                    keyExtractor={(item, index) => `section_${index}`}
                    renderItem={({ item, index, section }) => <View />}
                    extraData={this.state}
                    sections={[
                        { title: 'Title', data: [{}], renderItem: this.overrideHeaderSection.bind(this) },
                        { title: 'Categories', data: [{}], renderItem: this.overrideCategoriesSection.bind(this) },
                    ]}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS._F4F4F4, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 0 },

    groupSectionContainer: { width: '100%', marginTop: 0 },

    categoriesContainer: {width: '100%', paddingHorizontal: 15, },

    groupGalleryContainer: {width: '100%', padding: 15,},
    carouselImageContainer: {borderRadius: 10, overflow: 'hidden'},
})