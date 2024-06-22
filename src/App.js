import { useState } from "react";
import sunil from "./Images/sunil.jpg";
import nithin from "./Images/nithin.jpg";
import gagan from "./Images/gagan.jpg";
import sreejith from "./Images/sreejith.jpg";
// import icon from "./Images/icon.png"; // Add your icon image

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
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

const initialFriends = [
  {
    id: 118836,
    name: "Nithin LN",
    image: nithin,
    balance: -7,
  },
  {
    id: 933372,
    name: "Sunil Kumar M",
    image: sunil,
    balance: 20,
  },
  {
    id: 499476,
    name: "Gagan",
    image: gagan,
    balance: 0,
  },
];

const FormContainer = styled(Paper)(({ theme }) => ({
  background: "#2C2C2C",
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  maxWidth: "600px",
  margin: "auto",
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

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <Container>
      <FormContainer elevation={4}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Split-Madi
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
        />

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </FormContainer>
    </Container>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <List>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </List>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
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
          friend.balance < 0
            ? `You owe ${friend.name} ₹${Math.abs(friend.balance)}`
            : friend.balance > 0
            ? `Your friend ${friend.name} owes you ₹${Math.abs(friend.balance)}`
            : `You and ${friend.name} are even`
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

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
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
      <FormButton type="submit" variant="contained" color="primary" fullWidth>
        Split bill
      </FormButton>
    </FormPaper>
  );
}
