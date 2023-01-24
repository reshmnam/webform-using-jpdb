/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

    var jpdbIml="/api/iml";
    var jpdbBaseUrl="http://api.login2explore.com:5577";
    var jpdbIrl="/api/irl";
    var connToken="90932406|-31949271589515604|90955623";
    var dbName= "School Data";
    var relName= "Student-Details";

    $("#rollno").focus();
    
    function getRollAsJsonObj(){
        var rno=$("#rollno").val();
        var jsonStr = {
            rollno:rno
        };
         return JSON.stringify(jsonStr);
     }
     
     function saveRecno2LS(jsonObj){
         var lvData = JSON.parse(jsonObj.data);
         localStorage=setItem("recno",lvData.rec_no);
     }
     
     function fillData(jsonObj){
         saveRecno2LS(jsonObj);
         var record = JSON.parse(jsonObj.data).record;
         $("#rollno").val(record.rollno);
         $("#name").val(record.name);
         $("#class").val(record.class);
         $("#dob").val(record.dob);
         $("#doj").val(record.doj);
         $("#address").val(record.address);  
     }
 
     
    
    
    function validateAndGetFormData() {
        var rno,nme,cls,dob,doj,addrs;
        rno=$("#rollno").val();
        nme=$("#name").val();
        cls=$("#class").val();
        dob=$("#dob").val();
        doj=$("#doj").val();
        addrs=$("#address").val();  
        if (rno === "") {
        alert("Roll number is Required Value");
        $("#rollno").focus();
        return "";
        }
        if (nme === "") {
        alert("Name is Required Value");
        $("#name").focus();
        return "";
        }
        if (cls === "") {
        alert("Class is Required Value");
        $("#class").focus();
        return "";
        }
        if (doj === "") {
        alert("Date of Joining is Required Value");
        $("#doj").focus();
        return "";
        }
        if (dob === "") {
        alert("Date of Birth is Required Value");
        $("#dob").focus();
        return "";
        }
        if (addrs === "") {
        alert("Address is Required Value");
        $("#address").focus();
        return "";
        }
  
        var jsonStrObj = {
        rollno: rno,
        name: nme,
        class: cls,
        doj: doj,
        dob: dob,
        address:addrs
        };
        return JSON.stringify(jsonStrObj);
        }
        
    function createPUTRequest(connToken,jsonStrObj, dbName, relName){
        var putRequest="{\n" + "\"token\" : \""
                        + connToken 
                        + "\","
                        +"\"dbName\":\""
                        + dbName 
                        + "\",\n"+"\"cmd\":\"PUT\",\n"
                        + "\"rel\":\""
                        + relName + "\","
                        + "\"jsonStr\":\n"
                        + jsonStrObj
                        + "\n"
                        +"}";
        return putRequest;                   
        }
        
    function submit_Form(){ 
    var jsonStrObj = validateAndGetFormData();
    if (jsonStrObj === "") {
    return "";
        alert("Student added to Database"); 
    }
    var putReqStr = createPUTRequest(connToken,
    jsonStrObj, dbName , relName);
    alert(putReqStr);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putReqStr,
    jpdbBaseUrl, jpdbIml);
    alert(JSON.stringify(resJsonObj));
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
    }
    
  
    function executeCommandAtGivenBaseUrl(reqString, jpdbBaseUrl, apiEndPointUrl) {
    var url = jpdbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
    }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
    }
    function resetForm(get) {
    $("#rollno").value = ("");
    $("#name").value("");
    $("#class").value("");
    $("#dob").value("");
    $("#doj").value("");
    $("#address").value("");
    $("#rollno").prop("disabled",false);
    $("#Submit").prop("disabled",true);
    $("#Change").prop("disabled",true);
    $("#rollno").focus();
    }
    
    function change(){
        $("#Change").prop('disabled',true);
        jsonChg=validateAndGetFormData();
        var updateRequest=createUPDATERecordRequest(connToken, jsonChg, dbName, relName,localStorage.getItem("recno"));
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseUrl, jpdbIml);
        jQuery.ajaxSetup({async: true});
        console.log(resJsonObj);
        resetForm();
        $("#rollno").focus();
        }
    function getRoll(){
        var RollJsonObj=getRollAsJsonObj();
        var getRequest=createGet_By_KeyRequest(connToken,dbName, relName,RollJsonObj);
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl, jpdbIrl);
        jQuery.ajaxSetup({async: true});
        if (resJsonObj.status===400){
            $("#Submit").prop("disabled",false);
            $("#Reset").prop("disabled",false);
            $("#name").focus();
        }
        else if(resJsonObj.status===200){
             $("#rollno").prop("disabled",true);
             fillData(resJsonObj);
             $("#Change").prop("disabled",false);
            $("#Reset").prop("disabled",false);
            $("#name").focus();   
        }
        console.log(resJsonObj);
        resetForm();
        $("#rollno").focus();
    }
    
     function createUPDATERecordRequest(token, jsonObj, dbName, relName, recNo) 
     {
         var req = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":{ \""
            + recNo
            + "\":\n"
            + jsonObj
            + "\n"
            + "}}";
    return req;
}   
    
    
   function createGET_BY_KEYRequest(connToken, dbName, relName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + connToken
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbName
            + "\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

    
