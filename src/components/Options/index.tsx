import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, FlatList, Text } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { themes } from '../../data/themes'
import ThemeBlock from '../ThemeBlock'


const { width } = Dimensions.get('window')

const FLOATING_HEIGHT = 10
const BAR_HEIGHT = 2


interface OptionsProps {
  setTheme: (themeId: number) => void
  activeThemeId: Animated.SharedValue<number>
}

const Options = ({ setTheme, activeThemeId }: OptionsProps) => {
  const showing = useSharedValue(false)

  const bar1_rotation = useSharedValue(0)
  const bar2_rotation = useSharedValue(0)
  const bar2_top = useSharedValue(FLOATING_HEIGHT - BAR_HEIGHT)

  const menuContentPosition = useSharedValue(width)


  const handleMenuPress = () => {
    if (showing.value) {
      menuContentPosition.value = withTiming(width)

      bar1_rotation.value = withTiming(0)
      bar2_rotation.value = withTiming(0)
      bar2_top.value = withTiming(FLOATING_HEIGHT - BAR_HEIGHT)
    }
    else {
      menuContentPosition.value = withTiming(0)

      bar1_rotation.value = withTiming(-135)
      bar2_rotation.value = withTiming(135)
      bar2_top.value = withTiming(0)
    }

    showing.value = !showing.value
  }

  const menuContentAnimatedStyles = useAnimatedStyle(() => {
    return { left: menuContentPosition.value }
  })

  const bar_1Styles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${bar1_rotation.value}deg` }]
    }
  })

  const bar_2Styles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${bar2_rotation.value}deg` }],
      top: bar2_top.value
    }
  })

  return (
    <>
      <View style={styles.floatingMenu}>
        <TouchableOpacity onPress={handleMenuPress}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.floatingMenuContent}>
              <Animated.View style={[styles.bar, bar_1Styles]} />
              <Animated.View style={[styles.bar, bar_2Styles]} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.menuContent, menuContentAnimatedStyles]}>
        <FlatList
          ListHeaderComponent={
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 20 }}>{'Colors & Gradients'}</Text>
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 55,
            paddingBottom: 20
          }}
          data={themes}
          keyExtractor={theme => theme.name}
          renderItem={({ item: theme }) => (
            <ThemeBlock
              theme={theme}
              setTheme={setTheme}
              activeThemeId={activeThemeId}
            />
          )}
        />
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  floatingMenu: {
    position: 'absolute',
    top: 53,
    right: 0,
    zIndex: 100,
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatingMenuContent: {
    width: 30,
    height: FLOATING_HEIGHT
  },

  bar: {
    backgroundColor: 'white',
    width: '100%',
    height: BAR_HEIGHT,
    borderRadius: 1,
    position: 'absolute'
  },

  menuContent: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width,
    zIndex: 90
  }
})

export default Options