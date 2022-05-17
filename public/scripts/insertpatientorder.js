var PatientOrderBox = React.createClass({
    getInitialState: function () {
        return { data: [],
        viewthepage: 1};
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
    handlePatientOrderSubmit: function (patientorder) {
        $.ajax({
            url: '/patientorder',
            dataType: 'json',
            type: 'POST',
            data: patientorder,
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
            
        }
        
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (////////////////////////
                <div>PLEASE GO BACK : RESTRICTED AREA</div> //////////////////////////
            );///////////////////////
        } else
        return (
            <div className="PatientOrderBox">
                <h1>Create Order</h1>
                <PatientOrderform2 onPatientOrderSubmit={this.handlePatientOrderSubmit} />
            </div>
        );
    }
});

var PatientOrderform2 = React.createClass({
    getInitialState: function () {
        return {
            patientorderid: "",
            patientorderdate: "",
            patientordertime: "",
            patientname: "",
            data1 : [], //this is patient ID 
            data2 : [], //this is orderdetails id
            
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadPatientID: function() {
        $.ajax({
            url: '/getpatientid',
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
    loadOrderDetailID: function() {
        $.ajax({
            url: '/getorderdetailid',
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
        this.loadPatientID();
        this.loadOrderDetailID();
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var patientorderid = this.state.patientorderid;
        var patientorderdate = this.state.patientorderdate;
        var patientordertime = this.state.patientordertime;
        var patientname = this.state.patientname;
        var patientid = patientIDSelect.value;
        var orderdetailid = detailIDSelect.value;
        

        this.props.onPatientOrderSubmit({ 
            patientorderid: patientorderid, 
            patientorderdate: patientorderdate,
            patientordertime: patientordertime,
            patientname: patientname,
            patientid: patientid,
            orderdetailid: orderdetailid
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
                            <th>Order ID</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.patientorderid}
                                    uniqueName="patientorderid"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientorderid')}
                                    errorMessage="Invalid ID"
                                    emptyMessage="ID is Required" />
                            </td>
                        </tr>
                    <tr>
                            <th>Order Date</th>
                            <td>
                                <TextInput
                                    inputType="date"
                                    value={this.state.patientorderdate}
                                    uniqueName="patientorderdate"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientorderdate')}
                                    errorMessage="Invalid Date"
                                    emptyMessage="Date is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Time</th>
                            <td>
                                <TextInput
                                    inputType="time"
                                    value={this.state.patientordertime}
                                    uniqueName="patientordertime"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientordertime')}
                                    errorMessage="Invalid Time"
                                    emptyMessage="Time is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Order Name</th>
                            <td>
                                <TextInput
                                    value={this.state.patientname}
                                    uniqueName="patientname"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'patientname')}
                                    errorMessage="Patient name is invalid"
                                    emptyMessage="Patient name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient ID </th>
                            <td>
                                <SelectList1 data={this.state.data1}/>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>
                                Order Details ID
                            </th>
                            <td>
                                <SelectList2 data={this.state.data2} />
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <input type="submit" value="Insert Patient Order" />
            </form>
        );
    }
});
//patient  id select  dropdown
var SelectList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patientIDSelects) {
            return (
                <option
                    key={patientIDSelects.patientID}
                    value={patientIDSelects.patientID}
                >
                    {patientIDSelects.patientID}
                </option>
            );
        });
        return (
            <select name="patientIDSelect" id="patientIDSelect">
                {optionNodes}
            </select>
        );
    }
});
//select list for patient order details
var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (detailIDSelects) {
            return (
                <option
                    key={detailIDSelects.orderDetailID}
                    value={detailIDSelects.orderDetailID}
                >
                    {detailIDSelects.orderDetailID}
                </option>
            );
        });
        return (
            <select name="detailIDSelect" id="detailIDSelect">
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
    <PatientOrderBox />,
    document.getElementById('content')
);

