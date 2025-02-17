import React from "react";
import UserName from "../user/UserName";
import { Link } from "react-router-dom";
import { Room } from "elixir-backend";

interface Props {
  rooms: Array<Room>;
}

export const LobbyTable: React.FC<Props> = ({ rooms }) => {
  const tdClass = "p-3 border-b border-gray-400";
  const thClass = "p-3 border-b border-gray-400";

  let roomItems = rooms.map((room: Room) => (
    <tr key={room.id}>
      <td className={tdClass}>
        <Link to={"/room/" + room.slug}>{room.name}</Link>
      </td>
      <td className={tdClass}>
        <UserName userID={room.player1} />
      </td>
      <td className={tdClass}>
        <UserName userID={room.player2} />
      </td>
      <td className={tdClass}>
        <UserName userID={room.player3} />
      </td>
      <td className={tdClass}>
        <UserName userID={room.player4} />
      </td>
    </tr>
  ));

  if (roomItems.length === 0) {
    return (
      <div className="p-3 text-white rounded bg-gray-700 max-w-lg">
        No rooms created.
      </div>
    );
  }
  return (
    <table className="shadow rounded border bg-gray-100">
      <thead>
        <tr>
          <th className={thClass}>name</th>
          <th className={thClass}>host</th>
        </tr>
      </thead>
      <tbody>{roomItems}</tbody>
    </table>
  );
};
export default LobbyTable;
