import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function CharacterDetails({ navigation, route }) {
  const [groupList, setGroupList] = useState(route.params[1]);
  const [searchText, setSearchText] = useState("");
  const [commentText, setCommentText] = useState(route.params[0].comment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const sheetRef = React.useRef(null);
  const fall = new Animated.Value(1);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("Main");
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const addCharacterToList = (listName) => {
    try {
      setLoading(true);
      console.info(route.params[1])
      route.params[1].forEach((item) => {
        console.info(item.key)
        console.info(listName)
        console.info(!item.characters.includes(route.params[0]))
        console.info(item.characters)
        console.info(route.params[0])
        if (item.key === listName && !item.characters.includes(route.params[0])) {
          item.characters.push(route.params[0]);
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const addGroup = useCallback((keyText) => {
    if (!groupList.some((item) => item.key === keyText)) {
      route.params[1] = [...route.params[1], { key: [keyText], characters: [] }];
    }
  }, [groupList, route.params]);

  const searchGroup = useCallback((text) => {
    if (text === "") {
      setGroupList(route.params[1])
      return
    }
    const filterGroup = groupList.filter((item) =>
      item.key.toLowerCase().includes(text.toLowerCase()),
    );
    setGroupList(filterGroup);
  }, [groupList]);

  const renderInner = useCallback(() => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.innerContent}>
        <View style={styles.commentContainer}>
          <Text style={styles.commentHeader}>Comment</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Add a comment..."
            maxLength={256}
            keyboardType={"default"}
            onChangeText={(text) => {
              setCommentText(text);
              route.params[0].comment = text;
            }}
            value={commentText}
          />
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.groupHeader}>Add to group</Text>
          <View style={styles.searchGroupContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={"Search..."}
              placeholderTextColor={"black"}
              textContentType={"name"}
              onSubmitEditing={(event) => {
                searchGroup(event.nativeEvent.text);
                setSearchText("");
              }}
            />
            {/*<Ionicons name="ios-search" size={24} color="black" />*/}
            <AntDesign
              name="pluscircleo"
              size={24}
              color="#F60"
              onPress={() => {
                if (searchText) {
                  addGroup(searchText);
                }
                setSearchText("");
                searchGroup("");
              }}
            />
          </View>
        </View>
        <FlatList
          data={groupList}
          renderItem={({ item }) => (
              <Text style={styles.groupName} onPress={() => {
                addCharacterToList(item.key);
                sheetRef.current.snapTo(1);
              }}>{item.key}</Text>
          )}
          keyExtractor={(item) => item.key}
          style={styles.groupList}
        />
      </View>
    </TouchableWithoutFeedback>
  ), [commentText, searchGroup, groupList, searchText, addCharacterToList]);


  const renderHeader = useCallback(() => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.header}
      onPressOut={() => Keyboard.dismiss()}>
      <View style={styles.panelHandle} />
    </TouchableOpacity>
  ), []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.6)", "transparent"]}
        style={styles.banner}>
        <Image source={{ uri: route.params[0].imageUrl }} style={styles.bannerImage} />
        <Text style={styles.name}>{route.params[0].name}</Text>
      </LinearGradient>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[Platform.OS === "ios" ? 600 : 500, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        enabledGestureInteraction={true}
        initialSnap={1}
        callbackNode={fall}
      />
      <FlatList
        data={[
          {
            title: "Movies",
            data: route.params[0].films || [],
          },
          {
            title: "Series",
            data: route.params[0].tvShows || [],
          },
          {
            title: "Video games",
            data: route.params[0].videoGames || [],
          },
          {
            title: "Short films",
            data: route.params[0].shortFilms || [],
          },
          {
            title: "Comments",
            data: [route.params[0].comment] || [],
          },
        ]}
        renderItem={({ item }) => (
          <View style={styles.appearances}>
            <Text style={styles
              .category}>{item.title}</Text>
            {item.data.length > 0 ? (
              item.data.map((appearance) => (
                <TouchableOpacity onPress={() => navigation.navigate("AppearanceDetails", { key: appearance.key })}>
                  <Text style={styles.appearance}>{appearance}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noAppearances}>No {item.title.toLowerCase()} found</Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.appearancesContainer}
      />
      <TouchableOpacity
        style={styles.addToListButton}
        onPress={() => sheetRef.current.snapTo(0)}>
        <Text style={styles.addToList}>Add to list</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    height: 300,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bannerImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appearancesContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  appearances: {
    marginBottom: 20,
  },
  category: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  appearance: {
    fontSize: 16,
    marginBottom: 5,
    color: "#0066CC",
  },
  noAppearances: {
    fontSize: 16,
    marginBottom: 5,
    color: "#999",
  },
  panelHandle: {
    alignSelf: "center",
    width: 40,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#0004",
    marginBottom: 8,
  },
  innerContent: {
    height: "100%",
    backgroundColor: "#d3d2cf",
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 40,
  },
  itemUserLists: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  groupName: {
    width: "90%",
    fontSize: 20,
    color: "black",
    marginTop: 5,
  },
  checkBox: {
    paddingTop: 5,
    width: "7%",
  },
  groupManipulate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  addToList: {
    marginHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
    fontSize: 24,
    fontWeight: "bold",
  },
  commentContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
  },
  searchGroupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    width: "95%",
    height: 200,
  },
  addToListButton: {
    backgroundColor: "#bdb7b7",
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 5,
    textDecorationColor: "black",
    paddingHorizontal: 10,
    marginEnd: 5,
    width: "90%",
    color: "black",
    height: "100%",
  },
  groupList: {
    maxHeight: 100,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  groupItem: {
    paddingVertical: 5,
    color: "black",
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
