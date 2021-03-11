import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'

import { Theme } from '../../@types/Theme'


const { width, height } = Dimensions.get('window')

interface GradientProps {
  theme: Theme
  activeThemeId: Animated.SharedValue<number>
}

const Gradient = ({ theme, activeThemeId }: GradientProps) => {
  const { id, colors } = theme
  const isActive = useDerivedValue(() => activeThemeId.value === id)

  const opacity = useAnimatedStyle(() => {
    return { opacity: isActive.value ? 1 : 0 }
  })

  return (
    <Animated.View style={opacity}>
      {colors.length > 1
        ? <LinearGradient colors={colors} style={styles.fill} />
        : <View style={{ backgroundColor: colors[0], ...styles.fill }} />
      }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  fill: {
    width,
    height,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})

export default Gradient