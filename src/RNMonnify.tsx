import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {MonnifyWebViewMessage, RNMonnifyProps, RNMonnifyRef} from './types';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {TypedJSONParse} from './utils';

const WINDOW_WIDTH = Dimensions.get('window').width;

const RNMonnify = forwardRef<RNMonnifyRef, RNMonnifyProps>(function RNMonnify(
  {
    amount,
    currency,
    reference,
    customerEmail,
    customerFullName,
    apiKey,
    contractCode,
    paymentDescription,
    autoStart,
    onCancel,
    onSuccess,
    spinnerColor = 'blue',
  },
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

  const handleNavStateChange = useCallback((state: WebViewNavigation) => {
    console.log({state});
  }, []);

  const MonnifyHTML = `
  <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Monnify</title>
        </head>
        <body onload="payWithMonnify()" style="background-color:#fff;height:100vh">
          <script type="text/javascript" src="https://sdk.monnify.com/plugin/monnify.js"></script>
          <script>
            function payWithMonnify() {
                MonnifySDK.initialize({
                    amount: ${amount},
                    currency: ${currency || 'NGN'},
                    reference: ${reference || new String(new Date().getTime())},
                    customerFullName: ${customerFullName},
                    customerEmail: ${customerEmail},
                    apiKey: ${apiKey},
                    contractCode: ${contractCode},
                    paymentDescription: ${paymentDescription},
                    metadata: {
                        deviceType: 'mobile'
                    },
                    onComplete: function(response) {
                        let response = {status: "success", data: response};
                        window.ReactNativeWebView.postMessage(JSON.stringify(response));
                    },
                    onClose: function(data) {
                        let response = {status: "failed", data: response};
                        window.ReactNativeWebView.postMessage(JSON.stringify(response));
                    }
                });
            }
          </script>
        </body>
      </html> 
  `;

  const handleMessageReceived = useCallback(
    (data: string) => {
      const res = TypedJSONParse<MonnifyWebViewMessage>(data);

      if (res?.status === 'success') {
        setShowModal(false);
        onSuccess(res);
        return;
      }

      if (res?.status === 'failed') {
        setShowModal(false);
        onCancel(res);
      }
    },
    [onSuccess, onCancel],
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        startTransaction() {
          setShowModal(true);
        },
        endTransaction() {
          setShowModal(false);
        },
      };
    },
    [],
  );

  const autoStartCheck = useCallback(() => {
    if (autoStart) {
      setShowModal(true);
    }
  }, [autoStart]);

  useEffect(() => {
    autoStartCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      style={styles.container}
      visible={showModal}
      animationType="slide"
      transparent={false}>
      <SafeAreaView style={styles.container}>
        <WebView
          style={styles.container}
          source={{html: MonnifyHTML}}
          onMessage={e => {
            handleMessageReceived(e.nativeEvent?.data);
          }}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavStateChange}
          ref={webviewRef}
          cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'}
        />

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressLoaderTrack, {backgroundColor: 'white'}]}>
            <Animated.View
              style={[
                styles.progressLoader,
                {
                  backgroundColor: 'black',
                  transform: [
                    {
                      scaleX: progressAnimation.current.interpolate({
                        inputRange: [0, 0.8],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: progressAnimation.current.interpolate({
                    inputRange: [0, 0.9, 1],
                    outputRange: [1, 1, 0],
                  }),
                },
              ]}
            />
            <ActivityIndicator size="large" color={spinnerColor} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressLoaderTrack: {
    width: WINDOW_WIDTH,
    height: 3,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  progressLoader: {
    width: WINDOW_WIDTH * 2,
    left: -WINDOW_WIDTH,
    height: 3,
  },
  progressContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});

export default RNMonnify;
