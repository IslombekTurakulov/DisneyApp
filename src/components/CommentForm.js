import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  const renderInnerCom = () => (
    <View>
      <TextInput
        multiline
        placeholder="Comment..."
        maxLength={256}
        onChangeText={(text) => {
          setCommentText(text);
          route.params[0].comment = text;
        }}
        value={commentText}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bscRef}
        snapPoints={[Platform.OS === "ios" ? 600 : 250, 0]}
        initialSnap={1}
        callbackNode={fallc}
        enabledContentGestureInteraction={false}
        renderContent={renderInnerCom}
        renderHeader={renderHeader}
      />
        <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        placeholderTextColor="gray"
        value={comment}
        onChangeText={setComment}
        multiline={true}
        />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default CommentForm;
