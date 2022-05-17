var PatientBox = React.createClass({
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
    loadPatientsFromServer: function () {
       
        $.ajax({
            url: '/getpat',
            data: {
                'patientid': patientid.value,
                'patientfirstname': patientfirstname.value,
                'patientlastname':patientlastname.value,
                'patientemail':patientemail.value,
                'patientaddress':patientaddress.value,
                'patientcity':patientcity.value,
                'patientzipcode':patientzipcode.value,
                'patientstate':patientstate.value
                
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
            this.loadPatientsFromServer();
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
                <h1>Search Patient</h1>
                <Patientform2 onPatientSubmit={this.loadPatientsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Patient Name</th>
                                <th>Patient First Name</th>
                                <th>Patient Last Name</th>
                                <th>Patient Email</th>
                                <th>Patient Address</th>
                                <th>Patient City</th>
                                <th>Patient Zipcode</th>
                                <th>Patient State</th>
                                
                            </tr>
                         </thead>
                        <PatientList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
}
});

var Patientform2 = React.createClass({
    getInitialState: function () {
        return {
            patientid: "",
            patientfirstname: "",
            patientlastname: "",
            patientemail: "",
            patientaddress: "",
            patientcity: "",
            patientzipcode: "",
            patientstate: ""
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadProductIDs: function () {
        $.ajax({
            url: '/getproductIDs',
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
    componentDidMount: function() {
        this.loadProductIDs();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var patientid = this.state.patientid.trim();
        var patientfirstname = this.state.patientfirstname.trim();
        var patientlastname = this.state.patientlastname.trim();
        var patientemail = this.state.patientemail.trim();
        var patientaddress = this.state.patientaddress.trim();
        var patientcity = this.state.patientcity.trim();
        var patientzipcode = this.state.patientzipcode.trim();
        var patientstate = this.state.patientstate.trim();

        
        this.props.onPatientSubmit({ 
            patientid: patientid,
            patientfirstname: patientfirstname,
            patientlastname: patientlastname,
            patientemail: patientemail,
            patientaddress: patientaddress,
            patientcity: patientcity,
            patientzipcode: patientzipcode,
            patientstate: patientstate

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
                            <th>Patient ID</th>
                            <td>
                                <input type="text" name="patientid" id="patientid" value={this.state.patientid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                                <input name="patientfirstname" id="patientfirstname" value={this.state.patientfirstname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                                <input name="patientlastname" id="patientlastname" value={this.state.patientlastname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Email</th>
                            <td>
                                <input name="patientemail" id="patientemail" value={this.state.patientemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                                <input name="patientaddress" id="patientaddress" value={this.state.patientaddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient City</th>
                            <td>
                                <input name="patientcity" id="patientcity" value={this.state.patientcity} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zipcode</th>
                            <td>
                                <input name="patientzipcode" id="patientzipcode" value={this.state.patientzipcode} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                                <input name="patientstate" id="patientstate" value={this.state.patientstate} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Patient" />

            </form>
            </div>
        );
    }
});

var PatientList = React.createClass({
    render: function () {
        var patientNodes = this.props.data.map(function (patient) {
            
            return (
                <Patient
                    key={patient.patientKey}
                    patientkey={patient.patientKey}
                    patientid={patient.pFirstName} 
                    patientfirstname={patient.pFirstName}
                    patientlastname={patient.pLastName}
                    patientemail={patient.pEmail}
                    patientaddress={patient.pAddress}
                    patientcity={patient.pCity}
                    patientzipcode={patient.pZip}
                    patientstate={patient.pState}





                    
                >
                </Patient>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {patientNodes}
            </tbody>
        );
    }
});



var Patient = React.createClass({

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.patientkey} 
                            </td>
                            <td>
                                {this.props.patientid}
                            </td>
                            <td>
                                {this.props.patientfirstname}
                            </td>
                            <td>
                                {this.props.patientlastname}
                            </td>
                            <td>
                                {this.props.patientemail}
                            </td>
                            <td>
                                {this.props.patientaddress}
                            </td>
                            <td>
                                {this.props.patientcity}
                            </td>
                            <td>
                                {this.props.patientzipcode}
                            </td>
                            <td>
                                {this.props.patientstate}
                            </td>
                </tr>
        );
    }
});
ReactDOM.render(
    <PatientBox />,
    document.getElementById('content')
);