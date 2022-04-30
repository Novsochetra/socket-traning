import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
interface IRoom {
  id: number;
  name: string;
}

export const CHAT_ROOM_LIST: IRoom[] = [
  {id: 1, name: 'Eat Taro'},
  {id: 2, name: 'Jak Ball'},
  {id: 3, name: 'Srey Sart'},
  {id: 4, name: 'KTV'},
  {id: 5, name: 'Learn'},
];

export const ChatRoomListScreen = () => {
  const navigation = useNavigation();

  const onPressEachRoom = useCallback(({id}: {id: IRoom['id']}): void => {
    navigation.navigate('ChatRoomDetail', {
      roomId: id,
      roomName: CHAT_ROOM_LIST.filter((room: IRoom) => room.id == id)?.[0]
        ?.name,
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={[styles.container]}>
        <Text style={[styles.title]}>Please choose your favorite room </Text>
        <ChatRoomList data={CHAT_ROOM_LIST} onPressEachRoom={onPressEachRoom} />
      </View>
    </SafeAreaView>
  );
};

const ChatRoomList: React.FC<{
  data: IRoom[];
  onPressEachRoom: ({id}: {id: IRoom['id']}) => void;
}> = ({data, onPressEachRoom}) => {
  return (
    <View style={styles.chatroomContainer}>
      {data?.map(({name, id}, index) => {
        return (
          <ChatRoom
            key={`room-${index}`}
            name={name}
            id={id}
            onPressEachRoom={onPressEachRoom}
          />
        );
      })}
    </View>
  );
};

const ChatRoom: React.FC<{
  name: IRoom['name'];
  id: IRoom['id'];

  onPressEachRoom: ({id}: {id: IRoom['id']}) => void;
}> = ({name, id, onPressEachRoom}) => {
  return (
    <View style={styles.chatroomWrapper}>
      <TouchableOpacity
        style={styles.chatroom}
        onPress={() => onPressEachRoom({id})}>
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    fontSize: 36,
    marginBottom: 40,
  },

  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatroomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },

  chatroomWrapper: {
    width: '50%',
    padding: 8,
  },

  chatroom: {
    width: '100%',
    aspectRatio: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
});
