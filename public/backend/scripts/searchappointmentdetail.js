var AppointmentsBox = React.createClass({
    getInitialState: function () {
        return { data: [],//turn 1 to a 0 to turn back on tokenization
        viewthepage: 0};
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });
                this.setState({ viewthepage: this.state.data[0].employeetype }); //this will need to be changed for tokenization
                console.log("Logged in:" + this.state.viewthepage);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadAppointmentsFromServer: function () {
        $.ajax({
            url: '/getappointmentdetails',
            data: {
                'appointmentdetailid': appointmentdetailid.value,
                'appointmentid': appID.value, //linked table   
                'appointmentnotes': appointmentnotes.value,           
                'appointmentstatus': appStatus.value, //linked table   
                'appointmentdate': appointmentdate.value,
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
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadAppointmentsFromServer();
        }
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>PLEASE GO BACK : RESTRICTED AREA</div>
                
            );
        } else {
        return (
            <div>
                <h1>Search Appointment Info</h1>
                <Appointmentsform2 onAppointmentSubmit={this.loadAppointmentsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Appointment Key</th>
                                <th>Appointment Detail ID</th>
                                <th>Appointment ID</th>
                                <th>Appointment Notes</th>
                                <th>Appointment Status</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>

                                
                            </tr>
                         </thead>
                        <AppointmentsList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
}
});

var Appointmentsform2 = React.createClass({
    getInitialState: function () {
        return {
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
    loadStatus: function () {
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
        this.loadStatus();
        
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var appointmentdetailid = this.state.appointmentdetailid.trim();
        var appointmentid =  appID.value; 
        var appointmentnotes = this.state.appointmentnotes.trim();
        var appointmentstatus = appStatus.value;
        var appointmentdate = this.state.appointmentdate.trim();
        var appointmenttime = this.state.appointmenttime.trim();

        this.props.onAppointmentSubmit({ 
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
                <input type="submit" value="Search Appointment Detail" />

            </form>
            </div>
        );
    }
});

var AppointmentsList = React.createClass({
    render: function () {
        var appointmentdetailsNodes = this.props.data.map(function (appointmentdetails) {
            
            return (
                <Appointments
                    key={appointmentdetails.appointmentDetailKey}
                    appointmentdetailkey={appointmentdetails.appointmentDetailKey}
                    appointmentdetailid={appointmentdetails.appointmentDetailID}
                    appointmentid={appointmentdetails.appointmentsID}
                    appointmentnotes={appointmentdetails.appointmentNotes} 
                    appointmentstatus={appointmentdetails.appointmentstatus}
                    appointmentdate={appointmentdetails.appointmentDate}
                    appointmenttime={appointmentdetails.appointmentTime}
                >
                </Appointments>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {appointmentdetailsNodes}
            </tbody>
        );
    }
});



var Appointments = React.createClass({

    render: function () {
        return (

            <tr>
                            
                            <td>
                                {this.props.appointmentdetailkey} 
                            </td>
                            <td>
                                {this.props.appointmentdetailid} 
                            </td>
                            <td>
                                {this.props.appointmentid} 
                            </td>
                            <td>
                                {this.props.appointmentnotes}
                            </td>
                            <td>
                                {this.props.appointmentstatus}
                            </td>
                            <td>
                                {this.props.appointmentdate}
                            </td>
                            <td>
                                {this.props.appointmenttime}
                            </td>
                </tr>
        );
    }
});

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

ReactDOM.render(
    <AppointmentsBox />,
    document.getElementById('content')
);