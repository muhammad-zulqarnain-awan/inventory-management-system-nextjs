"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  doc,
} from "firebase/firestore";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [inp_quantity, setInpQuantity] = useState();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, inp_quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: inp_quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const removeAll = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      sx={{ background: "linear-gradient(to right, black, skyblue)" }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"80%"}
        height={"80%"}
        borderRadius={"2rem"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            fontFamily={"Tahoma"}
            fontWeight={"bold"}
            m={"2.5rem"}
            fontSize={"2.8rem"}
            letterSpacing={3}
            lineHeight={1.8}
            textTransform={"uppercase"}
            color={"white"}
          >
            Inventory Management System
          </Typography>
        </Box>

        <Box
          width={"90%"}
          height={"60%"}
          sx={{
            overflowY: "scroll",
            backgroundColor: "white",
          }}
        >
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead bgcolor="gray">
                <TableRow>
                  <TableCell>ITEMS</TableCell>
                  <TableCell align="right">QUANTITY</TableCell>
                  <TableCell align="right">DELETE ONE</TableCell>
                  <TableCell align="right">DELETE ALL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow
                    key={item.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    
                    <TableCell align="right">
                      <Button
                        onClick={() => {
                          removeItem(item.name);
                        }}
                      >
                        Delete One
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => {
                          removeAll(item.name);
                        }}
                      >
                        Delete All
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
            }}
            width={400}
            bgcolor={"white"}
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack spacing={3} width={"100%"} direction={"row"}></Stack>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Quantity"
              value={inp_quantity}
              onChange={(e) => {
                setInpQuantity(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "gray",
                border: "1px solid gray",
                borderRadius: "2rem",
                color: "white",
                ":hover": {
                  background: "black",
                  border: "1px solid black",
                },
              }}
              onClick={() => {
                addItem(itemName, inp_quantity);
                setItemName("");
                setInpQuantity();
                handleClose();
              }}
            >
              Add
            </Button>
          </Box>
        </Modal>
        <Button
          variant="outlined"
          fullWidth="true"
          sx={{
            backgroundColor: "white",
            margin: "2rem",
            color: "black",
            border: "1px solid white",
            fontWeight: "bold",
            borderRadius: "5rem",
            ":hover": {
              background: "black",
              color: "white",
              border: "1px solid black",
            },
          }}
          onClick={() => {
            handleOpen();
          }}
        >
          Add Item
        </Button>
      </Box>
    </Box>

    // <Box
    //   width={"100vw"}
    //   height={"100vh"}
    //   display={"flex"}
    //   justifyContent={"center"}
    //   alignItems={"center"}
    //   bgcolor={"#09111f"}
    //   flexDirection={"column"}
    // >
    //   <Typography
    //     variant="h1"
    //     fontFamily={"Calibri"}
    //     fontSize={"4rem"}
    //     textAlign={"center"}
    //     color={"#ffffff"}
    //     bgcolor={"#334769"}
    //     padding={"1.5rem 2.2rem"}
    //     borderRadius={"2rem"}
    //   >
    //     Inventory Management System
    //   </Typography>
    //   <Modal open={open} onClose={handleClose}>
    //     <Box
    //       position="absolute"
    //       top="50%"
    //       left="50%"
    //       sx={{
    //         transform: "translate(-50%, -50%)",
    //       }}
    //       width={400}
    //       bgcolor={"white"}
    //       border="2px solid #000"
    //       boxShadow={24}
    //       p={4}
    //       display={"flex"}
    //       flexDirection={"column"}
    //       gap={3}
    //     >
    //       <Typography variant="h6">Add Item</Typography>
    //       <Stack spacing={3} width={"100%"} direction={"row"}></Stack>
    //       <TextField
    //         variant="outlined"
    //         fullWidth
    //         value={itemName}
    //         onChange={(e) => {
    //           setItemName(e.target.value);
    //         }}
    //       />
    //       <Button
    //         variant="outlined"
    //         sx={{
    //           backgroundColor: "gray",
    //           border: "1px solid gray",
    //           borderRadius: "2rem",
    //           color: "white",
    //           ":hover": {
    //             background: "black",
    //             border: "1px solid black",
    //           },
    //         }}
    //         onClick={() => {
    //           addItem(itemName);
    //           setItemName("");
    //           handleClose();
    //         }}
    //       >
    //         Add
    //       </Button>
    //     </Box>
    //   </Modal>
    //   <Button onClick={() => {
    //     handleOpen();
    //   }}>
    //     Add Item
    //   </Button>
    // </Box>
  );
}
