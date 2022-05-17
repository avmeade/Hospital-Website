var ProductBox = React.createClass({
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
    loadProductsFromServer: function () {
       
        $.ajax({
            url: '/getpro',
            data: {
                'productid': productid.value,
                'productname': productname.value,
                'productprice': productprice.value,
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
    updateSingleProFromServer: function (product) {
        
        $.ajax({
            url: '/updatesinglepro',
            dataType: 'json',
            data: product,
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
        if (this.state.viewthepage = 1){
            this.loadProductsFromServer();
            this.updateSingleProFromServer();
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
                <h1>Update Product</h1>
                <Productform2 onProductSubmit={this.loadProductsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Key </th>
                                <th>ID </th>
                                <th>Name </th>
                                <th>Price </th>
                                <th></th>
                            </tr>
                         </thead>
                        <ProductList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ProductUpdateform onUpdateSubmit={this.updateSingleProFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            productkey: "",
            productid: "",
            productname: "",
            productprice: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    componentDidMount: function() {
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var productid = this.state.productid.trim();
        var productname = this.state.productname.trim();
        var productprice = this.state.productprice.trim();
        

        this.props.onProductSubmit({ 
            productid: productid,
            productname: productname,
            productprice: productprice,
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
                            <th>Product ID</th>
                            <td>
                                <input type="text" name="productid" id="productid" value={this.state.productid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input name="productname" id="productname" value={this.state.productname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input name="productprice" id="productprice" value={this.state.productprice} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Product" />

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

var ProductUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upproductkey: "",
            upproductid: "",
            upproductname: "",
            upproductprice: "",
        };
    },
    
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    componentDidMount: function () {
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upproductkey = upprokey.value;
        var upproductid = upproid.value;
        var upproductname = upproname.value;
        var upproductprice = upproprice.value;


        this.props.onUpdateSubmit({
            upproductkey: upproductkey,
            upproductid: upproductid,
            upproductname: upproductname,
            upproductprice: upproductprice,
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
        <th>Product ID</th>
        <td>
<input type="text" name="upproid" id="upproid" value={this.state.upproid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Name</th>
        <td>
<input name="upproname" id="upproname" value={this.state.upproname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Product Price</th>
        <td>
<input name="upproprice" id="upproprice" value={this.state.upproprice} onChange={this.handleUpChange} />
        </td>
    </tr>
</tbody>
                        </table><br />
                        <input type="hidden" name="upprokey" id="upprokey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Product" />
                    </form>
                </div>
            </div>
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            return (
                <Product
                    key={product.productKey}
                    prokey={product.productKey}
                    proid={product.productID}
                    proname={product.productName}
                    proprice={product.productPrice}
                >
                </Product>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {productNodes}
            </tbody>
        );
    }
});

var Product = React.createClass({
    getInitialState: function () {
        return {
            upprokey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupprokey = this.props.prokey;
        
        this.loadSingleEmp(theupprokey);
    },
    loadSingleEmp: function (theupprokey) {
        $.ajax({
            url: '/getsinglepro',
            data: {
                'upprokey': theupprokey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (product) {
                    upprokey.value = theupprokey;
                    upproid.value = product.productID;
                    upproname.value = product.productName;
                    upproprice.value = product.productPrice;

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
                                {this.props.prokey} 
                            </td>
                            <td>
                                {this.props.proid}
                            </td>
                            <td>
                                {this.props.proname}
                            </td>
                            <td>
                                {this.props.proprice}
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

ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);