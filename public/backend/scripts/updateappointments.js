var AppointmentBox = React.createClass({
    getInitialState: function () {
        return { data: [],
        viewthepage: 0};
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });
                this.setState({ viewthepage: this.state.data[0].employeetype });
                console.log("Logged in:" + this.state.viewthepage);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadAppointmentsFromServer: function () {

        $.ajax({
            url: '/getappointments',
            data: {
                'appointmentid': appointmentid.value,
                'appointmentdetailid': detailID.value, //linked table            
                'appointmentempid': empID.value, //linked table   
                'appointmentpatid': patID.value //linked table   
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleAppFromServer: function (appointment) {
        
        $.ajax({
            url: '/updatesingleapp',
            dataType: 'json',
            data: appointment,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0){
            this.loadAppointmentsFromServer();
            this.updateSingleAppFromServer();
        }
        
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>PLEASE GO BACK : RESTRICTED AREA</div>
                
            );
        } else
        return (
            <div>
                <h1>Update Appointment</h1>
                <Appointmentform2 onAppointmentSubmit={this.loadAppointmentsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Key </th>
                                <th>Appointment ID </th>
                                <th>Appointment Detail ID </th>
                                <th>Employee ID </th>
                                <th>Patient ID </th>
                                <th></th>
                            </tr>
                         </thead>
                        <AppointmentList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <AppointmentUpdateform onUpdateSubmit={this.updateSingleAppFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid: "",
            data1: [], //appointment detail id 
            data2: [], //employee id 
            data3: [], //patient id 
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    //for select list, pulls from server js to grab the correct table the data is situated in
    loadAppDetailID: function () {
        $.ajax({
            url: '/getappointmentdetailid',
            dataType: 'json',
            cache: false,
            success: function (data1) {
                this.setState({ data1: data1 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadEmployeeID: function () {
        $.ajax({
            url: '/getemployeeid',
            dataType: 'json',
            cache: false,
            success: function (data2) {
                this.setState({ data2: data2});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPatientID: function () {
        $.ajax({
            url: '/getpatientid',
            dataType: 'json',
            cache: false,
            success: function (data3) {
                this.setState({ data3: data3 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadAppDetailID();
        this.loadEmployeeID();
        this.loadPatientID();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentdetailid =  detailID.value; 
        var appointmentempid = empID.value;
        var appointmentpatid = patID.value;

        this.props.onAppointmentSubmit({ 
            appointmentid: appointmentid,
            appointmentdetailid: appointmentdetailid,
            appointmentempid: appointmentempid,
            appointmentpatid: appointmentpatid, 
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
                <h2></h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <input type="text" name="appointmentid" id="appointmentid" value={this.state.appointmentid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Detail ID</th>
                            <td><SelectList1 data = {this.state.data1} /></td>
                        </tr>
                        <tr>
                            <th>Employee Name</th>
                            <td><SelectList2 data = {this.state.data2} /></td>
                        </tr>
                        <tr>
                            <th>Patient Name</th>
                            <td><SelectList3 data = {this.state.data3} /></td>
                        </tr>
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Appointments" />

            </form>
            </div>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
        </div>
        );
    }
});

var AppointmentUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upappointmentkey: "",
            upappointmentid: "",
            updata1: [], //appointment details id
            updata2: [], //appointment employee id
            updata3: [], //appointment patient id

        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    //grabs table from server js function //select list
    loadAppDetailID: function () {
        $.ajax({
            url: '/getappointmentdetailid',
            dataType: 'json',
            cache: false,
            success: function (data1) {
                this.setState({ updata1: data1 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadEmployeeID: function () {
        $.ajax({
            url: '/getemployeeid',
            dataType: 'json',
            cache: false,
            success: function (data2) {
                this.setState({ updata2: data2});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPatientID: function () {
        $.ajax({
            url: '/getpatientid',
            dataType: 'json',
            cache: false,
            success: function (data3) {
                this.setState({ updata3: data3 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAppDetailID();
        this.loadEmployeeID();
        this.loadPatientID();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upappointmentkey = upappkey.value;
        var upappointmentid = upappid.value;
        var upappointmentdetailid = updetailID.value; //select list value
        var upappointmentemployeeid = upempID.value;
        var upappointmentpatientid = uppatID.value;

        this.props.onUpdateSubmit({
            upappointmentkey: upappointmentkey,
            upappointmentid: upappointmentid,
            upappointmentdetailid: upappointmentdetailid,
            upappointmentemployeeid: upappointmentemployeeid,
            upappointmentpatientid: upappointmentpatientid
            
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>

                        <table>
                            <tbody>
    <tr>
        <th>Appointment ID</th>
        <td>
<input type="text" name="upappid" id="upappid" value={this.state.upappid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Appointment Detail ID
        </th>
        <td>
            <SelectUpdateList1 data={this.state.updata1} /> 
        </td>
    </tr>
    <tr>
        <th>
            Appointment Employee ID
        </th>
        <td>
            <SelectUpdateList2 data={this.state.updata2} /> 
        </td>
    </tr>
    <tr>
        <th>
            Appointment Patient ID
        </th>
        <td>
            <SelectUpdateList3 data={this.state.updata3} /> 
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upappkey" id="upappkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment" />
                    </form>
                </div>
            </div>
        );
    }
});

var AppointmentList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (appointment) {
            return (
                <Appointment
                    key={appointment.appointmentKey}
                    appkey={appointment.appointmentKey}
                    appid={appointment.appointmentID}
                    appdetailid={appointment.appointmentDetailsID}
                    appemployeeid={appointment.employeesID}
                    apppatientid={appointment.patientsID}
                >
                </Appointment>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {appointmentNodes}
            </tbody>
        );
    }
});

var Appointment = React.createClass({
    getInitialState: function () {
        return {
            upappkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupappkey = this.props.appkey;
        
        this.loadSingleApp(theupappkey);
    },
    loadSingleApp: function (theupappkey) {
        $.ajax({
            url: '/getsingleapp',
            data: {
                'upappkey': theupappkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (appointment) {
                    upappkey.value = theupappkey;
                    upappid.value = appointment.appointmentID;
                    updetailID.value = appointment.appointmentDetailsID;
                    upempID.value = appointment.employeesID;
                    uppatID.value = appointment.patientsID;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },
    render: function () {
        return (
            <tr>
                            <td>
                                {this.props.appkey} 
                            </td>
                            <td>
                                {this.props.appid}
                            </td>
                            <td>
                                {this.props.appdetailid}
                            </td>
                            <td>
                                {this.props.appemployeeid}
                            </td>
                            <td>
                                {this.props.apppatientid}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});
//linking table
var SelectList1 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (detailIDs) {
            return (
                <option
                    key = {detailIDs.appointmentDetailID}
                    value= {detailIDs.appointmentDetailID}
                >
                    {detailIDs.appointmentDetailID}        
                </option>
            );
        });
        return (
            <select name = "detailID" id = "detailID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (detailIDs) {
            return (
                <option
                    key={detailIDs.appointmentDetailID}
                    value={detailIDs.appointmentDetailID}
                >
                    {detailIDs.appointmentDetailID}
                </option>
            );
        });
        return (
            <select name="updetailID" id="updetailID">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//linking table
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (empIDs) {
            return (
                <option
                    key = {empIDs.employeeID}
                    value= {empIDs.employeeID}
                >
                    {empIDs.employeeID}        
                </option>
            );
        });
        return (
            <select name = "empID" id = "empID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empIDs) {
            return (
                <option
                    key={empIDs.employeeID}
                    value={empIDs.employeeID}
                >
                    {empIDs.employeeID}
                </option>
            );
        });
        return (
            <select name="upempID" id="upempID">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//linking table
var SelectList3 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (patIDs) {
            return (
                <option
                    key = {patIDs.patientID}
                    value= {patIDs.patientID}
                >
                    {patIDs.patientID}        
                </option>
            );
        });
        return (
            <select name = "patID" id = "patID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList3 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patIDs) {
            return (
                <option
                    key={patIDs.patientID}
                    value={patIDs.patientID}
                >
                    {patIDs.patientID}
                </option>
            );
        });
        return (
            <select name="uppatID" id="uppatID">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <AppointmentBox />,
    document.getElementById('content')
);