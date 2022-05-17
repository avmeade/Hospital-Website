var AppointmentDetailBox = React.createClass({
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
    loadAppointmentDetailsFromServer: function () {

        $.ajax({
            url: '/getappointmentdetails',
            data: {
                'appointmentdetailid': appointmentdetailid.value,
                'appointmentid': appID.value, //appointment table select       
                'appointmentnotes': appointmentnotes.value, 
                'appointmentstatus':appStatus.value,
                'appointmentdate': appointmentdate.value, //linked table   
                'appointmenttime': appointmenttime.value,
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
    updateSingleAppDetailFromServer: function (appointment) {
        
        $.ajax({
            url: '/updatesingleappdetail',
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
            this.loadAppointmentDetailsFromServer();
            this.updateSingleAppDetailFromServer();
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
                <h1>Update Appointment Details</h1>
                <AppointmentDetailform2 onAppointmentDetailSubmit={this.loadAppointmentDetailsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Detail Key </th>
                                <th>Appointment Detail ID </th>
                                <th>Appointment ID </th>
                                <th>Appointment Notes </th>
                                <th>Appointment Status </th>
                                <th>Appointment Date </th>
                                <th>Appointment Time </th>
                                <th></th>
                            </tr>
                         </thead>
                        <AppointmentDetailList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <AppointmentDetailUpdateform onUpdateSubmit={this.updateSingleAppDetailFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var AppointmentDetailform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentdetailkey: "",
            appointmentdetailid: "",
            data1: [], //appointment id
            appointmentnotes: "", 
            data2: [], //appointment status
            appointmentdate: "",
            appointmenttime: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    //for select list, pulls from server js to grab the correct table the data is situated in
    loadAppID: function () {
        $.ajax({
            url: '/getappointmentid',
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
    loadAppStatus: function () {
        $.ajax({
            url: '/getstatus',
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
    componentDidMount: function() {
        this.loadAppID();
        this.loadAppStatus();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var appointmentdetailid = this.state.appointmentdetailid.trim();
        var appointmentid =  appID.value; 
        var appointmentnotes = this.state.appointmentnotes.trim();
        var appointmentstatus = appStatus.value;
        var appointmentdate = this.state.appointmentdate.trim();
        var appointmenttime = this.state.appointmenttime.trim();

        this.props.onAppointmentDetailSubmit({ 
            appointmentdetailid: appointmentdetailid,
            appointmentid: appointmentid,
            appointmentnotes: appointmentnotes,
            appointmentstatus: appointmentstatus,
            appointmentdate: appointmentdate, 
            appointmenttime: appointmenttime
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
                            <th>Appointment Detail ID</th>
                            <td>
                                <input type="text" name="appointmentdetailid" id="appointmentdetailid" value={this.state.appointmentdetailid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment ID</th>
                            <td><SelectList1 data = {this.state.data1} /></td>
                        </tr>
                        <tr>
                            <th>Appointment Notes</th>
                            <td>
                                <input type="text" name="appointmentnotes" id="appointmentnotes" value={this.state.appointmentnotes} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Status</th>
                            <td><SelectList2 data = {this.state.data2} /></td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                                <input type="date" name="appointmentdate" id="appointmentdate" value={this.state.appointmentdate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td>
                                <input type="time" name="appointmenttime" id="appointmenttime" value={this.state.appointmenttime} onChange={this.handleChange} />
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Appointment Details" />

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

var AppointmentDetailUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upappointmentdetailkey: "",
            upappointmentdetailid: "",
            updata1: [], //appointment  id
            upappointmentnotes: "",
            updata2: [], //appointment status
            upappointmentdate: "",
            upappointmenttime: "",

        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    //grabs table from server js function //select list
    loadAppStatus: function () {
        $.ajax({
            url: '/getstatus',
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
    loadAppID: function () {
        $.ajax({
            url: '/getappointmentid',
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
    componentDidMount: function () {
        this.loadAppID();
        this.loadAppStatus();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upappointmentdetailkey = upappdetailkey.value;
        var upappointmentdetailid = upappdetailid.value;
        var upappointmentid = upappID.value; //select list value
        var upappointmentnotes = upappnotes.value;
        var upappointmentstatus = upappStatus.value;
        var upappointmentdate = upappdate.value;
        var upappointmenttime = upapptime.value;

        this.props.onUpdateSubmit({
            upappointmentdetailkey: upappointmentdetailkey,
            upappointmentdetailid: upappointmentdetailid,
            upappointmentid: upappointmentid,
            upappointmentnotes: upappointmentnotes,
            upappointmentstatus: upappointmentstatus,
            upappointmentdate: upappointmentdate,
            upappointmenttime: upappointmenttime
            
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
        <th>Appointment Detail ID</th>
        <td>
<input type="text" name="upappdetailid" id="upappdetailid" value={this.state.upappdetailid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Appointment ID
        </th>
        <td>
            <SelectUpdateList1 data={this.state.updata1} /> 
        </td>
    </tr>
    <tr>
        <th>Appointment Notes</th>
        <td>
<input type="text" name="upappnotes" id="upappnotes" value={this.state.upappnotes} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Appointment Status
        </th>
        <td>
            <SelectUpdateList2 data={this.state.updata2} /> 
        </td>
    </tr>
    <tr>
        <th>Appointment Date</th>
        <td>
<input type="date" name="upappdate" id="upappdate" value={this.state.upappdate} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Appointment Time</th>
        <td>
<input type="time" name="upapptime" id="upapptime" value={this.state.upapptime} onChange={this.handleUpChange} />
        </td>
    </tr>
    
</tbody>
                        </table><br />
                        <input type="hidden" name="upappdetailkey" id="upappdetailkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment Detail" />
                    </form>
                </div>
            </div>
        );
    }
});

var AppointmentDetailList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (appointment) {
            return (
                <AppointmentDetail
                    key={appointment.appointmentDetailKey}
                    appdetailkey={appointment.appointmentDetailKey}
                    appdetailid={appointment.appointmentDetailID}
                    appid={appointment.appointmentsID}
                    appnotes={appointment.appointmentNotes}
                    appstatus={appointment.appointmentstatus}
                    appdate={appointment.appointmentDate}
                    apptime={appointment.appointmentTime}

                >
                </AppointmentDetail>
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

var AppointmentDetail = React.createClass({
    getInitialState: function () {
        return {
            upappdetailkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupappdetailkey = this.props.appdetailkey;
        
        this.loadSingleApp(theupappdetailkey);
    },
    loadSingleApp: function (theupappdetailkey) {
        $.ajax({
            url: '/getsingleappdetail',
            data: {
                'upappdetailkey': theupappdetailkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (appointment) {
                    upappdetailkey.value = theupappdetailkey;
                    upappdetailid.value = appointment.appointmentDetailID;
                    upappID.value = appointment.appointmentsID;//
                    upappnotes.value = appointment.appointmentNotes;
                    upappStatus.value = appointment.appointmentstatus;
                    upappdate.value = appointment.appointmentDate;
                    upapptime.value = appointment.appointmentTime;
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
                                {this.props.appdetailkey} 
                            </td>
                            <td>
                                {this.props.appdetailid}
                            </td>
                            <td>
                                {this.props.appid}
                            </td>
                            <td>
                                {this.props.appnotes}
                            </td>
                            <td>
                                {this.props.appstatus}
                            </td>
                            <td>
                                {this.props.appdate}
                            </td>
                            <td>
                                {this.props.apptime}
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
        var optionNodes = this.props.data.map(function (appIDs) {
            return (
                <option
                    key = {appIDs.appointmentID}
                    value= {appIDs.appointmentID}
                >
                    {appIDs.appointmentID}        
                </option>
            );
        });
        return (
            <select name = "appID" id = "appID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (appIDs) {
            return (
                <option
                    key={appIDs.appointmentID}
                    value={appIDs.appointmentID}
                >
                    {appIDs.appointmentID}
                </option>
            );
        });
        return (
            <select name="upappID" id="upappID">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//linking table
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (appStatuss) {
            return (
                <option
                    key = {appStatuss.statusID}
                    value= {appStatuss.statusID}
                >
                    {appStatuss.statusName}        
                </option>
            );
        });
        return (
            <select name = "appStatus" id = "appStatus">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (appStatuss) {
            return (
                <option
                    key={appStatuss.statusID}
                    value={appStatuss.statusID}
                >
                    {appStatuss.statusName}
                </option>
            );
        });
        return (
            <select name="f" id="upappStatus">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <AppointmentDetailBox />,
    document.getElementById('content')
);