var EmployeeBox = React.createClass({
    getInitialState: function () {////////////////
        return { data: [],////////////////
        viewthepage: 0};///////////////
    },///////////////////////
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
    handleEmployeeSubmit: function (employee) {
        $.ajax({
            url: '/employee',
            dataType: 'json',
            type: 'POST',
            data: employee,
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
        this.loadAllowLogin();/////////////////////
        if (this.state.viewthepage != 0){////////////////////
            this.handleEmployeeSubmit();/////////////////////
        }
        
    },
    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (////////////////////////
                <div>PLEASE GO BACK : RESTRICTED AREA</div> //////////////////////////
            );///////////////////////
        } else //////////////////////
        return (
            <div className="EmployeeBox">
                <h1>Insert Employees</h1>
                <Employeeform2 onEmployeeSubmit={this.handleEmployeeSubmit} />
            </div>
        );
    }
});

var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeeid: "",
            employeefirstname: "",
            employeelastname: "",
            employeepw: "",
            employeepw2: "",
            employeeemail: "",
            employeeaddress: "",
            employeecity: "",
            employeezip: "",
            employeestate: "",
            data:[] //employeetype 

           
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmpTypes: function() {
        $.ajax({
            url: '/getemptypes',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        //login the user
        this.loadEmpTypes();
    },
    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var employeeid = this.state.employeeid.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeefirstname = this.state.employeefirstname.trim();
        var employeelastname = this.state.employeelastname.trim();
        var employeepw = this.state.employeepw.trim();
        var employeepw2 = this.state.employeepw2.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeeaddress = this.state.employeeaddress.trim();
        var employeecity = this.state.employeecity.trim();
        var employeezip = this.state.employeezip.trim();
        var employeestate = this.state.employeestate.trim();
        var employeetype = empType.value;
        
        

        if (isNaN(employeezip)) {
            console.log("This must be a number");
            return;
        }

        if (employeepw != employeepw2) {
            console.log("Passwords do not match!!");
            alert("Passwords do not match!!");
            return;
        }

        if (!employeepw || !employeeid || !employeeemail || !employeestate) {
            console.log("Missed somthin")
            return;
        }

        this.props.onEmployeeSubmit({ 
            employeeid: employeeid, 
            employeefirstname: employeefirstname, 
            employeelastname: employeelastname, 
            employeepw: employeepw,
            employeeemail: employeeemail, 
            employeeaddress: employeeaddress, 
            employeecity: employeecity,
            employeezip: employeezip,
            employeestate: employeestate,
            employeetype: employeetype
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
                            <th>Employee ID</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeid}
                                    uniqueName="employeeid"
                                    textArea={false}
                                    required={true}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeeid')}
                                    errorMessage="Employee ID is invalid"
                                    emptyMessage="Employee ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.employeefirstname}
                                    uniqueName="employeefirstname"
                                    textArea={false}
                                    required={false}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeefirstname')}
                                    errorMessage="Employee First Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.employeelastname}
                                    uniqueName="employeelastname"
                                    textArea={false}
                                    required={false}
                                    
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeelastname')}
                                    errorMessage="Employee Last Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.employeepw}
                                    uniqueName="employeepw"
                                    textArea={false}
                                    required={true}
                                    
                                    onChange={this.setValue.bind(this, 'employeepw')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.employeepw2}
                                    uniqueName="employeepw2"
                                    textArea={false}
                                    required={true}
                                    
                                    onChange={this.setValue.bind(this, 'employeepw2')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee E-Mail</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.employeeemail}
                                    uniqueName="employeeemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'employeeemail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Address</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeaddress}
                                    uniqueName="employeeaddress"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeeaddress')}
                                    errorMessage="Error with entered address" 
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                              <tr>
                            <th>Employee City</th>
                            <td>
                                <TextInput
                                    value={this.state.employeecity}
                                    uniqueName="employeecity"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeecity')}
                                    errorMessage="Error with entered City"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Zip</th>
                            <td>
                                <TextInput
                                    value={this.state.employeezip}
                                    uniqueName="employeezip"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeezip')}
                                    errorMessage="Error with entered Zip"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee State</th>
                            <td>
                                <TextInput
                                    value={this.state.employeestate}
                                    uniqueName="employeestate"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeestate')}
                                    errorMessage="Error with entered State"
                                    emptyMessage="Field was empty please fill" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Type</th>
                            <td>
                                <SelectList data={this.state.data}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Employee" />
            </form>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empTypes) {
            return (
                <option
                    key={empTypes.empTypeID}
                    value={empTypes.empTypeID}
                >
                    {empTypes.emptypeName}
                </option>
            );
        });
        return (
            <select name="empType" id="empType">
                {optionNodes}
            </select>
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
    <EmployeeBox />,
    document.getElementById('content')
);

