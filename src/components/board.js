import React, { useState, useEffect } from "react";
import axios from "axios";
import "./board.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState("status"); // Default grouping by status
  const [sorting, setSorting] = useState("priority"); // Default sorting by priority
  const [groupedTickets, setGroupedTickets] = useState({});

  // Fetch data from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        console.log("API Response:", response.data);
        setTickets(response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // Group tickets dynamically
  useEffect(() => {
    const groupData = (key) => {
      const grouped = tickets.reduce((result, ticket) => {
        const groupKey = ticket[key];
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(ticket);
        return result;
      }, {});
      setGroupedTickets(grouped);
    };

    if (grouping) {
      groupData(grouping);
    }
  }, [grouping, tickets]);

  // Sort tickets within groups
  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sorting === "priority") {
        return b.priority - a.priority;
      } else if (sorting === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <button onClick={() => setGrouping("status")}>Group by Status</button>
        <button onClick={() => setGrouping("user")}>Group by User</button>
        <button onClick={() => setGrouping("priority")}>Group by Priority</button>

        <button onClick={() => setSorting("priority")}>Sort by Priority</button>
        <button onClick={() => setSorting("title")}>Sort by Title</button>
      </div>

      <div className="columns">
        {Object.keys(groupedTickets).map((groupKey) => (
          <div key={groupKey} className="column">
            <h3>{groupKey}</h3>
            {sortTickets(groupedTickets[groupKey]).map((ticket) => (
              <div key={ticket.id} className="card">
                <h4>{ticket.title}</h4>
                <p>Status: {ticket.status}</p>
                <p>User: {ticket.user}</p>
                <p>Priority: {ticket.priority}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
