import userIdentity from '../api/userIdentity.js'
import axios from 'axios';

function update(component) {
  let lecList = []
        axios.get(`http://localhost:3001/api/lectures`, { withCredentials: true, credentials: 'include' })
            .then(res => {
                console.log(res.data)
                lecList = res.data
                console.log(lecList)
                component.setState({ tableData: lecList })

            }).catch(err=>{ 
                userIdentity.removeUserSession(component.props.context);
                component.props.history.push("/");
                console.log(err);
             });
}

export default update;