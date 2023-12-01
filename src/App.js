import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friend, setFriend] = useState(initialFriends);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }
  function handleAddFriend(NewFriend) {
    setFriend((friend) => [...friend, NewFriend]);
  }

  function handleSelectFriend(selectedfriend) {
    setSelected((curr) =>
      curr?.id === selectedfriend.id ? null : selectedfriend
    );
  }

  function handleSplit(value) {
    setFriend(
      friend.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friend={friend}
          onSelection={handleSelectFriend}
          onSelected={selected}
        />
        {isOpen && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            onSelected={selected}
          ></FormAddFriend>
        )}
        <Button onClick={handleIsOpen}>
          {isOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selected && (
        <FormSplitBill
          onSplit={handleSplit}
          friend={friend}
          onSelected={selected}
        />
      )}{" "}
    </div>
  );
}

export default App;

function FriendList({ friend, onSelection, onSelected }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          onSelection={onSelection}
          friend={friend}
          key={friend.id}
          onSelected={onSelected}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, onSelected }) {
  let s = onSelected?.id === friend.id;
  return (
    <li>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owns You {friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owns {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {s ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    let newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    console.log(newFriend);
    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      ></input>

      <label>🌃 Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ onSelected, friend, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaid] = useState("");
  let paidByFriend = bill - paidByUser;
  const [whoIsPaying, setWhoIsPaying] = useState("User");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplit(whoIsPaying === "User" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2> Split bill with {onSelected.name}</h2>

      <label>Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
      ></input>

      <label>Your expense</label>
      <input
        value={paidByUser}
        onChange={(e) =>
          e.target.value > bill ? paidByUser : setPaid(Number(e.target.value))
        }
        type="text"
      ></input>

      <label> {onSelected.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled></input>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="User">You</option>
        <option value="friend">{onSelected.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
