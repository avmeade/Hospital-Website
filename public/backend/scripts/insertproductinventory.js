var ProductInventoryBox = React.createClass({
    getInitialState: function () {////////////////
        return { data: [],////////////////
        viewthepage: 0};///////////////
    },
    //login to insert 
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
    handleProductInventorySubmit: function (productinventory) {

        $.ajax({
            url: '/productinventory',
            dataType: 'json',
            type: 'POST',
            data: productinventory,
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
            this.handleProductInventorySubmit();/////////////////////
        }
        
    },
    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (////////////////////////
                <div>PLEASE GO BACK : RESTRICTED AREA</div> //////////////////////////
            );///////////////////////
        } else
        return (
            <div className="ProductInventoryBox">
                <h1></h1>
                <ProductInventoryform2 onProductInventorySubmit={this.handleProductInventorySubmit} />
            </div>
        );
    }
});

var ProductInventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            productinventoryid: "",
            data: [],
            productinventoryquantity: "",
        };
    },
    handleOptionChange: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadProductTypes: function() {
        $.ajax({
            url: '/getproducttypes',
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
        this.loadProductTypes();
    },

    handleSubmit: function (e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var productinventoryid = this.state.productinventoryid.trim();
        var productid = proName.value;
        var productinventoryquantity = this.state.productinventoryquantity.trim();
        
        

        if (isNaN(productinventoryquantity)) {
            console.log("This must be a number");
            return;
        }

        

        this.props.onProductInventorySubmit({ 
            productinventoryid: productinventoryid, 
            productid: productid, 
            productinventoryquantity: productinventoryquantity
            
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
                <h2>Inventory Insert</h2>
                <table class="insertionTable">
                    <tbody>
                        <tr>
                            <th>Inventory ID</th>
                            <td>
                                <TextInput
                                    value={this.state.productinventoryid}
                                    uniqueName="productinventoryid"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'productinventoryid')}
                                    errorMessage="ProductInventory ID is invalid"
                                    emptyMessage="ProductInventory ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Product ID
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.productinventoryquantity}
                                    uniqueName="productinventoryquantity"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'productinventoryquantity')}
                                    errorMessage="Product Inventory Quantity is invalid" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Inventory" />
            </form>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (proNames) {
            return (
                <option
                    key={proNames.productID}
                    value={proNames.productID}
                >
                    {proNames.productName}
                </option>
            );
        });
        return (
            <select name="proName" id="proName">
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
    <ProductInventoryBox />,
    document.getElementById('content')
);

