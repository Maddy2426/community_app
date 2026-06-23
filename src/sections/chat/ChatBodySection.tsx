import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useTheme } from "@/hooks/useTheme";
import {
  addMessageForAuthor,
  selectMessagesByAuthor,
} from "@/store/communitySlice";
import { addPost } from "@/store/postsSlice";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time?: string;
  uri?: string;
  fileName?: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

type Props = {
  authorId: string;
  initialMessages?: Message[];
};

export default function ChatBodySection({
  authorId,
  initialMessages = [],
}: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useAppDispatch();
  const storeMessages = useAppSelector((s) =>
    selectMessagesByAuthor(s, authorId),
  );

  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length
      ? initialMessages
      : [
          {
            id: "welcome",
            text: "Welcome to the community chat!",
            sender: "other",
            time: formatTime(new Date()),
          },
        ],
  );

  useEffect(() => {
    const welcomeMsg: Message[] = [
      {
        id: "welcome",
        text: "Welcome to the community chat!",
        sender: "other",
        time: formatTime(new Date()),
      },
    ];

    // compute what messages should be shown for this author
    const newMessages: Message[] =
      storeMessages && storeMessages.length
        ? storeMessages.map((m: any) => ({
            id: m.id,
            text: m.text ?? "Image",
            sender: m.authorId === authorId ? "me" : "other",
            time: formatTime(new Date(m.createdAt)),
            uri: m.uri,
            fileName: m.fileName,
          }))
        : initialMessages && initialMessages.length
          ? initialMessages
          : welcomeMsg;

    // avoid setting state when content is already identical (prevents render loop)
    const same =
      messages.length === newMessages.length &&
      messages.every(
        (msg, i) =>
          msg.id === newMessages[i].id && msg.text === newMessages[i].text,
      );

    if (!same) {
      setMessages(newMessages);
    }
  }, [storeMessages, authorId, initialMessages.length, messages]);

  const [input, setInput] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) {
      setError("Please write something to post");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const id = Date.now().toString();
      const msg = {
        id,
        text: input.trim(),
        authorId,
        authorName: undefined,
        uri: imageUri,
        fileName: undefined,
        createdAt: new Date().toISOString(),
      };

      // persist ONLY to community slice under this authorId
      dispatch(addMessageForAuthor({ authorId, message: msg }));

      // update local view immediately
      setMessages((s) => [
        ...s,
        {
          id,
          text: msg.text,
          sender: "me",
          time: formatTime(new Date()),
          uri: msg.uri,
        },
      ]);

      setInput("");
      setImageUri(undefined);
      // success alert removed
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch {
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, imageUri, authorId, dispatch]);

  const onPickGallery = async () => {
    setPickerVisible(false);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Allow access to your photos to attach images.",
        );
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
      if (!uri) return;

      const id = Date.now().toString();

      // persist for Home feed

      // add to chat view
      const msg: Message = {
        id,
        text: "Image",
        sender: "me",
        time: formatTime(new Date()),
        uri,
      };
      setMessages((s) => [...s, msg]);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e) {
      console.log(e);
    }
  };

  const onPickFiles = async () => {
    setPickerVisible(false);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "*/*",
      });
      if (!res || !("uri" in res) || !res.uri) return;

      const uri = (res as any).uri;
      const fileName =
        "name" in res && typeof (res as any).name === "string"
          ? (res as any).name
          : undefined;

      const id = Date.now().toString();
      const post: any =
        uri &&
        (uri.endsWith(".jpg") || uri.endsWith(".png") || uri.includes("image"))
          ? { id, text: "", image: uri, createdAt: new Date().toISOString() }
          : {
              id,
              text: fileName ?? "File",
              image: undefined,
              createdAt: new Date().toISOString(),
            };

      // persist for Home feed
      dispatch(addPost(post));

      // add to chat view
      const msg: Message = {
        id,
        text: fileName ?? "File",
        sender: "me",
        time: formatTime(new Date()),
        uri,
        fileName,
      };
      setMessages((s) => [...s, msg]);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e) {
      console.log(e);
    }
  };

  function sendMessage(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.wrapper, { backgroundColor: colors.background }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.sender === "me"
                ? { backgroundColor: colors.primary, alignSelf: "flex-end" }
                : { backgroundColor: colors.surface, alignSelf: "flex-start" },
            ]}
          >
            {m.uri ? (
              <Image source={{ uri: m.uri }} style={styles.attachedImage} />
            ) : null}

            <Text
              style={[
                styles.messageText,
                m.sender === "me" && styles.messageTextOnPrimary,
              ]}
            >
              {m.fileName ? `${m.fileName}` : m.text}
            </Text>
            {m.time ? (
              <Text style={[styles.timeText, { color: colors.textMuted }]}>
                {m.time}
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.inputRow,
          { borderTopColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.textPrimary },
          ]}
          multiline
          blurOnSubmit={true} // allow submit on Enter for multiline
          returnKeyType="send"
          onSubmitEditing={() => {
            // only send if there is non-empty trimmed text
            if (input?.trim()) handleSubmit();
          }}
        />

        <Pressable
          style={{ padding: 8 }}
          onPress={() => setPickerVisible(true)}
          accessibilityLabel="Attach"
        >
          <AntDesign name="paper-clip" size={20} color={colors.textPrimary} />
        </Pressable>

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.sendText, { color: colors.white }]}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Attach
          </Text>

          <TouchableOpacity style={styles.modalOption} onPress={onPickGallery}>
            <Text
              style={[styles.modalOptionText, { color: colors.textPrimary }]}
            >
              Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={onPickFiles}>
            <Text
              style={[styles.modalOptionText, { color: colors.textPrimary }]}
            >
              Files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.modalCancel]}
            onPress={() => setPickerVisible(false)}
          >
            <Text style={[styles.modalCancelText, { color: colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    wrapper: { flex: 1 },
    messagesContainer: { padding: 12, paddingBottom: 20 },
    bubble: {
      maxWidth: "80%",
      padding: 10,
      marginVertical: 6,
      borderRadius: 12,
    },
    attachedImage: {
      width: 180,
      height: 120,
      borderRadius: 8,
      marginBottom: 8,
    },
    messageText: { color: colors.textPrimary },
    messageTextOnPrimary: { color: colors.white },
    timeText: { fontSize: 10, marginTop: 6, alignSelf: "flex-end" },
    inputRow: {
      flexDirection: "row",
      padding: 8,
      borderTopWidth: 1,
      alignItems: "flex-end",
    },
    input: {
      flex: 1,
      maxHeight: 120,
      minHeight: 40,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderColor: colors.border,
    },
    sendButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      justifyContent: "center",
    },
    sendText: { fontWeight: "600" },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContainer: {
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 40,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
    },
    modalOption: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    modalOptionText: {
      fontSize: 16,
    },
    modalCancel: {
      marginTop: 6,
      borderTopWidth: 0,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });
}
function createPost(description: any, imageUri: any) {
  // TODO: Implement API call to create post with description and optional imageUri
  console.log("Creating post:", { description, imageUri });
}
