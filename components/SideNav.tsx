import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.3;

const SideNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx - DRAWER_WIDTH, 0));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > DRAWER_WIDTH / 2) {
          openDrawer();
        } else {
          closeDrawer();
        }
      },
    })
  ).current;

  const openDrawer = useCallback(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [translateX]);

  const closeDrawer = useCallback(() => {
    Animated.timing(translateX, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [translateX, onClose]);

  useEffect(() => {
    if (isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [isOpen, closeDrawer, openDrawer]);

  return (
    isOpen && (
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>RepTime</Text>
            </View>
            <View style={styles.navList}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/");
                  closeDrawer();
                }}
                style={styles.navItem}
                activeOpacity={0.8}
              >
                <Icon name="home" size={28} style={styles.navIcon} />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("/timers");
                  closeDrawer();
                }}
                style={styles.navItem}
                activeOpacity={0.8}
              >
                <Icon name="timer" size={28} style={styles.navIcon} />
                <Text style={styles.navText}>Timers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("/workouts");
                  closeDrawer();
                }}
                style={styles.navItem}
                activeOpacity={0.8}
              >
                <Icon name="fitness-center" size={28} style={styles.navIcon} />
                <Text style={styles.navText}>Workouts</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#222",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 1000,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    padding: 24,
    backgroundColor: "#353636",
    alignItems: "center",
    borderTopRightRadius: 24,
  },
  headerText: {
    color: "cyan",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  navList: {
    padding: 24,
    gap: 16,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#333",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  navIcon: {
    marginRight: 18,
    color: "cyan",
  },
  navText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default SideNav;
