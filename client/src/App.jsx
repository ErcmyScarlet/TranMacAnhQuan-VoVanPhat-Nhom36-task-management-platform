import { useEffect, useState } from "react";
   import api from "./api/axios";

   function App() {
     const [projects, setProjects] = useState([]);

     useEffect(() => {
       api.get("/projects").then((res) => setProjects(res.data.data));
     }, []);

     return (
       <div>
         <h1></h1>
         <ul>
           {projects.map((p) => (
             <li key={p._id}>{p.title}</li>
           ))}
         </ul>
       </div>
     );
   }

   export default App;