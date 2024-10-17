import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomContext } from "../../contexts/roomContext";
import Header from "../../components/Header";

const Room: React.FC = () => {
  const { room, currentUser } = useContext(roomContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!room || room.roomId !== id || !currentUser) {
      navigate("/");
    }
  }, [room, id, currentUser, navigate]);

  if (!room || !currentUser) {
    return null; // add loading spinner later
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header currentUser={currentUser} />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Room: {room.roomId}</h1>
        <p>Owner: {room.owner.name}</p>
        <p>Current User: {currentUser.name}</p>
        <p>Participants: {room.participants.map(p => p.name).join(", ")}</p>
        <div className="mt-4">
          <pre className="bg-zinc-950 p-4 rounded">{room.codeData.content}</pre>
          {room.codeData.lastEditedBy && (
            <p className="mt-2">
              Last edited by: {room.codeData.lastEditedBy.name} at{" "}
              {new Date(room.codeData.lastEditedAt!).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
