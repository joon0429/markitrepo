import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  GestureResponderEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors, spacing } from '@constants/theme';

interface PhotoCarouselProps {
  photos: string[];
  onDoubleTap?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CAROUSEL_HEIGHT = SCREEN_WIDTH * 1.2;

export default function PhotoCarousel({ photos, onDoubleTap }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const lastTap = useRef<number>(0);
  const heartScaleValue = useRef(new Animated.Value(0));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(slideIndex);
  };

  const handleDoubleTap = (_event: GestureResponderEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // double tap detected
      if (onDoubleTap) {
        onDoubleTap();
        // animate heart
        heartScaleValue.current.setValue(0);
        Animated.sequence([
          Animated.spring(heartScaleValue.current, {
            toValue: 1,
            useNativeDriver: true,
            friction: 3,
          }),
          Animated.timing(heartScaleValue.current, {
            toValue: 0,
            duration: 400,
            delay: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      lastTap.current = now;
    }
  };

  const handleSingleTap = () => {
    setFullscreenVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={handleSingleTap}
              onPressIn={handleDoubleTap}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: photo }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* double tap heart animation */}
        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
        <Animated.View
          style={[
            styles.heartOverlay,
            {
              transform: [{ scale: heartScaleValue.current }],
              opacity: heartScaleValue.current,
              pointerEvents: 'none' as const,
            },
          ]}
        >
          <Text style={styles.heartIcon}>♥</Text>
        </Animated.View>

        {/* dots indicator */}
        {photos.length > 1 && (
          <View style={styles.dotsContainer}>
            {photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* fullscreen modal */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setFullscreenVisible(false)}
          >
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: activeIndex * SCREEN_WIDTH, y: 0 }}
            >
              {photos.map((photo, index) => (
                <View key={index} style={styles.fullscreenImageContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullscreenVisible(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    backgroundColor: colors.border,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  heartIcon: {
    fontSize: 100,
    color: colors.error,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
  },
  fullscreenImageContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 32,
    color: colors.background,
    lineHeight: 32,
  },
});
