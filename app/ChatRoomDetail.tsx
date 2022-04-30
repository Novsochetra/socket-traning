import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {socket} from './App.tsx';

const EVENT_ROOM = {
  SOMEONE_JOIN_ROOM_SUCCESS: {
    color: 'green',
    label: 'Someone has just join room',
  },
  SOMEONE_LEAVE_ROOM_SUCCESS: {color: 'red', label: 'Someone has leave room'},
};

export const ChatRoomDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [messageList, setMessageList] = useState([]);
  const [message, setMesssage] = useState('');
  const [event, setEvent] = useState({});
  const [isSuccessJoinRoom, setIsSuccessJoinRoom] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: route.params?.roomName});
  }, []);

  useEffect(() => {
    socket.emit(`join-room-${route.params.roomId}`);

    socket.on(`join-room-${route.params.roomId}-success`, params => {
      console.log('PARAMS: ', params);
      setEvent({msg: params.msg, color: params.color});
      setMessageList(params.chatHistory);

      let timeout;

      timeout = setTimeout(() => {
        setEvent({});
        clearTimeout(timeout);
      }, 2000);
    });

    socket.on(`leave-room-${route.params.roomId}-success`, params => {
      setEvent(params);
    });

    socket.on(`send-message-${route.params.roomId}-success`, params => {
      console.log('NEW MESSAGE: ', params);
      setMessageList(prevState => [...prevState, params]);
    });

    return () => {
      let timeout;
      socket.emit(`leave-room-${route.params.roomId}`);

      timeout = setTimeout(() => {
        setEvent({});
        clearTimeout(timeout);
      }, 2000);
    };
  }, []);

  const onChangeMessage = text => {
    setMesssage(text);
  };

  const onSendMessage = () => {
    console.log('SEND MESSAGE');
    socket.emit(`send-message-${route.params.roomId}`, {msg: message});
    setMesssage('');
    setMessageList(prevState => [
      ...prevState,
      {msg: message, sender: socket.id},
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isSuccessJoinRoom ? (
          <View style={{backgroundColor: 'green', width: '100%', padding: 16}}>
            <Text style={{fontSize: 16, color: 'white'}}>
              You are conencted to {route.params.roomName}
            </Text>
          </View>
        ) : null}
        {event?.msg ? (
          <View
            style={{backgroundColor: event?.color, width: '100%', padding: 16}}>
            <Text style={{fontSize: 16, color: 'white'}}>{event.msg}</Text>
          </View>
        ) : null}
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          Welcome To Chat Room {socket.id}
        </Text>

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {messageList.map((m, index) => {
            return (
              <>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text key={`message-${index}`} style={styles.msg}>
                    {m?.msg}
                  </Text>
                  <Text
                    key={`message-${index}`}
                    numberOfLines={1}
                    style={styles.msg}>
                    ({m?.sender?.slice(0, 5)}...)
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    marginBottom: 8,
                    backgroundColor: 'gray',
                  }}
                />
              </>
            );
          })}
        </ScrollView>

        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={onChangeMessage}
        />

        <Button title="Send" onPress={onSendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 16,
  },

  textInput: {
    minHeight: 40,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
  },

  msg: {
    fontSize: 16,
  },
});
