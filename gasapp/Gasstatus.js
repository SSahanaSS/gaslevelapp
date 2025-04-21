// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Modal,
//   TouchableOpacity,
//   Linking,
//   Platform,
// } from "react-native";
// import axios from "axios";

// const INDANE_PHONE = "916381032503"; // <-- Replace with your Indane number, no '+'

// const GasStatus = () => {
//   const [gasLevel, setGasLevel] = useState(null);
//   const [status, setStatus] = useState({ color: "gray", message: "Loading..." });
//   const [heightAnim] = useState(new Animated.Value(0));
//   const [showModal, setShowModal] = useState(false);
//   const [modalDismissed, setModalDismissed] = useState(false);
//   const smsSentRef = useRef(false);

//   useEffect(() => {
//     const fetchGasLevel = async () => {
//       try {
//         const response = await axios.get("http://192.168.29.154:5000/gas-level");
//         const newLevel = parseFloat(response.data.gaslevel);
//         setGasLevel(newLevel);

//         Animated.timing(heightAnim, {
//           toValue: newLevel,
//           duration: 500,
//           useNativeDriver: false,
//         }).start();

//         if (newLevel >= 50) {
//           setStatus({ color: "green", message: "Full" });
//           setShowModal(false);
//         } else if (newLevel >= 40) {
//           setStatus({ color: "yellow", message: "Getting Low" });
//           setShowModal(false);
//         } else if (newLevel >= 20) {
//           setStatus({ color: "orange", message: "Low" });
//           setShowModal(false);
//         } else {
//           setStatus({ color: "red", message: "Refill Needed" });
//           if (!showModal && !modalDismissed) {
//             setShowModal(true);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching gas level:", err);
//         setStatus({ color: "gray", message: "Unable to fetch" });
//       }
//     };

//     fetchGasLevel();
//     const interval = setInterval(fetchGasLevel, 5000);
//     return () => clearInterval(interval);
//   }, [showModal, modalDismissed]);

//   const handleBook = () => {
//     setShowModal(false);
//     setModalDismissed(true);
//     const url = `https://wa.me/${INDANE_PHONE}?text=Hi`;
//     Linking.openURL(url);
//   };

//   const handleIgnore = () => {
//     setShowModal(false);
//     setModalDismissed(true);
//   };

//   const bodyHeight = 180;
//   const animatedHeight = heightAnim.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, bodyHeight],
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.topHandle}>
//         <View style={styles.handleArm} />
//         <View style={styles.handleGap} />
//         <View style={styles.handleArm} />
//       </View>
//       <View style={styles.neck} />
//       <View style={styles.body}>
//         <Animated.View
//           style={[
//             styles.gasFill,
//             { height: animatedHeight, backgroundColor: status.color },
//           ]}
//         />
//       </View>
//       <Text style={styles.text}>
//         Gas Level: {gasLevel !== null ? `${gasLevel.toFixed(1)}%` : "Loading..."}
//       </Text>
//       <Text style={[styles.text, { color: status.color }]}>{status.message}</Text>

//       <Modal
//         transparent
//         visible={showModal}
//         animationType="fade"
//         onRequestClose={() => setShowModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>⚠ Low Gas Alert</Text>
//             <Text style={styles.modalText}>
//               Gas level is below 20%. Would you like to book a refill?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, { backgroundColor: "#aaa" }]}
//                 onPress={handleIgnore}
//               >
//                 <Text style={styles.modalButtonText}>Ignore</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, { backgroundColor: "#25D366" }]}
//                 onPress={handleBook}
//               >
//                 <Text style={styles.modalButtonText}>Book</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#1e1e1e",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   topHandle: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 2,
//   },
//   handleArm: {
//     width: 15,
//     height: 20,
//     backgroundColor: "#ccc",
//     borderTopLeftRadius: 5,
//     borderTopRightRadius: 5,
//   },
//   handleGap: {
//     width: 20,
//   },
//   neck: {
//     width: 40,
//     height: 20,
//     backgroundColor: "#ccc",
//     borderTopLeftRadius: 4,
//     borderTopRightRadius: 4,
//     marginBottom: 2,
//   },
//   body: {
//     width: 100,
//     height: 180,
//     backgroundColor: "#2e2e2e",
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "#aaa",
//     overflow: "hidden",
//     justifyContent: "flex-end",
//     position: "relative",
//   },
//   gasFill: {
//     width: "100%",
//     position: "absolute",
//     bottom: 0,
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//     marginTop: 10,
//     fontWeight: "bold",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 24,
//     alignItems: "center",
//     width: 300,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#d32f2f",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     color: "#222",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default GasStatus;
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";

const INDANE_PHONE = "916381032503"; // Replace with your Indane number

const GasStatus = () => {
  const [gasLevel, setGasLevel] = useState(null);
  const [status, setStatus] = useState({ color: "gray", message: "Loading..." });
  const [heightAnim] = useState(new Animated.Value(0));
  const [showModal, setShowModal] = useState(false);
  const hasShownModalRef = useRef(false);

  useEffect(() => {
    const fetchGasLevel = async () => {
      try {
        const response = await axios.get("http://192.168.29.154:5000/gas-level");
        const newLevel = parseFloat(response.data.gaslevel);
        setGasLevel(newLevel);

        Animated.timing(heightAnim, {
          toValue: newLevel,
          duration: 500,
          useNativeDriver: false,
        }).start();

        if (newLevel >= 50) {
          setStatus({ color: "green", message: "Full" });
          setShowModal(false);
          hasShownModalRef.current = false;
        } else if (newLevel >= 40) {
          setStatus({ color: "yellow", message: "Getting Low" });
          setShowModal(false);
          hasShownModalRef.current = false;
        } else if (newLevel >= 20) {
          setStatus({ color: "orange", message: "Low" });
          setShowModal(false);
          hasShownModalRef.current = false;
        } else {
          setStatus({ color: "red", message: "Refill Needed" });
          if (!hasShownModalRef.current) {
            setShowModal(true);
            hasShownModalRef.current = true;
          }
        }
      } catch (err) {
        console.error("Error fetching gas level:", err);
        setStatus({ color: "gray", message: "Unable to fetch" });
      }
    };

    fetchGasLevel();
    const interval = setInterval(fetchGasLevel, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = () => {
    setShowModal(false);
    hasShownModalRef.current = true;
    const url = `https://wa.me/${INDANE_PHONE}?text=Hi`;
    Linking.openURL(url);
  };

  const handleIgnore = () => {
    setShowModal(false);
    hasShownModalRef.current = true;
  };

  const bodyHeight = 180;
  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, bodyHeight],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHandle}>
        <View style={styles.handleArm} />
        <View style={styles.handleGap} />
        <View style={styles.handleArm} />
      </View>
      <View style={styles.neck} />
      <View style={styles.body}>
        <Animated.View
          style={[
            styles.gasFill,
            { height: animatedHeight, backgroundColor: status.color },
          ]}
        />
      </View>
      <Text style={styles.text}>
        Gas Level: {gasLevel !== null ? `${gasLevel.toFixed(1)}%` : "Loading..."}
      </Text>
      <Text style={[styles.text, { color: status.color }]}>{status.message}</Text>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠ Low Gas Alert</Text>
            <Text style={styles.modalText}>
              Gas level is below 20%. Would you like to book a refill?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={handleIgnore}
              >
                <Text style={styles.modalButtonText}>Ignore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#25D366" }]}
                onPress={handleBook}
              >
                <Text style={styles.modalButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHandle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 2,
  },
  handleArm: {
    width: 15,
    height: 20,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  handleGap: {
    width: 20,
  },
  neck: {
    width: 40,
    height: 20,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 2,
  },
  body: {
    width: 100,
    height: 180,
    backgroundColor: "#2e2e2e",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#aaa",
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  gasFill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GasStatus;

