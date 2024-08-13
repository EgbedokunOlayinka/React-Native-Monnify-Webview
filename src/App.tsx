import React, {useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import RNMonnify from './RNMonnify';
import {RNMonnifyRef} from './types';

function App(): React.JSX.Element {
  // const ref = useRef(null);
  const webViewRef = useRef<RNMonnifyRef>(null);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color: 'white'}}>Honor bound</Text>
      <Button
        title="Start Txn"
        onPress={() => webViewRef?.current?.startTransaction()}
      />
      <RNMonnify
        amount={1000}
        customerEmail="test@mail.com"
        customerFullName="John Doe"
        apiKey="MK_TEST_A2TCPC3ZHD"
        contractCode="7164425639"
        onCancel={() => {}}
        onSuccess={() => {}}
        ref={webViewRef}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
