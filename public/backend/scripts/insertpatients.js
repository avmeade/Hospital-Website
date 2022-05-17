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
    handlePatientSubmit: function (patient) {

        $.ajax({
            url: '/patient',
            dataType: 'json',
            type: 'POST',
            data: patient,
            success: function (data) {
                //We set the state again after submission, to update with the submitted data
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0){
            this.handlePatientSubmit();
        }
        
    },
    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>PLEASE GO BACK : RESTRICTED AREA</div>
            );
        } else
        return (
            <div className="PatientBox">
                <h1>Insert Patient</h1>
                <Patientform2 onPatientSubmit={this.handlePatientSubmit} />
            </div>
        );
    }
});

var Patientform2 = React.createClass({
    getInitialState: function () {
        return {
            patientid: "",
            patientfirstname: "",
            patientlastname: "",
            patientpw: "",
            patientpw2: "",
            patientemail: "",
            patientaddress: "",
            patientcity: "",
            patientstate: "",
            patienttype:"2"

           // radio patientMailer: "",
           // selectList data: []
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var patientid = this.state.patientid.trim();
        var patientemail = this.state.patientemail.trim();
        var patientfirstname = this.state.patientfirstname.trim();
        var patientlastname = this.state.patientlastname.trim();
        var patientpw = this.state.patientpw.trim();
        var patientpw2 = this.state.patientpw2.trim();
        var patientemail = this.state.patientemail.trim();
        var patientaddress = this.state.patientaddress.trim();
        var patientcity = this.state.patientcity.trim();
        var patientzip = this.state.patientzip.trim();
        var patientstate = this.state.patientstate.trim();
        var patienttype = this.state.patienttype.trim();
        
        

        if (isNaN(patientzip)) {
            console.log("This must be a number");
            return;
        }

        if (patientpw != patientpw2) {
            console.log("Passwords do not match!!");
            alert("Passwords do not match!!");
            return;
        }

        if (!patientpw || !patientid || !patientemail || !patientstate) {
            console.log("Missed somthin")
            return;
        }

        this.props.onPatientSubmit({ 
            patientid: patientid, 
            patientfirstname: patientfirstname, 
            patientlastname: patientlastname, 
            patientpw: patientpw,
            patientemail: patientemail, 
            patientaddress: patientaddress, 
            patientcity: patientcity,
            patientzip: patientzip,
            patientstate: patientstate,
            patienttype: patienttype,
            
        });

    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2></h2>
                <table class="insertionTable">
                    <tbody>
                        <tr>
                            <th>Patient ID</th>
                            <td>
                                <TextInput
                                    value={this.state.patientid}
                                    uniqueName="patientid"
                                    textArea={false}
                                    required={true}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientid')}
                                    errorMessage="Patient ID is invalid"
                                    emptyMessage="Patient ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.patientfirstname}
                                    uniqueName="patientfirstname"
                                    textArea={false}
                                    required={false}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientfirstname')}
                                    errorMessage="Patient First Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.patientlastname}
                                    uniqueName="patientlastname"
                                    textArea={false}
                                    required={false}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientlastname')}
                                    errorMessage="Patient Last Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.patientpw}
                                    uniqueName="patientpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientpw')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.patientpw2}
                                    uniqueName="patientpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientpw2')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient E-Mail</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.patientemail}
                                    uniqueName="patientemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'patientemail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                                <TextInput
                                    value={this.state.patientaddress}
                                    uniqueName="patientaddress"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientaddress')}
                                    errorMessage="Error with entered address" 
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                              <tr>
                            <th>Patient City</th>
                            <td>
                                <TextInput
                                    value={this.state.patientcity}
                                    uniqueName="patientcity"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientcity')}
                                    errorMessage="Error with entered City"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zip</th>
                            <td>
                                <TextInput
                                    value={this.state.patientzip}
                                    uniqueName="patientcity"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientzip')}
                                    errorMessage="Error with entered Zip"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                                <TextInput
                                    value={this.state.patientstate}
                                    uniqueName="patientstate"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientstate')}
                                    errorMessage="Error with entered State"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Patient" />
            </form>
        );
    }
});
var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
            <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <PatientBox />,
    document.getElementById('content')
);

