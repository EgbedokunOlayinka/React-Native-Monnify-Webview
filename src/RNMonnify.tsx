import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react';
import {Animated, Modal, SafeAreaView, StyleSheet} from 'react-native';
import {RNMonnifyProps} from './types';
import WebView, {WebViewNavigation} from 'react-native-webview';

const RNMonnify = forwardRef<ReactNode, RNMonnifyProps>(function RNMonnify(
  props,
  ref,
) {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const progressAnimation = useRef(new Animated.Value(0));

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    Animated.sequence([
      Animated.timing(progressAnimation.current, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation.current, {
        toValue: 0.7,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation.current, {
        toValue: 0.8,
        duration: 5000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLoadEnd = useCallback(() => {
    Animated.timing(progressAnimation.current, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  }, []);

  const handleNavStateChange = (state: WebViewNavigation) => {
    //
  };

  return (
    <Modal
      style={styles.container}
      visible={showModal}
      animationType="slide"
      transparent={false}>
      <SafeAreaView style={styles.container}>
        <WebView
          style={styles.container}
          // source={{ html: Paystackcontent }}
          // onMessage={(e) => {
          //   messageReceived(e.nativeEvent?.data);
          // }}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavStateChange}
          ref={webviewRef}
          cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'}
        />
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
