import React, { useState, useEffect } from "react";
import axios from "axios";
import "./board.css";

const priorityMapping = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };

  const priorityImages = {
    4: "/icons_FEtask/SVG - Urgent Priority colour.svg",
    3: "/icons_FEtask/Img - High Priority.svg",
    2: "/icons_FEtask/Img - Medium Priority.svg",
    1: "/icons_FEtask/Img - Low Priority.svg",
    0: "/icons_FEtask/No-priority.svg",
  };

  const statusImages = {
    'Todo': "/icons_FEtask/To-do.svg",
    'Inprogress': "/icons_FEtask/in-progress.svg",
    'Backlog': "/icons_FEtask/Backlog.svg"
  };

  

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]); // Store users data
  const [grouping, setGrouping] = useState("status"); // Default: none selected
  const [sorting, setSorting] = useState(""); // Default: none selected
  const [groupedTickets, setGroupedTickets] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );

        const { tickets: fetchedTickets, users: fetchedUsers } = response.data;

        // Map user names to tickets
        const enhancedTickets = fetchedTickets.map((ticket) => {
          const user = fetchedUsers.find((u) => u.id === ticket.userId);
          return {
            ...ticket,
            userName: user ? user.name : "Unknown User",
          };
        });

        setTickets(enhancedTickets); // Save enhanced tickets
        setUsers(fetchedUsers); // Save users
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Group tickets dynamically based on the selected grouping option
  useEffect(() => {
    if (!grouping) return; // Skip if no grouping option is selected

    const groupData = (key) => {
        console.log('key', key)
      const grouped = tickets.reduce((result, ticket) => {
        console.log('result', result)
        const groupKey = ticket[key];
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(ticket);
        return result;
      }, {});
      setGroupedTickets(grouped);
    };
    
    groupData(grouping === "user" ? "userName" : grouping);
  }, [grouping, tickets]);

  // Sort tickets within groups
  const sortTickets = (tickets) => {
    if (!sorting) return tickets; // Return unsorted if no sorting is selected

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
      <button
        className="beautiful-button"
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <img src ='/icons_FEtask/display.svg' className='display-icon'></img>
        Display 
        <img src ='/icons_FEtask/down.svg' className='down-arrow'></img>
      </button>

      {isDropdownVisible && (
        <div className="dropdowns">
          <div className="dropdown">
            <label>Grouping:</label>
            <select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
            >
              <option value="">Select Grouping</option>
              <option value="status">By Status</option>
              <option value="user">By User</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          <div className="dropdown">
            <label>Sorting:</label>
            <select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
            >
              <option value="">Select Sorting</option>
              <option value="priority">By Priority</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>
      )}

      <div className="columns">
        {Object.keys(groupedTickets).map((groupKey) => (
          <div key={groupKey} className="column">
            {console.log('groupKey', groupKey)}
            <h3>
            {grouping === "priority" ? (
          <>
            <img 
              src={priorityImages[groupKey]} 
              alt={priorityMapping[groupKey]} 
              className="priority-icon" 
            />
            {priorityMapping[groupKey]}
            <span className = "group-count">{groupedTickets[groupKey].length}</span>
            <img 
              src={'/icons_FEtask/add.svg'} 
              alt='plus sign' 
              className="plus-icon" 
            />
            <img 
              src={'/icons_FEtask/3 dot menu.svg'} 
              alt='3 dot sign' 
              className="3-dot-icon"
            />
          </>
        ) : ( grouping === "status" ? (
            <>
            <img 
              src={statusImages[groupKey.replace(/\s+/g, '')]} 
              alt="status" 
              className="status-icon" 
            />
            {groupKey}
            <span className = "group-count">{groupedTickets[groupKey].length}</span>
            <img 
              src={'/icons_FEtask/add.svg'} 
              alt='plus sign' 
              className="plus-icon" 
            />
            <img 
              src={'/icons_FEtask/3 dot menu.svg'} 
              alt='3 dot sign' 
              className="3-dot-icon"
            />
          </>
        ) :
        <>
        <img 
          src={'/logo192.png'} 
          alt="status" 
          className="user-icon" 
        />
        {groupKey}
        <span className = "group-count">{groupedTickets[groupKey].length}</span>
        <img 
              src={'/icons_FEtask/add.svg'} 
              alt='plus sign' 
              className="plus-icon" 
            />
        <img 
              src={'/icons_FEtask/3 dot menu.svg'} 
              alt='3 dot sign' 
              className="3-dot-icon"
            />
      </>
        )}
        </h3>
            {sortTickets(groupedTickets[groupKey]).map((ticket) => (
              <div key={ticket.id} className="card">
                <h4 className = 'ticketId'>{ticket.id}</h4>
                {groupKey !== ticket.userName && <img 
                src={'/logo192.png'} 
                alt="status"
                className="profile-icon" 
                />}
                <h4>{ticket.title}</h4>
                {groupKey !== ticket.priority && <> <img 
                src={priorityImages[ticket.priority]} 
                alt={priorityMapping[ticket.priority]} 
                className="priority-icon" 
                />
                {ticket.tag}
                </>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
