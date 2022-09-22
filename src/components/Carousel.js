import React from 'react';

import { View, ScrollView, Image, StyleSheet, Dimensions, Animated, TouchableOpacity, findNodeHandle, ActivityIndicator } from 'react-native';


const { width } = Dimensions.get('window');
// const height = width * .5;

export default class Carousel extends React.Component {



	static defaultProps = {
		images: [],
		dotsColor: "#1B42CB",
		imageStyle: {
			width,
			height: 190,
		},
		imageContainerStyle: {
			backgroundColor: 'rgba(0,0,0,0)',
		},
		imageResizeMode: 'cover',
		onTapImage: () => { },
		showIndicator: true,
		autoscroll: false,
		autoScrollInterval: 8000,
	}

	constructor(props) {
		super(props)

		this.scrollX = new Animated.Value(0)

		this.state = {
			carouselImageDefaultWidth: 0,
			carouselImageDefaultHeight: this.props.imageStyle.height,
		}

		this.position = 0;
	}

	componentDidMount() {
		if (this.props.autoscroll && this.props.images.length > 1) {
			this.nextImage = 0
			this.autoScrollInterval = setInterval(() => {
				this.autoScroll()
			}, this.props.autoScrollInterval)
		}
	}


	autoScroll() {
		if (this.scrollViewRef && this[`image_${this.nextImage}`]) {
			this[`image_${this.nextImage}`].measureLayout(
				findNodeHandle(this.scrollViewRef), (x, y) => {
					this.scrollViewRef.scrollTo({ x: x, y: 0, animated: true })
					this.nextImage++
					if (this.nextImage == this.props.images.length) {
						this.nextImage = 0
					}
				})
		}
	}

	getImageIndex(index) {
		let ret = { id: 0, data: {} }
		this.props.images.forEach(item => {
			if (item.id == index) ret = item
		})
		return ret
	}

	render() {
		// position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
		this.position = Animated.divide(this.scrollX, this.state.carouselImageDefaultWidth > 0 ? this.state.carouselImageDefaultWidth : width);

		let _images = []
		const { images, images2 } = this.props;

		if (images2) _images = images2
		else {
			images.forEach(item => {
				if (item.mobile && item.mobile != "") _images.push({ source: { uri: item.mobile }, id: item.id })
			})

		}

		if (_images && _images.length) {
			return (
				<View style={[styles.scrollContainer]}>
					<ScrollView
						ref={(ref) => this.scrollViewRef = ref}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}

						onLayout={(event) => {
							// With this event we detect the available width to the carousel images
							const { width, height } = event.nativeEvent.layout;

							let imageDimensions = {
								carouselImageDefaultWidth: this.state.carouselImageDefaultWidth,
								carouselImageDefaultHeight: this.state.carouselImageDefaultHeight,
							};

							if (this.state.carouselImageDefaultWidth == 0) {
								imageDimensions.carouselImageDefaultWidth = width;
							}

							if (this.state.carouselImageDefaultHeight == 0) {
								imageDimensions.carouselImageDefaultHeight = height;
							}

							this.setState({ carouselImageDefaultHeight: imageDimensions.carouselImageDefaultHeight, carouselImageDefaultWidth: imageDimensions.carouselImageDefaultWidth })
						}}

						// the onScroll prop will pass a nativeEvent object to a function
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
							{ useNativeDriver: false }
						)}
						scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call

					>
						{_images.map((image, index) => (
							<TouchableOpacity
								activeOpacity={1}
								ref={(ref) => this[`image_${index}`] = ref}
								style={[this.props.imageContainerStyle, { height: this.state.carouselImageDefaultHeight }]}
								onPress={() => { this.props.onTapImage(this.getImageIndex(image.id)) }} key={index}
							>
								<Image style={{ height: this.state.carouselImageDefaultHeight, width: this.state.carouselImageDefaultWidth }} source={image.source} resizeMode={this.props.imageResizeMode} />
							</TouchableOpacity>
						))}
					</ScrollView>

					{(_images.length > 1 && this.props.showIndicator) &&
						<View style={{ alignItems: 'center', width: '100%', height: 10, justifyContent: 'center', marginTop: 5 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'center', width: '30%', alignItems: 'center' }}>
								{images.map((_, i) => { // the _ just means we won't use that parameter
									const opacity = this.position.interpolate({
										inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
										outputRange: [0.1, 1, 0.1], // when position is not i, the opacity of the dot will animate to 0.3
										extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
									});
									const height = this.position.interpolate({
										inputRange: [i - 1, i, i + 1],
										outputRange: [4, 4, 4],
										extrapolate: 'clamp',
									})
									const width = this.position.interpolate({
										inputRange: [i - 1, i, i + 1],
										outputRange: [6, 14, 6],
										extrapolate: 'clamp',
									})
									return (
										<Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
											key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
											style={{ backgroundColor: this.props.dotsColor, opacity, height, width, borderRadius: 2, marginHorizontal: 4, }}
										/>
									);
								})}
							</View>
						</View>
					}
				</View>
			);
		}
		return (
		<View style={styles.loading}>
			<ActivityIndicator color="#1B42CB" size={24} />
		</View>
		);
	}
}

const styles = StyleSheet.create({
	loading: {
		width: '100%',
		minHeight: 150,
		backgroundColor: "#c6c6c6",
		justifyContent:"center",
		alignItems:"center"
	},

	container: {
		alignItems: 'center',
	},
	scrollContainer: {
		width: '100%',
	},
});