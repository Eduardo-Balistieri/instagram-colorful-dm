import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native'

import MaskedView from '@react-native-community/masked-view'
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { Message } from '../../@types/Message'
import { themes } from '../../data/themes'
import Options from '../Options'
import Gradient from '../Gradient'


const MESSAGE_BLOCK_WIDTH = Dimensions.get('window').width * 0.7

interface ChatProps {
  messages: Message[]
}

const Chat = ({ messages }: ChatProps) => {
  const activeThemeId = useSharedValue(themes[0].id)
  const scrollY = useSharedValue(0)

  const changeTheme = (themeId: number) => {
    if (activeThemeId.value === themeId)
      return
    activeThemeId.value = themeId
  }
  const scrollHandler = useAnimatedScrollHandler(event => scrollY.value = event.contentOffset.y)


  const maskElementPosition = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -scrollY.value }]
    }
  })


  const getDynamicStyles = (message: Message, index: number): any => {
    const alignSelf = message.received ? 'flex-start' : 'flex-end'
    if (message.received)
      return { marginVertical: 1.5, alignSelf }

    return {
      marginTop: messages[index - 1]?.received ? 8 : 1.5,
      marginBottom: messages[index + 1]?.received ? 8 : 1.5,
      alignSelf
    }
  }


  if (messages.length <= 0)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color='#FFF' />
      </View>
    )

  return (
    <>
      <Options activeThemeId={activeThemeId} setTheme={changeTheme} />

      <MaskedView
        maskElement={
          <Animated.View style={[styles.contentContainer, maskElementPosition]}>
            {messages.map((message, index) => (
              <View
                key={message.id}
                style={[
                  { backgroundColor: 'red', ...getDynamicStyles(message, index) }, styles.messageWrapper,
                ]}
              >
                <Text style={styles.message}>{message.message}</Text>
              </View>
            ))}
          </Animated.View>
        }
      >
        <Animated.ScrollView
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          style={{ zIndex: 10 }}
        >
          {messages.map((message, index) => (
            <View
              key={message.id}
              style={[
                { backgroundColor: message.received ? '#262626' : 'transparent', zIndex: 10, ...getDynamicStyles(message, index) },
                styles.messageWrapper
              ]}
            >
              <Text style={styles.message}>{message.message}</Text>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.gradientWrapper}>
          {themes.map(theme => <Gradient key={theme.id} theme={theme} activeThemeId={activeThemeId} />)}
        </View>
      </MaskedView>
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 55
  },

  messageWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: MESSAGE_BLOCK_WIDTH,
    borderRadius: 20
  },
  message: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14.5
  },

  gradientWrapper: {
    position: 'absolute',
    zIndex: 5
  }
})

export default Chat