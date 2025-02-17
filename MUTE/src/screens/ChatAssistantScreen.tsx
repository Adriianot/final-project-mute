import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../contexts/ThemeContext";
import { getDynamicStyles } from "../styles/chatStyles";

// Define available routes
type RootStackParamList = {
  Menu: undefined;
  ChatAssistantScreen: undefined;
};

// Navigation Props
type ChatAssistantScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "ChatAssistantScreen">;
};

// Chat message template
interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const ChatAssistantScreen: React.FC<ChatAssistantScreenProps> = ({
  navigation,
}) => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const API_URL = "http://192.168.100.128:8000/chat/chatbot";

  // Function to get a response from the chatbot
  const responseChatbot = async (messageQ: string) => {
    try {
      const response = await axios.post(API_URL, { message: messageQ });
      return response.data.response;
    } catch (error: any) {
      console.error("Error en el Chat:", error.response?.data || error.message);
      return "⚠️ Sorry, there was an error connecting to the assistant.";
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(), 
      role: "user",
      text: userInput,
    };

    setChat((prevChat) => [...prevChat, userMessage]);
    setUserInput("");

    try {
      const botResponse = await responseChatbot(userInput);
      const botReply: ChatMessage = {
        id: Date.now() + 1, 
        role: "assistant",
        text: botResponse,
      };
      setChat((prevChat) => [...prevChat, botReply]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Chatbot error:", error);
    }
  };
  const handleSpeech = async (text: string) => {
    if (await isSpeakingAsync()) {
      stop();
    } else {
      speak(text,{
        language: "es-MX",
        pitch: 1.0,
        rate: 1.0,
      });
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <FlatList
        ref={flatListRef}
        data={chat}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              dynamicStyles.chatItem,
              item.role === "user"
                ? dynamicStyles.userChatItem
                : dynamicStyles.modelChatItem,
            ]}
          >
            <Text style={dynamicStyles.chatText}>{item.text}</Text>
            {item.role === "assistant" && (
              <TouchableOpacity
                onPress={() => handleSpeech(item.text)}
                style={dynamicStyles.speakerButton}
              >
                <Icon name="volume-up" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={dynamicStyles.inputContainer}
      >
        <TextInput
          style={dynamicStyles.textInput}
          placeholder="Write your message..."
          placeholderTextColor={isDarkMode ? "#bbb" : "#555"}
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity
          style={dynamicStyles.sendButton}
          onPress={handleSendMessage}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatAssistantScreen;
