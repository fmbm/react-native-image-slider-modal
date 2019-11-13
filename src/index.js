import React, { Component } from "react"
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import PropTypes from "prop-types"
import ImageViewer from "react-native-image-zoom-viewer"

class ImageSlider extends Component {
  state = {
    sliderIndex: 0,
    modalIndex: 0,
    modalVisible: false
  }

  constructor(props) {
    super(props)
    this.toggleImageModal = this.toggleImageModal.bind(this)
    this.onChangeImageModal = this.onChangeImageModal.bind(this)
  }

  toggleImageModal(index = 0) {
    this.setState({
      modalVisible: !this.state.modalVisible,
      modalIndex: index
    })
  }

  onImageSliderScroll = event => {
    const { imageUrls } = this.props

    let imageSliderPosition =
      event.nativeEvent.contentOffset.x / event.nativeEvent.contentSize.width
    let imageSliderTotal = this.props.imageUrls.length

    imageUrls.map((event, key) => {
      let eventSliderPosition = key / imageSliderTotal

      if (eventSliderPosition == imageSliderPosition)
        this.setState({
          sliderIndex: key
        })
    })
  }

  createImageSliderRef = ref => (this.imageSliderRef = ref)

  onChangeImageModal(index) {
    this.imageSliderRef.scrollTo({
      x: Dimensions.get("window").width * index - 1
    })
    this.setState({
      modalIndex: index,
      sliderIndex: index
    })
  }

  render() {
    const { imageUrls, showDots = true, sliderStyle, imageCache } = this.props
    const { modalVisible } = this.state

    return (
      <View style={styles.container}>
        <ScrollView
          pagingEnabled
          horizontal
          style={[styles.slider, sliderStyle]}
          showsHorizontalScrollIndicator={false}
          onScroll={this.onImageSliderScroll}
          ref={this.createImageSliderRef}
        >
          {imageUrls.map((image, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={styles.imageContainer}
              onPress={() => this.toggleImageModal(index)}
            >
              <Image source={{ uri: image.url, cache: imageCache }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {showDots && (
          <View style={styles.sliderDots}>
            {imageUrls.map((image, key) => (
              <View
                key={key}
                style={[
                  styles.sliderDot,
                  this.state.sliderIndex == key && styles.sliderDotSelected
                ]}
              />
            ))}
          </View>
        )}
        <Modal visible={modalVisible} style={styles.modal}>
          <SafeAreaView style={styles.modalTop}>
            <TouchableOpacity
              onPress={this.toggleImageModal}
              style={styles.closeButton}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Text style={styles.closeText}>{"Close"}</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <ImageViewer
            index={this.state.modalIndex}
            imageUrls={imageUrls}
            enableSwipeDown
            onChange={this.onChangeImageModal}
            onSwipeDown={this.toggleImageModal}
          />
        </Modal>
      </View>
    )
  }
}

ImageSlider.propTypes = {
  imageUrls: PropTypes.array.isRequired,
  imageCache: PropTypes.string
}

ImageSlider.defaultProps = {
  imageCache: 'default'
}

export default ImageSlider

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    height: 300
  },
  slider: {
    backgroundColor: "#000"
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch"
  },
  image: {
    width,
    height: 300
  },

  sliderDots: {
    marginTop: -30,
    paddingVertical: 10,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  sliderDot: {
    opacity: 0.35,
    marginHorizontal: 5,
    backgroundColor: "white",
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: 10,
    height: 10,
    borderRadius: 5
  },
  sliderDotSelected: {
    opacity: 0.85
  },
  modalTop: {
    position: "absolute",
    zIndex: 1,
    right: 20,
    top: 0
  },
  closeButton: {},
  closeText: {
    color: "#fff"
  }
})
