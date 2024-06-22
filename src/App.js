import { useState } from "react";
import sunil from "./Images/sunil.jpg";
import nithin from "./Images/nithin.jpg";
import gagan from "./Images/gagan.jpg";

import shanu from "./Images/shanu.jpg";

import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const initialFriends = [
  {
    id: 1,
    name: "Nithin LN",
    image: nithin,
    balance: 1000,
  },
  {
    id: 2,
    name: "Sunil Kumar M Patil",
    image: sunil,
    balance: -20000,
  },
  {
    id: 3,
    name: "Gagan",
    image: gagan,
    balance: 0,
  },
  {
    id: 4,
    name: "Shanu MC",
    image: shanu,
    balance: 1500,
  },
];

const FormContainer = styled(Paper)(({ theme }) => ({
  background: "#2C2C2C",
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  maxWidth: "600px",
  width: "100%",
}));

const FormPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FormButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Trademark = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  right: theme.spacing(2),
  color: "#888", // Adjust color as needed
  fontStyle: "italic",
}));

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill({ amount, reason }) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + amount,
              reason: reason, // Store reason in the friend object
            }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  function handleDeleteFriend(id) {
    setFriends((friends) => friends.filter((friend) => friend.id !== id));
    setSelectedFriend(null); // Deselect friend if deleted
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <FormContainer elevation={4}>
        <Typography variant="h5" style={{ flexGrow: 1, textAlign: "center" }}>
          Split-Maadi Please....
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormTitle variant="h4">Friends</FormTitle>
          <FormButton
            variant="contained"
            color="primary"
            startIcon={showAddFriend ? <CloseIcon /> : <AddIcon />}
            onClick={handleShowAddFriend}
          >
            {showAddFriend ? "Close" : "Add Friend"}
          </FormButton>
        </Box>

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
          onDeleteFriend={handleDeleteFriend}
        />

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}

        <Trademark variant="body2">@Chirag Raju</Trademark>
      </FormContainer>
    </Container>
  );
}

function FriendsList({ friends, onSelection, selectedFriend, onDeleteFriend }) {
  return (
    <List>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onDeleteFriend={onDeleteFriend}
        />
      ))}
    </List>
  );
}

function Friend({ friend, onSelection, selectedFriend, onDeleteFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <ListItem
      button
      selected={isSelected}
      onClick={() => onSelection(friend)}
      sx={{
        bgcolor: isSelected ? "#5A4B81" : "inherit",
        borderRadius: 1,
        marginBottom: 1,
      }}
    >
      <ListItemAvatar>
        <Avatar src={friend.image} alt={friend.name} />
      </ListItemAvatar>
      <ListItemText
        primary={friend.name}
        secondary={
          <>
            {friend.balance < 0
              ? `You owe ${friend.name} ₹${Math.abs(friend.balance)}`
              : friend.balance > 0
              ? `Your friend ${friend.name} owes you ₹${Math.abs(
                  friend.balance
                )}`
              : `You and ${friend.name} has no due`}
            {friend.reason && (
              <Typography variant="body2" color="textSecondary">
                Spent On: {friend.reason}
              </Typography>
            )}
          </>
        }
        secondaryTypographyProps={{
          color:
            friend.balance < 0
              ? "error.main"
              : friend.balance > 0
              ? "success.main"
              : "textPrimary",
        }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="select"
          onClick={() => onSelection(friend)}
        >
          {isSelected ? <CloseIcon /> : <AddIcon />}
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDeleteFriend(friend.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <FormPaper component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add
      </Button>
    </FormPaper>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const [reason, setReason] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill({
      amount: whoIsPaying === "user" ? paidByFriend : -paidByUser,
      reason: reason.trim() || "No reason provided",
    });
  }

  return (
    <FormPaper component="form" onSubmit={handleSubmit}>
      <FormTitle variant="h5" gutterBottom>
        Split a bill with {selectedFriend.name}
      </FormTitle>
      <TextField
        fullWidth
        label="Bill value"
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Your expense"
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label={`${selectedFriend.name}'s expense`}
        type="number"
        value={paidByFriend}
        variant="outlined"
        margin="normal"
        disabled
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Who is paying the bill</InputLabel>
        <Select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
          label="Who is paying the bill"
        >
          <MenuItem value="user">You</MenuItem>
          <MenuItem value="friend">{selectedFriend.name}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Spent On"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <FormButton type="submit" variant="contained" color="primary" fullWidth>
        Split bill
      </FormButton>
    </FormPaper>
  );
}
