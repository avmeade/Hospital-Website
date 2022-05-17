var ProductInventoryBox = React.createClass({
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
    loadProductInventorysFromServer: function () {

        $.ajax({
            url: '/getproductinventory',
            data: {
                'productinvid': productinvid.value,
                'productid': prodID.value,
                'prodinvquantity': prodinvquantity.value
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
    updateSingleEmpFromServer: function (productinventory) {
        
        $.ajax({
            url: '/updatesingleproinv',
            dataType: 'json',
            data: productinventory,
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
            this.loadProductInventorysFromServer();
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
                <h1>Update Product Inventory</h1>
                <ProductInventoryform2 onProductInventorySubmit={this.loadProductInventorysFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th></th>
                            </tr>
                         </thead>
                        <ProductInventoryList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ProductInventoryUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var ProductInventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            
            productinvid: "",
            data: [],
            prodinvquantity: "",
            
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadProductIDs: function () {
        $.ajax({
            url: '/getproductIDs',
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
    componentDidMount: function() {
        this.loadProductIDs();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var productinvid = this.state.productinvid.trim();
        var productid =  prodID.value; 
        var prodinvquantity = this.state.prodinvquantity.trim();

        this.props.onProductInventorySubmit({ 
            productinvid: productinvid,
            productid: productid,
            prodinvquantity: prodinvquantity
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
                            <th>Product Inventory ID</th>
                            <td>
                                <input type="text" name="productinvid" id="productinvid" value={this.state.productinvid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Product ID</th>
                            <td><SelectList data = {this.state.data} /></td>
                        </tr>
                        <tr>
                            <th>Product Inventory Quantity</th>
                            <td>
                                <input name="prodinvquantity" id="prodinvquantity" value={this.state.prodinvquantity} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Product Inventory" />

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

var ProductInventoryUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upproductinvkey: "",
            upprodinvid: "",
            updata: [],
            upproductinvquantity: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadProductIDs: function () {
        $.ajax({
            url: '/getproductIDs',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ updata: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadProductIDs();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upproductinvkey = upempkey.value;
        var upprodinvid = upproductinvid.value;
        var uptheproductid = upproductID.value;
        var upproductinvquantity = upproductqty.value;
        

        this.props.onUpdateSubmit({
            upproductinvkey: upproductinvkey,
            upprodinvid: upprodinvid,
            uptheproductid: uptheproductid,
            upproductinvquantity: upproductinvquantity,
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
        <th>Product Inventory ID</th>
        <td>
<input type="text" name="upproductinvid" id="upproductinvid" value={this.state.upproductinvid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Product ID
        </th>
        <td>
            <SelectUpdateList data={this.state.updata} />
        </td>
    </tr>
    <tr>
        <th>Product Inventory Quantity</th>
        <td>
<input name="upproductqty" id="upproductqty" value={this.state.upproductqty} onChange={this.handleUpChange} />
        </td>
    </tr>
    
</tbody>
                        </table><br />
                        <input type="hidden" name="upempkey" id="upempkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Inventory" />
                    </form>
                </div>
            </div>
        );
    }
});

var ProductInventoryList = React.createClass({
    render: function () {
        var productinventoryNodes = this.props.data.map(function (productinventory) {
            return (
                <ProductInventory
                    key={productinventory.productInventoryKey}
                    empkey={productinventory.productInventoryKey}
                    productinvid={productinventory.productInventoryID}
                    oproductid={productinventory.productsID}
                    prodinvquantity={productinventory.productQuantity}
                >
                </ProductInventory>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {productinventoryNodes}
            </tbody>
        );
    }
});

var ProductInventory = React.createClass({
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
            url: '/getsingleprodinv',
            data: {
                'upempkey': theupempkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (productinventory) {
                    upempkey.value = theupempkey;
                    upproductinvid.value = productinventory.productInventoryID;
                    upproductID.value = productinventory.productsID;
                    upproductqty.value = productinventory.productQuantity;
                    

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
                                {this.props.productinvid}
                            </td>
                            <td>
                                {this.props.oproductid}
                            </td>
                            <td>
                                {this.props.prodinvquantity}
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

var SelectList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (prodIDs) {
            return (
                <option
                    key = {prodIDs.productID}
                    value= {prodIDs.productID}
                >
                    {prodIDs.productName}        
                </option>
            );
        });
        return (
            <select name = "prodID" id = "prodID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
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
            <select name="upproductID" id="upproductID">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <ProductInventoryBox />,
    document.getElementById('content')
);