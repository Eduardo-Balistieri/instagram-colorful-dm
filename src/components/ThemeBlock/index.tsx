import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Theme } from '../../@types/Theme'
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'


interface ThemeBlockProps {
  theme: Theme
  setTheme: (themeId: number) => void
  activeThemeId: Animated.SharedValue<number>
}

const ThemeBlock = ({ theme, setTheme, activeThemeId }: ThemeBlockProps) => {
  const isActive = useDerivedValue(() => activeThemeId.value === theme.id)

  const activeBtn = useAnimatedStyle(() => {
    return {
      borderWidth: isActive.value ? 0 : 2,
      backgroundColor: isActive.value ? '#008DFF' : 'transparent'
    }
  })

  const activeIndicator = useAnimatedStyle(() => {
    return {
      backgroundColor: isActive.value ? '#000' : 'transparent'
    }
  })


  return (
    <TouchableOpacity
      onPress={() => setTheme(theme.id)}
      activeOpacity={0.6}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LinearGradient
            colors={theme.colors.length > 1 ? theme.colors : theme.colors.concat(theme.colors[0])}
            style={styles.colors}
          />
          <Text style={styles.name}>{theme.name}</Text>
        </View>

        <Animated.View style={[styles.activeBtn, activeBtn]}>
          <Animated.View style={[styles.activeIndicator, activeIndicator]} />
        </Animated.View>
      </View>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  colors: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  name: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16
  },

  activeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: '#575757',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5
  }
})

export default ThemeBlock