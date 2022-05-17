var OrderDetailBox = React.createClass({
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
    handleOrderDetailSubmit: function (orderdetail) {

        $.ajax({
            url: '/orderdetail',
            dataType: 'json',
            type: 'POST',
            data: orderdetail,
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
            this.handleOrderDetailSubmit();
        }
        
    },
    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>PLEASE GO BACK : RESTRICTED AREA</div> 
            );
        } else
        return (
            <div className="OrderDetailBox">
                <h1>Insert Order Detail</h1>
                <OrderDetailform2 onOrderDetailSubmit={this.handleOrderDetailSubmit} />
            </div>
        );
    }
});

var OrderDetailform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdetailid: "",
            data1: [], //this is pOrderID
            data2: [], //productID
            orderdetailquantity: "",
            orderdetailtotal: "",
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    
    loadProductID: function() {
        $.ajax({
            url: '/getproductIDs',
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
    loadPatientOrderID: function() {
        $.ajax({
            url: '/getpatientorderid',
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
    componentDidMount: function () {
        this.loadProductID();
        this.loadPatientOrderID();
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var orderdetailid = this.state.orderdetailid.trim();
        var porderid = porderID.value;
        var productid = productPID.value;
        var orderdetailquantity = this.state.orderdetailquantity.trim();
        var orderdetailtotal = this.state.orderdetailtotal.trim();

        this.props.onOrderDetailSubmit({ 
            orderdetailid: orderdetailid, 
            orderdetailquantity: orderdetailquantity,
            orderdetailtotal: orderdetailtotal,
            productid: productid,
            porderid: porderid


            
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
                            <th>Order Detail ID</th>
                            <td>
                                <TextInput
                                    value={this.state.orderdetailid}
                                    uniqueName="orderdetailid"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'orderdetailid')}
                                    errorMessage="OrderDetail ID is invalid"
                                    emptyMessage="OrderDetail ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Order ID
                            </th>
                            <td>
                                <SelectList1 data={this.state.data1} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Product ID
                            </th>
                            <td>
                                <SelectList2 data={this.state.data2} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Detail Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.orderdetailquantity}
                                    uniqueName="orderdetailquantity"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'orderdetailquantity')}
                                    errorMessage="Order quantity is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Total</th>
                            <td>
                                <TextInput
                                    value={this.state.orderdetailtotal}
                                    uniqueName="orderdetailtotal"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'orderdetailtotal')}
                                    errorMessage="Order Total is invalid" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert OrderDetail" />
            </form>
        );
    }
});
//patient order id
var SelectList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (porderIDs) {
            return (
                <option
                    key={porderIDs.pOrderID}
                    value={porderIDs.pOrderID}
                >
                    {porderIDs.pOrderID}
                </option>
            );
        });
        return (
            <select name="porderID" id="porderID">
                {optionNodes}
            </select>
        );
    }
});
//productID
var SelectList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (productIDs) {
            return (
                <option
                    key={productIDs.productID}
                    value={productIDs.productID}
                >
                    {productIDs.productName}
                </option>
            );
        });
        return (
            <select name="productPID" id="productPID">
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
    <OrderDetailBox />,
    document.getElementById('content')
);

