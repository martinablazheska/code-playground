import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomContext } from "../../contexts/roomContext";
import Header from "../../components/Header";

const Room: React.FC = () => {
  const { room } = useContext(roomContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!room || room.roomId !== id) {
      navigate("/");
    }
  }, [room, id, navigate]);

  if (!room) {
    return null; // or a loading spinner
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Room: {room.roomId}</h1>
        <p>Owner: {room.owner.name}</p>
        <p>Participants: {room.participants.map(p => p.name).join(", ")}</p>
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Code:</h2>
          <pre className="bg-gray-100 p-4 rounded">{room.codeData.content}</pre>
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
