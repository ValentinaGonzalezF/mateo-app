import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import ChatMessage from './ChatMessage';
import server from '@/server/server';
import { Header } from '@/app/(tabs)';

interface ChatModalProps {
  chatVisibility: boolean;
  setChatVisibility: (value: boolean) => void;
  actualQuestionId: string;
}

function ChatModal({
  actualQuestionId,
  chatVisibility,
  setChatVisibility,
}: ChatModalProps) {
  const initial = { text: 'En qué quieres que te ayude?', origin: 'bot' };
  const options = ['Explicame', 'Gracias!'];
  const [messages, setMessages] = useState([initial]);
  const [loading, setLoading] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(options);

  console.log('actualQuestionId', actualQuestionId);

  const handleOptionSelected = async (option: string) => {
    if (option === 'Explicame') {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: 'Explicame',
          origin: 'user',
        },
      ]);
      setLoading(true);
      const response = await server.get(
        `/personalized-exercises/solution-explanation/${actualQuestionId}`,
      );
      new Promise((resolve) =>
        setTimeout(() => {
          resolve('result');
        }, 3000),
      );
      setLoading(false);
      if (response && response.message) {
        setMessages((prev) => [
          ...prev,
          {
            text: response.message,
            origin: 'bot',
            isMarkdown: true,
          },
        ]);
        setCurrentOptions(['Gracias!']);
      }
    } else {
      setChatVisibility(false);
      setMessages(() => [initial]);
      setCurrentOptions(options);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={chatVisibility}>
      <View style={styles.container}>
          {Header('Habla con Mateo')}
          <ScrollView style={styles.chatList}>
            {messages.map((m, i) => (<ChatMessage message={m} key={i} />))}
            {loading && <ChatMessage message={{ text: '...', origin: 'bot' }} />}
          </ScrollView>
          {/* Selector Options */}
          {currentOptions.length > 0 && (
            <View style={styles.selectorContainer}>
              {currentOptions.map((option, index) => (
                <Pressable
                  key={index}
                  style={[styles.button]}
                  onPress={() => handleOptionSelected(option)}
                >
                  <ThemedText style={styles.textStyle}>{option}</ThemedText>
                </Pressable>
              ))}

            </View>

          )}
        
      </View>
    </Modal>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatList: {
    padding: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    backgroundColor: '#20c997',
    padding: 10,
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChatModal;
