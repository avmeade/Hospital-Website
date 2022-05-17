var ProductBox = React.createClass({
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
            url: '/getprod',
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
    componentDidMount: function () {
        this.loadAllowLogin();
        if (this.state.viewthepage != 0) {
            this.loadProductsFromServer();
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
                <h1>Search Product</h1>
                <Productform2 onProductSubmit={this.loadProductsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Product Price</th>
                                
                            </tr>
                         </thead>
                        <ProductList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
}
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
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
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            
            return (
                <Product
                    key={product.productKey}
                    prodkey={product.productKey}
                    prodid={product.productID}
                    prodname={product.productName}
                    prodprice={product.productPrice}
                    
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

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.prodkey} 
                            </td>
                            <td>
                                {this.props.prodid}
                            </td>
                            <td>
                                {this.props.prodname}
                            </td>
                            <td>
                                {this.props.prodprice}
                            </td>
                </tr>
        );
    }
});
ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);