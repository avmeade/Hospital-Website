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
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadAppointmentsFromServer();
        }
       
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>NO ACCESS</div>
            );
        } else {
        return (
            <div>
                <h1>Search Appointment</h1>
                <Appointmentsform2 onAppointmentSubmit={this.loadAppointmentsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Appointment Key</th>
                                <th>Appointment ID</th>
                                <th>Appointment Detail ID</th>
                                <th>Employee ID</th>
                                <th>Patient ID</th>

                                
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
    //we need to pull, employeeID, appointmentDetailID, patientID 
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
        this.loadEmployeeID();
        this.loadPatientID();
        this.loadAppDetailID();
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
                <input type="submit" value="Search Appointment" />

            </form>
            </div>
        );
    }
});

var AppointmentsList = React.createClass({
    render: function () {
        var appointmentsNodes = this.props.data.map(function (appointment) {
            
            return (
                <Appointments
                    key={appointment.appointmentKey}
                    appointmentkey={appointment.appointmentKey}
                    appointmentid={appointment.appointmentID}
                    appointmentdetailid={appointment.appointmentDetailsID} //product ID 
                    appointmentempid={appointment.employeesID}
                    appointmentpatid={appointment.patientsID}
                >
                </Appointments>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {appointmentsNodes}
            </tbody>
        );
    }
});



var Appointments = React.createClass({

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.appointmentkey} 
                            </td>
                            <td>
                                {this.props.appointmentid} 
                            </td>
                            <td>
                                {this.props.appointmentdetailid}
                            </td>
                            <td>
                                {this.props.appointmentempid}
                            </td>
                            <td>
                                {this.props.appointmentpatid}
                            </td>
                </tr>
        );
    }
});

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
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (empIDs) {
            return (
                <option
                    key = {empIDs.employeeID}
                    value= {empIDs.employeeID}
                >
                    {empIDs.eFirstName}        
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
var SelectList3 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (patIDs) {
            return (
                <option
                    key = {patIDs.patientID}
                    value= {patIDs.patientID}
                >
                    {patIDs.pFirstName}        
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
ReactDOM.render(
    <AppointmentsBox />,
    document.getElementById('content')
);