import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function SelectScreen() {
  const router = useRouter();
  const [catOptions, setCatOptions] = useState([]);
  const diffOptions = [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
  ];
  const typeOptions = [
    { key: "multiple", label: "Multiple Choice" },
    { key: "boolean", label: "True / False" },
  ];
  const [which, setWhich] = useState(null);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const json = await res.json();
        const cats = json?.trivia_categories ?? [];
        setCatOptions(cats.map(c => ({ key: c.id, label: c.name, payload: c })));
      } catch (e) {
        console.error("API error:", e);
      } finally {
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Stuff</Text>

      {/* Here we can just define the different things we're selecting and reuse the same modal for all of them */}
      {/* The category?.label ?? part puts the selected category on it once we pick one */}
      <Pressable style={styles.trigger} onPress={() => setWhich('category')}>
        <Text>{category?.label ?? "Select a category"}</Text>
      </Pressable>

      <Pressable style={styles.trigger} onPress={() => setWhich('difficulty')}>
        <Text>{difficulty?.label ?? "Select a difficulty"}</Text>
      </Pressable>

      <Pressable style={styles.trigger} onPress={() => setWhich('type')}>
        <Text>{type?.label ?? "Select a type"}</Text>
      </Pressable>

      {/* General modal with clickable options,  */}
      <Modal transparent visible={!!which} animationType="fade">
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setWhich(null)} />
          <View style={styles.menu}>
            {(which === 'category' ? catOptions
              : which === 'difficulty' ? diffOptions
              : which === 'type' ? typeOptions
              : []
            ).map((option) => (
              <Pressable
                key={String(option.key)}
                style={styles.option}
                onPress={() => {
                  if (which === 'category') setCategory(option);
                  else if (which === 'difficulty') setDifficulty(option);
                  else if (which === 'type') setType(option);
                  setWhich(null);
                }}
              >
                <Text numberOfLines={2}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

            <View style={{ marginTop: 24 }}>
            <Button
              title="Go"
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/explore",
                  params: {
                    category: category ? String(category.key) : "",
                    difficulty: difficulty ? String(difficulty.key) : "",
                    type: type ? String(type.key) : "",
                  },
                });
              }}
            />
            </View>
          </SafeAreaView>
        );
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E2028', 
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 28,
  },
  centerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 360, 
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#1D3D47',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  footerText: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
    fontSize: 14,
  },
  footerLink: {
    color: '#4DB6AC',
    fontWeight: '600',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  correct: {
    backgroundColor: '#28a745',
  },
  incorrect: {
    backgroundColor: '#dc3545',
  },
  trigger: { padding: 12, backgroundColor: "#eee", borderRadius: 8 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  dropdown: { flex: 1, justifyContent: "center", paddingHorizontal: 16 },
  menu: { backgroundColor: "white", borderRadius: 8, overflow: "hidden" },
  option: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ddd" },
});