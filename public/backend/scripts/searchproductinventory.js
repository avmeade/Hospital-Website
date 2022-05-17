var ProductInventoryBox = React.createClass({
    getInitialState: function () {
        return { data: [],//turn 1 to a 0 to turn back on tokenization
                 viewthepage: 0};
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (datalog) {
                this.setState({ data: datalog });
                this.setState({ viewthepage: this.state.data[0].employeetype }); //this will need to be changed for tokenization
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
                'productid': prodID.value, //linked table            
                'prodinvquantity': prodinvquantity.value,
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
            this.loadProductInventorysFromServer();
        }
       
    },

    render: function () {
        if (this.state.viewthepage == 0 || this.state.viewthepage != 1) {
            return (
                <div>NO ACCESS</div>
            );
        } else {
        return (
            <div>
                <h1>Search Product Inventory</h1>
                <ProductInventoryform2 onProductInventorySubmit={this.loadProductInventorysFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Inventory ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                
                            </tr>
                         </thead>
                        <ProductInventoryList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
}
});

var ProductInventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            productinvid: "",
            data: [], //productid name from linked table
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
        var productid =  prodID.value; //
        var prodinvquantity = this.state.prodinvquantity.trim();

        this.props.onProductInventorySubmit({ 
            productinvid: productinvid,
            productid: productid,
            prodinvquantity: prodinvquantity,
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
                            <th>Product Inventory ID</th>
                            <td>
                                <input type="text" name="productinvid" id="productinvid" value={this.state.productinvid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td><SelectList data = {this.state.data} /></td>
                        </tr>
                        <tr>
                            <th>Inventory Quantity</th>
                            <td>
                                <input name="prodinvquantity" id="prodinvquantity" value={this.state.prodinvquantity} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Product Inventory" />

            </form>
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
                    prodinvkey={productinventory.productInventoryKey}
                    productinvid={productinventory.productInventoryID} //product ID 
                    productid={productinventory.productsID}
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

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.prodinvkey} 
                            </td>
                            <td>
                                {this.props.productinvid}
                            </td>
                            <td>
                                {this.props.productid}
                            </td>
                            <td>
                                {this.props.prodinvquantity}
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

ReactDOM.render(
    <ProductInventoryBox />,
    document.getElementById('content')
);