var EmployeeBox = React.createClass({
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
    loadEmployeesFromServer: function () {
       
        $.ajax({
            url: '/getemp',
            data: {
                'employeeid': employeeid.value,
                'employeefirstname': employeefirstname.value,
                'employeelastname': employeelastname.value,
                'employeeemail': employeeemail.value,
                'employeeaddress': employeeaddress.value,
                'employeecity': employeecity.value,
                'employeezip':employeezip.value,
                'employeestate': employeestate.value,
                'employeetype':empType.value
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
    updateSingleEmpFromServer: function (employee) {
        
        $.ajax({
            url: '/updatesingleemp',
            dataType: 'json',
            data: employee,
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
            this.loadEmployeesFromServer();
            this.updateSingleEmpFromServer();
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
                <h1>Update Employee</h1>
                <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
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
                                <th>Type </th>
                                <th></th>
                            </tr>
                         </thead>
                        <EmployeeList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <EmployeeUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeekey: "",
            employeeid: "",
            employeefirstname: "",
            employeelastname: "",
            employeeemail: "",
            employeeaddress: "",
            employeecity: "",
            employeezip: "",
            employeestate: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
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
    componentDidMount: function() {
        this.loadEmpTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var employeeid = this.state.employeeid.trim();
        var employeefirstname = this.state.employeefirstname.trim();
        var employeelastname = this.state.employeelastname.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeeaddress = this.state.employeeaddress.trim();
        var employeecity = this.state.employeecity.trim();
        var employeezip = this.state.employeezip.trim();
        var employeestate = this.state.employeestate.trim();
        var employeetype = empType.value;

        this.props.onEmployeeSubmit({ 
            employeeid: employeeid,
            employeefirstname: employeefirstname,
            employeelastname: employeelastname,
            employeeemail: employeeemail,
            employeeaddress: employeeaddress,
            employeecity: employeecity,
            employeezip: employeezip,
            employeestate: employeestate,
            employeetype: employeetype
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
                            <th>Employee ID</th>
                            <td>
                                <input type="text" name="employeeid" id="employeeid" value={this.state.employeeid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee First Name</th>
                            <td>
                                <input name="employeefirstname" id="employeefirstname" value={this.state.employeefirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Last Name</th>
                            <td>
                                <input name="employeelastname" id="employeelastname" value={this.state.employeelastname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Email</th>
                            <td>
                                <input name="employeeemail" id="employeeemail" value={this.state.employeeemail} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Address</th>
                            <td>
                                <input name="employeeaddress" id="employeeaddress" value={this.state.employeeaddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee City</th>
                            <td>
                                <input name="employeecity" id="employeecity" value={this.state.employeecity} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Zipcode</th>
                            <td>
                                <input name="employeezip" id="employeezip" value={this.state.employeezip} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee State</th>
                            <td>
                                <input name="employeestate" id="employeestate" value={this.state.employeestate} onChange={this.handleChange} />
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
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Employee" />

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
var EmployeeUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upemployeekey: "",
            upemployeeid: "",
            upemployeefirstname: "",
            upemployeelastname: "",
            upemployeeemail: "",
            upemployeeaddress: "",
            upemployeecity: "",
            upemployeezip: "",
            upemployeestate: "",
            upemployeetype: "",
            updata: []
        };
    },
    
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadEmpTypes: function() {
        $.ajax({
            url: '/getemptypes',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({updata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadEmpTypes();
    },
            
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upemployeekey = upempkey.value;
        var upemployeeid = upempid.value;
        var upemployeefirstname = upempfirstname.value;
        var upemployeelastname = upemplastname.value;
        var upemployeeemail = upempemail.value;
        var upemployeeaddress = upempaddress.value;
        var upemployeecity = upempcity.value;
        var upemployeezip = upempzip.value;
        var upemployeestate = upempstate.value;
        var upemployeetype = upempType.value;

        this.props.onUpdateSubmit({
            upemployeekey: upemployeekey,
            upemployeeid: upemployeeid,
            upemployeefirstname: upemployeefirstname,
            upemployeelastname: upemployeelastname,
            upemployeeemail: upemployeeemail,
            upemployeeaddress: upemployeeaddress,
            upemployeecity: upemployeecity,
            upemployeezip: upemployeezip,
            upemployeestate: upemployeestate,
            upemployeetype: upemployeetype
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
        <th>Employee ID</th>
        <td>
<input type="text" name="upempid" id="upempid" value={this.state.upempid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee First Name</th>
        <td>
<input name="upempfirstname" id="upempfirstname" value={this.state.upempfirstname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee Last Name</th>
        <td>
<input name="upemplastname" id="upemplastname" value={this.state.upemplastname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee Email</th>
        <td>
<input name="upempemail" id="upempemail" value={this.state.upempemail} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee Address</th>
        <td>
<input name="upempaddress" id="upempaddress" value={this.state.upempaddress} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee City</th>
        <td>
<input name="upempcity" id="upempcity" value={this.state.upempcity} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee Zip</th>
        <td>
<input name="upempzip" id="upempzip" value={this.state.upempzip} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee State</th>
        <td>
            <input name ="upempstate" id="upempstate" value={this.state.upempstate} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Employee Type</th>
            <td>
                <SelectUpdateList data={this.state.updata}/>
            </td>
        </tr>
    
</tbody>
                        </table><br />
                        <input type="hidden" name="upempkey" id="upempkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
        );
    }
});

var EmployeeList = React.createClass({
    render: function () {
        var employeeNodes = this.props.data.map(function (employee) {
            return (
                <Employee
                    key={employee.employeeKey}
                    empkey={employee.employeeKey}
                    empid={employee.employeeID}
                    empfirstname={employee.eFirstName}
                    emplastname={employee.eLastName}
                    empemail={employee.eEmail}
                    empaddress={employee.eAddress}
                    empcity={employee.eCity}
                    empzip={employee.eZip}
                    empstate={employee.eState}
                    emptype={employee.employeetype}
                >
                </Employee>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {employeeNodes}
            </tbody>
        );
    }
});

var Employee = React.createClass({
    getInitialState: function () {
        return {
            upempkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupempkey = this.props.empkey;
        
        this.loadSingleEmp(theupempkey);
    },
    loadSingleEmp: function (theupempkey) {
        $.ajax({
            url: '/getsingleemp',
            data: {
                'upempkey': theupempkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (employee) {
                    upempkey.value = theupempkey;
                    upempid.value = employee.employeeID;
                    upempfirstname.value = employee.eFirstName;
                    upemplastname.value = employee.eLastName;
                    upempemail.value = employee.eEmail;
                    upempaddress.value = employee.eAddress;
                    upempcity.value = employee.eCity;
                    upempzip.value = employee.eZip;
                    upempstate.value = employee.eState;
                    upempType.value = employee.employeetype;


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
                                {this.props.empkey} 
                            </td>
                            <td>
                                {this.props.empid}
                            </td>
                            <td>
                                {this.props.empfirstname}
                            </td>
                            <td>
                                {this.props.emplastname}
                            </td>
                            <td>
                                {this.props.empemail}
                            </td>
                            <td>
                                {this.props.empaddress}
                            </td>
                            <td>
                                {this.props.empcity}
                            </td>
                            <td>
                                {this.props.empzip}
                            </td>
                            <td>
                                {this.props.empstate}
                            </td>
                            <td>
                                {this.props.emptype}
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
var SelectUpdateList = React.createClass({
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
            <select name="upempType" id="upempType">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);