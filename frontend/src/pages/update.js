 import axios from 'axios';

 function update(component) {
   let lecList = []
         axios.get(`http:localhost:3001/api/lectures`, { withCredentials: true })
             .then(res => {
                 console.log(res.data)
                 lecList = res.data
                 console.log(lecList)
                 component.setState({ tableData: lecList })

             }).catch(err=>{ 
                 console.log(err);
              });
 }

 export default update;