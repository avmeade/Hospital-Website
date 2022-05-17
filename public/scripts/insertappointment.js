var AppointmentBox = React.createClass({
    handleAppointmentSubmit: function (appointment) {

        $.ajax({
            url: '/appointment',
            dataType: 'json',
            type: 'POST',
            data: appointment,
            success: function (data) {
                //We set the state again after submission, to update with the submitted data
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div className="AppointmentBox">
                <h1>Appointment</h1>
                <Appointmentform2 onAppointmentSubmit={this.handleAppointmentSubmit} />
            </div>
        );
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid: "",
            data1: [], //appointmentDetailID
            data2: [], //employeeID
            data3: [], //patientID
            
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadAppointmentDetailID: function() {
        $.ajax({
            url: '/getappointmentdetailid',
            dataType: 'json',
            cache: false,
            success: function(data1) {
                this.setState({data1:data1});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadEmployeeID: function() {
        $.ajax({
            url: '/getemployeeid',
            dataType: 'json',
            cache: false,
            success: function(data2) {
                this.setState({data2:data2});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPatientID: function() {
        $.ajax({
            url: '/getpatientid',
            dataType: 'json',
            cache: false,
            success: function(data3) {
                this.setState({data3:data3});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAppointmentDetailID();
        this.loadEmployeeID();
        this.loadPatientID();
        //start here again when done eating
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentdetailid = appdetailid.value;
        var employeeid = employeeID.value;
        var patientid = patName.value;
        

        

        this.props.onAppointmentSubmit({ 
            appointmentid: appointmentid,
            appointmentdetailid: appointmentdetailid,
            employeeid: employeeid,
            patientid: patientid,
            

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
                <h2>Please fill Appointment after details have been assigned.</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentid}
                                    uniqueName="appointmentid"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentid')}
                                    errorMessage="Appointment ID is invalid"
                                    emptyMessage="Appointment ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Appointment Detail ID
                            </th>
                            <td>
                                <SelectList1 data={this.state.data1} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Employee ID
                            </th>
                            <td>
                                <SelectList2 data={this.state.data2} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Patient ID
                            </th>
                            <td>
                                <SelectList3 data={this.state.data3} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment" />
            </form>
        );
    }
});
//appointmentdetail id 
var SelectList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (appdetailids) {
            return (
                <option
                    key={appdetailids.appointmentDetailID}
                    value={appdetailids.appointmentDetailID}
                >
                    {appdetailids.appointmentDetailID}
                </option>
            );
        });
        return (
            <select name="appdetailid" id="appdetailid">
                {optionNodes}
            </select>
        );
    }
});
//employeeID
var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (employeeIDs) {
            return (
                <option
                    key={employeeIDs.employeeID}
                    value={employeeIDs.employeeID}
                >
                    {employeeIDs.eFirstName}
                </option>
            );
        });
        return (
            <select name="employeeID" id="employeeID">
                {optionNodes}
            </select>
        );
    }
});
//patient id select
var SelectList3 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patNames) {
            return (
                <option
                    key={patNames.patientID}
                    value={patNames.patientID}
                >
                    {patNames.pFirstName}
                </option>
            );
        });
        return (
            <select name="patName" id="patName">
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
                        type={this.props.inputType}
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
    <AppointmentBox />,
    document.getElementById('content2')
);

