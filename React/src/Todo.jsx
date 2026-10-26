import React, { useState } from 'react'

const Todo = () => {
    const [inputVal, setInputVal] = useState("");
    const [list, setList] = useState([]);
    const [checkList, setCheckList] = useState([]);

    const handleAddList  = (val) => {
        setList([...list, val]);
    }
    
    const handleDeleteList = () => {
        let filterData = list.filter((val) => !checkList.includes(val));
        setList(filterData);
    }

    const handleCheckList = (e) => {
        setCheckList([...checkList, e]);
    }
    console.log(checkList)
    return (
        <>
            <h1>To-Do List</h1> 
            <div>
                <input placeholder='Enter activities' value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                <button style={{marginRight: "2px", marginLeft: "2px"}} onClick={() => handleAddList(inputVal)}>Add</button>
                <button onClick={handleDeleteList}>Delete</button>
            </div>
            <ul>
                {list && list.map((val) => {
                    return (
                        <div key={val} style={{display: "flex", justifyContent: "center"}}>
                            <input type="checkbox" value={val} onClick={() => handleCheckList(val)}/>
                            <li key={val} style={{listStyle: "none"}}>{val}</li>
                        </div>
                    )
                })}
            </ul>
            
        </>
    );
}

export default Todo;
