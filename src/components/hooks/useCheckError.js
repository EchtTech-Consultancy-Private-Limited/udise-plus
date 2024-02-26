import {  useSelector } from "react-redux";
import { error } from "../../utils/toaster";

function useCheckError (){
const schoolData = useSelector(state=>state.school);

const handleSchoolAPIResopnse = ()=>{
    if(schoolData.data.errorDetails!==""){
        error(schoolData.data.errorDetails?.message);
    }  
}

return {handleSchoolAPIResopnse};

}

export default useCheckError;