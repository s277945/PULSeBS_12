import { getLectures, getTeacherLectures } from '../api/api'

/*function update(component) {
  let lecList = [];
       getLectures()
            .then(res => {
                console.log(res.data);
                lecList = res.data;
                console.log(lecList);
                component.setState({ tableData: lecList });
            }).catch(err=>{
                console.log(err);
             });

}*/

function updateTeacher(component) {
    let lecList = [];
    getTeacherLectures()
        .then(res => {
            console.log("Teacher data:");
            console.log(res.data);
            lecList = res.data;
            component.setState({ tableData: lecList });
        }).catch(/* istanbul ignore next */err => {
            console.log(err);
        });

}

export {/*update,*/ updateTeacher };
