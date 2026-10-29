import {useState, useEffect, useRef} from 'react';

const Dashboard = () => {
    const [employee, setEmployee] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [dept, setDept] = useState("");
    const [sorting, setSorting] = useState({column: ""});
    const [currentPage, setCurrentPage] = useState(1);
    let itemsPerPage = 10;
    let ref = useRef(0);

    useEffect(() => {
        //debounce
        let timerId;

        timerId = setTimeout(() => {
            fetchEmployeeDetails();
        }, 500);
        
        return () => clearTimeout(timerId);
    }, [search]);

    // useEffect(() => {
    //     let elapsedTime = Date.now()-ref.current;
    //     let remainingTime = Math.max(0, 500 - elapsedTime);

    //     let timerId = setTimeout(() => {
    //         ref.current = Date.now();
    //         fetchEmployeeDetails();
    //     }, remainingTime);

    //     return () => clearTimeout(timerId);
    // })

    const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://dummyjson.com/users/search?q=${search}`);
            const data = await res.json();
            setEmployee(data.users);
            setLoading(false);
        } catch(err) {
            setErr("Something went wrong");
        }
    }
    const searchValue = search.toLowerCase();

    const filteredUsers = employee.filter(user => {
        // const matchedUsers = user.firstName.toLowerCase().includes(searchValue) || 
        //     user.lastName.toLowerCase().includes(searchValue) ||
        //     user.email.toLowerCase().includes(searchValue);

        const matchingDepartment = (dept === "" || user.company.department === dept);   
        
        return  matchingDepartment;
    }).sort((a, b) => {
        if(sorting.column === "firstName" || sorting.column === "lastName" || sorting.column === "department" || sorting.column === "role") {
            return a[sorting.column]?.localeCompare(b[sorting.column]);
        } else if(sorting.column === "age") {
            return a.age - b.age;
        }
    })

    const department = [...new Set(employee.map(emp => emp.company.department))];

    const handleSorting = (e) => {
        setSorting({column: e});
    }
    
    const totalPage = Math.ceil(employee.length/itemsPerPage);
    let lastPageIndex = itemsPerPage*currentPage;
    let startIndex = lastPageIndex-itemsPerPage;
    let paginatedPages = filteredUsers.slice(startIndex, lastPageIndex);
    
    return (
        <>
            <h1>Dashboard</h1>
            {loading && <h4>Loading....</h4>}
            {err && <h4>{err}</h4>}
            <div style={{display: "flex", justifyContent: "start", marginLeft: "10px", marginBottom: "3px"}}>
                <input placeholder='Search employee details'  value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div style={{display: "flex", justifyContent: "start", marginLeft: "10px", marginBottom: "3px"}}>
                <select onChange={(e)=>setDept(e.target.value)}>
                    <option value="">Departments</option>
                    {department.map(dept => 
                        (<option key={dept} value={dept} >{dept}</option>)
                    )}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <td onClick={() => handleSorting("firstName")}>First Name</td>
                        <td onClick={() => handleSorting("lastName")}>Last Name</td>
                        <td >Email</td>
                        <td onClick={() => handleSorting("department")}>Department</td>
                        <td onClick={() => handleSorting("age")}>Age</td>
                        <td onClick={() => handleSorting("role")}>Role</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        paginatedPages.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <th >{user.firstName}</th>
                                    <th >{user.lastName}</th>
                                    <th>{user.email}</th>
                                    <th >{user.company.department}</th>
                                    <th >{user.age}</th>
                                    <th >{user.role}</th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div>
                <button onClick={() => setCurrentPage(prev=>prev-1)}>Prev</button>
                <button disabled>{currentPage}</button>
                <button onClick={() =>setCurrentPage(prev => prev+1)}>Next</button>
            </div>
            
        </>
    )
}

export default Dashboard;
