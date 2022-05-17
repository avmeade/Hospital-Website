//New page to make appointment detail work.
var AppointmentDetailBox = React.createClass({
    handleAppointmentDetailSubmit: function (appointmentdetail) {

        $.ajax({
            url: '/appointmentdetail',
            dataType: 'json',
            type: 'POST',
            data: appointmentdetail,
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
            <div className="AppointmentDetailBox">
                <h1>Appointment Detail</h1>
                <AppointmentDetailform2 onAppointmentDetailSubmit={this.handleAppointmentDetailSubmit} />
            </div>
        );
    }
});

var AppointmentDetailform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentdetailid: "",
            data1 : [], //this is appointment ID 
            appointmentnotes: "",
            data2 : [], //appointment status
            appointmentdate: "",
            appointmenttime: "",

           
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadAppointmentID: function() {
        $.ajax({
            url: '/getappointmentid',
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
    //binary 0/1 for complete or not
    loadAppointmentStatus: function() {
        $.ajax({
            url: '/getappointmentstatus',
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
    componentDidMount: function () {
        this.loadAppointmentID();
        this.loadAppointmentStatus();
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var appointmentdetailid = this.state.appointmentdetailid.trim();
        var appointmentid = appID.value;
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
            appointmenttime: appointmenttime,
            
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
                <h2>Please fill Appointment Details form first.</h2>
                <table class="insertionTable">
                    <tbody>
                        <tr>
                            <th>Appointment ID </th>
                            <td>
                                <SelectList1 data={this.state.data1}/>
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Notes</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentnotes}
                                    uniqueName="appointmentnotes"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentnotes')}
                                    errorMessage="Appointment notes ID is invalid"
                                    emptyMessage="Appointment notes ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Appointment Status
                            </th>
                            <td>
                                <SelectList2 data={this.state.data2} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date Scheduled </th>
                            <td>
                                <TextInput
                                    inputType="date"
                                    value={this.state.appointmentdate}
                                    uniqueName="appointmentdate"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdate')}
                                    errorMessage="Invalid Date"
                                    emptyMessage="Date is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time Scheduled </th>
                            <td>
                                <TextInput
                                    inputType="time"
                                    value={this.state.appointmenttime}
                                    uniqueName="appointmenttime"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmenttime')}
                                    errorMessage="Invalid Time"
                                    emptyMessage="Time is Required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment Detail" />
            </form>
        );
    }
});
//appointment id select  dropdown
var SelectList1 = React.createClass({
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
            <select name="appID" id="appID">
                {optionNodes}
            </select>
        );
    }
});
//select list for appointment status 
var SelectList2 = React.createClass({
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
            <select name="appStatus" id="appStatus">
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
    <AppointmentDetailBox />,
    document.getElementById('content')
);

