import { Image, Pressable, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function WordImagePicker({ image, onChange, enabled = true, colors }) {
  const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const chooseImage = async () => {
    if (!enabled) return;

    let granted = permission?.granted === true || permission?.status === ImagePicker.PermissionStatus.GRANTED;
    if (!granted) {
      const result = await requestPermission();
      granted = result?.granted === true || result?.status === ImagePicker.PermissionStatus.GRANTED;
    }
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (result?.canceled || result?.cancelled) return;

    const uri = result?.assets?.[0]?.uri;
    if (uri) onChange(uri);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={image ? "Change word image" : "Choose word image"}
      onPress={chooseImage}
      style={[styles.container, { borderColor: colors.primary200 }]}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={[styles.placeholder, { color: colors.grey600 }]}>No image taken yet.</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { textAlign: "center", paddingHorizontal: 12 },
});
