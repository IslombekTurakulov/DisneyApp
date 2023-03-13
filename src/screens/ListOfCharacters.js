import React, { useCallback, useEffect, useState } from "react"; // use useCallback for performance optimization
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function ListOfCharacters({ navigation, route }) {
  const [modalWid, setModalWid] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [groupList, setGroupList] = useState(route.params);
  const [keyValue, setKeyValue] = useState("watched");
  const [characterList, setCharacterList] = useState([]);

  useEffect(() => {
    // console.info(route.params)
    let navigationName;
    if (modalWid) {
      navigationName = "ListOfCharacters";
    } else {
      navigationName = "Main";
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate(navigationName);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const addGroup = useCallback((keyText) => {
    if (!route.params.some((item) => item.key === keyText)) {
      setGroupList((prevList) => [
        ...prevList,
        { key: keyText, characters: [] },
      ]);
    }
  }, [route.params]);

  const searchGroups = useCallback((text) => {
    const filteredGroups = route.params.filter((item) =>
      item.key.toLowerCase().includes(text.toLowerCase()),
    );
    setGroupList(filteredGroups);
  }, [route.params]);

  const deleteCharacterFromList = useCallback((key) => {
    const updatedGroups = route.params.map((group) => {
      if (group.key === keyValue) {
        const updatedCharacters = group.characters.filter(
          (character) => character.key !== key,
        );
        return { ...group, characters: updatedCharacters };
      }
      return group;
    });
    setCharacterList(updatedGroups.find((g) => g.key === keyValue)?.characters || []);
  }, [keyValue, route.params]);

  const deleteList = useCallback((key) => {
    // use map instead of filter to avoid mutating the original array
    const updatedGroups = route.params.map((group) => {
      if (group.key === key) {
        return { key: "", characters: [] };
      }
      return group;
    }).filter((group) => group.key !== "");
    setGroupList(updatedGroups);
  }, [route.params]);

  return (
    <View style={styles.main}>
      <Modal visible={modalWid} onRequestClose={() => setModalWid(false)}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setModalWid(false)}>
            <Text style={styles.modalHeaderTitle}>{keyValue}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.table}>
          <FlatList
            data={characterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => {
                  deleteCharacterFromList(item.key);
                }}
                onPress={() => {
                  console.info(route.params)
                  navigation.navigate("CharacterDetails", [item, groupList]);
                  setModalWid(false)
                }}>
                <View style={styles.itemContainer}>
                  <View style={styles.itemTextContainer}>
                      <Image style={styles.characterImage} source={{ uri: item.imageUrl }} />
                      <Text style={styles.itemTitle}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
            pageSize={10}
          />
        </View>
      </Modal>
      <View style={styles.groupManipulate}>
        <TextInput
          style={styles.groupSearch}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchGroups(text);
          }}
          placeholder="Search groups"
          placeholderTextColor="#5c5c5c"
        />
        <TouchableOpacity
          style={styles.groupAddButton}
          onPress={() => {
            addGroup(searchText);
          }}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.groupList}>
        <FlatList
          data={groupList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupListItem}
              onPress={() => {
                console.info(item)
                console.info(item.characters)
                setKeyValue(item.key);
                setCharacterList(item.characters);
                setModalWid(true);
              }}
              onLongPress={() => {
                deleteList(item.key);
              }}>
              <Text style={styles.groupListItemText}>{item.key}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchIcon: {
    padding: 10,
  },
  groupManipulate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    width: Dimensions.get("window").width - 5,
  },
  groupSearch: {
    width: Dimensions.get("window").width - 60,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16,
  },
  characterImage: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4 * (3 / 2),
    borderRadius: 8,
    margin: 5,
    alignContent: "flex-start",
    alignSelf: "center",
    borderColor: "#c7f1e0",
    borderWidth: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "space-around",
  },
  itemTitle: {
    flex: 1,
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  groupAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3f3f3f",
    alignItems: "center",
    justifyContent: "center",
  },
  groupList: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  groupListItem: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#5c5c5c",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  groupListItemText: {
    fontSize: 20,
    color: "#000000",
  },
  modalHeader: {
    marginTop: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3f3f3f",
  },
  modalHeaderTitle: {
    fontSize: 20,
    color: "#ffffff",
  },
  table: {
    flex: 1,
    margin: 10,
  },
  itemContainer: {
    width: Dimensions.get("window").width / 2 - 5,
    backgroundColor: "#c7f1e0",
    borderColor: "#c7c6c6",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 2,
  },
  image: {
    flex: 1,
  },
});

