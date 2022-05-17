var EmployeeBox = React.createClass({
    getInitialState: function () {
        return { data: [],//change the 1 to a 0 to turn tokenization back on
        viewthepage: 0};
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });
                this.setState({ viewthepage: this.state.data[0].employeetype});
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
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadEmployeesFromServer();
        }
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>NO ACCESS</div>
            );
        } else 
        return (
            <div>
                <h1>Search Employee</h1>
                <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
                <br />
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
                            </tr>
                         </thead>
                        <EmployeeList data={this.state.data} />
                    </table>
                
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
            employeeemail: "",
            employeeaddress: "",
            employeecity: "",
            employeezip: "",
            employeestate: "",
            data:[]
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmpType: function () {
        $.ajax({
            url: '/getemptypes',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadEmpType();
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
                    employeeid={employee.employeeID}
                    employeefirstname={employee.eFirstName}
                    employeelastname={employee.eLastName}
                    employeeemail={employee.eEmail}
                    employeeaddress={employee.eAddress}
                    employeecity={employee.eCity}
                    employeezip={employee.eZip}
                    employeestate={employee.eState}
                    employeetype={employee.employeetype}
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

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.empkey} 
                            </td>
                            <td>
                                {this.props.employeeid}
                            </td>
                            <td>
                                {this.props.employeefirstname}
                            </td>
                            <td>
                                {this.props.employeelastname}
                            </td>
                            <td>
                                {this.props.employeeemail}
                            </td>
                            <td>
                                {this.props.employeeaddress}
                            </td>
                            <td>
                                {this.props.employeecity}
                            </td>
                            <td>
                                {this.props.employeezip}
                            </td>
                            <td>
                                {this.props.employeestate}
                            </td>
                            <td>
                                {this.props.employeetype}
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
ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);