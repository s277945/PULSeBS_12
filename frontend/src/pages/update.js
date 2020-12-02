 import { getLectures } from '../api/api'

 function update(component) {
   let lecList = [];
        getLectures()
             .then(res => {
                 console.log(res.data);
                 lecList = res.data;
                 console.log(lecList);
                 component.setState({ tableData: lecList });
             }).catch(/* istanbul ignore next */err=>{
                 console.log(err);
              });

 }

 export default update;
