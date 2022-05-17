var PatientBox = React.createClass({
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
    loadPatientsFromServer: function () {
       
        $.ajax({
            url: '/getpat',
            data: {
                'patientid': patientid.value,
                'patientfirstname': patientfirstname.value,
                'patientlastname': patientlastname.value,
                'patientemail': patientemail.value,
                'patientaddress': patientaddress.value,
                'patientcity': patientcity.value,
                'patientzipcode':patientzipcode.value,
                'patientstate': patientstate.value
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
    updateSinglePatFromServer: function (patient) {
        
        $.ajax({
            url: '/updatesinglepat',
            dataType: 'json',
            data: patient,
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
        if (this.state.viewthepage = 1){
            this.loadPatientsFromServer();
            this.updateSinglePatFromServer();
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
                <h1>Update Patient</h1>
                <Patientform2 onPatientSubmit={this.loadPatientsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Key </th>
                                <th>ID </th>
                                <th>First Name </th>
                                <th>Last Name </th>
                                <th>Email </th>
                                <th>Address </th>
                                <th>City </th>
                                <th>Zipcode </th>
                                <th>State </th>
                                <th></th>
                            </tr>
                         </thead>
                        <PatientList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <PatientUpdateform onUpdateSubmit={this.updateSinglePatFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Patientform2 = React.createClass({
    getInitialState: function () {
        return {
            patientkey: "",
            patientid: "",
            patientfirstname: "",
            patientlastname: "",
            patientemail: "",
            patientaddress: "",
            patientcity: "",
            patientzipcode: "",
            patientstate: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    componentDidMount: function() {
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var patientid = this.state.patientid.trim();
        var patientfirstname = this.state.patientfirstname.trim();
        var patientlastname = this.state.patientlastname.trim();
        var patientemail = this.state.patientemail.trim();
        var patientaddress = this.state.patientaddress.trim();;
        var patientcity = this.state.patientcity.trim();;
        var patientzipcode = this.state.patientzipcode.trim();;
        var patientstate = this.state.patientstate.trim();;

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
            <div id = "theform">
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
                                <input name="patientfirstname" id="patientfirstname" value={this.state.patientfirstname} onChange={this.handleChange}  />
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
                                <input name="patientemail" id="patientemail" value={this.state.patientemail} onChange={this.handleChange}  />
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

var PatientUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uppatientkey: "",
            uppatientid: "",
            uppatientfirstname: "",
            uppatientlastname: "",
            uppatientemail: "",
            uppatientaddress: "",
            uppatientcity: "",
            uppatientzipcode: "",
            uppatientstate: "",
        };
    },
    
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    componentDidMount: function () {
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var uppatientkey = uppatkey.value;
        var uppatientid = uppatid.value;
        var uppatientfirstname = uppatfirstname.value;
        var uppatientlastname = uppatlastname.value;
        var uppatientemail = uppatemail.value;
        var uppatientaddress = uppataddress.value;
        var uppatientcity = uppatcity.value;
        var uppatientzipcode = uppatzipcode.value;
        var uppatientstate = uppatstate.value;

        this.props.onUpdateSubmit({
            uppatientkey: uppatientkey,
            uppatientid: uppatientid,
            uppatientfirstname: uppatientfirstname,
            uppatientlastname: uppatientlastname,
            uppatientemail: uppatientemail,
            uppatientaddress: uppatientaddress,
            uppatientcity: uppatientcity,
            uppatientzipcode: uppatientzipcode,
            uppatientstate: uppatientstate
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
        <th>Patient ID</th>
        <td>
<input type="text" name="uppatid" id="uppatid" value={this.state.uppatid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient First Name</th>
        <td>
<input name="uppatfirstname" id="uppatfirstname" value={this.state.uppatfirstname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient Last Name</th>
        <td>
<input name="uppatlastname" id="uppatlastname" value={this.state.uppatlastname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient Email</th>
        <td>
<input name="uppatemail" id="uppatemail" value={this.state.uppatemail} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient Address</th>
        <td>
<input name="uppataddress" id="uppataddress" value={this.state.uppataddress} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient City</th>
        <td>
<input name="uppatcity" id="uppatcity" value={this.state.uppatcity} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient Zipcode</th>
        <td>
            <input name ="uppatzipcode" id="uppatzipcode" value={this.state.uppatzipcode} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient State</th>
        <td>
            <input name ="uppatstate" id="uppatstate" value={this.state.uppatstate} onChange={this.handleUpChange} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="uppatkey" id="uppatkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Patient" />
                    </form>
                </div>
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
                    patkey={patient.patientKey}
                    patid={patient.patientID}
                    patfirstname={patient.pFirstName}
                    patlastname={patient.pLastName}
                    patemail={patient.pEmail}
                    pataddress={patient.pAddress}
                    patcity={patient.pCity}
                    patzip={patient.pZip}
                    patstate={patient.pState}
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
    getInitialState: function () {
        return {
            uppatkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppatkey = this.props.patkey;
        
        this.loadSingleEmp(theuppatkey);
    },
    loadSingleEmp: function (theuppatkey) {
        $.ajax({
            url: '/getsinglepat',
            data: {
                'uppatkey': theuppatkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (patient) {
                    uppatkey.value = theuppatkey;
                    uppatid.value = patient.patientID;
                    uppatfirstname.value = patient.pFirstName;
                    uppatlastname.value = patient.pLastName;
                    uppatemail.value = patient.pEmail;
                    uppataddress.value = patient.pAddress;
                    uppatcity.value = patient.pCity;
                    uppatzipcode.value = patient.pZip;
                    uppatstate.value = patient.pState;


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
                                {this.props.patkey} 
                            </td>
                            <td>
                                {this.props.patid}
                            </td>
                            <td>
                                {this.props.patfirstname}
                            </td>
                            <td>
                                {this.props.patlastname}
                            </td>
                            <td>
                                {this.props.patemail}
                            </td>
                            <td>
                                {this.props.pataddress}
                            </td>
                            <td>
                                {this.props.patcity}
                            </td>
                            <td>
                                {this.props.patzip}
                            </td>
                            <td>
                                {this.props.patstate}
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

ReactDOM.render(
    <PatientBox />,
    document.getElementById('content')
);