var OrderDetailsBox = React.createClass({
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
    loadOrderDetailsFromServer: function () {
       
        $.ajax({
            url: '/getorderdetails',
            data: {
                'orderdetailid': orderdetailid.value,
                'orderdetailorderid': patorderid.value, //linked patient order table
                'orderdetailproductid': productname.value, //linked product table             
                'orderdetailquantity':orderdetailquantity.value,
                'orderdetailtotal':orderdetailtotal.value
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
            this.loadOrderDetailsFromServer();
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
                <h1>Search Order Details</h1>
                <OrderDetailsform2 onOrderDetailSubmit={this.loadOrderDetailsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Order Detail Key</th>
                                <th>Order Detail ID</th>
                                <th>Patient Order ID</th>
                                <th>Product Name</th> 
                                <th>Order Quantity</th>
                                <th>Order Total</th>


                                
                            </tr>
                         </thead>
                        <OrderDetailsList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
}
});

var OrderDetailsform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdetailid: "",
            data1: [], //patientorder id 
            data2: [], //product id/name 
            orderdetailquantity: "",
            orderdetailtotal: "",
            
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    //we need to patient order, product id
    loadAppDetailID: function () {
        $.ajax({
            url: '/getpatientorderid',
            dataType: 'json',
            cache: false,
            success: function (data1) {
                this.setState({ data1: data1 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadProductName: function () {
        $.ajax({
            url: '/getproducttypes',
            dataType: 'json',
            cache: false,
            success: function (data2) {
                this.setState({ data2: data2});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadAppDetailID();
        this.loadProductName();
        
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var orderdetailid = this.state.orderdetailid.trim();
        var orderdetailorderid =  patorderid.value; //linked patient order table
        var orderdetailproductid = productname.value; //linked product table
        var orderdetailquantity = this.state.orderdetailquantity.trim();
        var orderdetailtotal = this.state.orderdetailtotal.trim();

        this.props.onOrderDetailSubmit({ 
            orderdetailid: orderdetailid,
            orderdetailorderid: orderdetailorderid,
            orderdetailproductid: orderdetailproductid,
            orderdetailquantity: orderdetailquantity,
            orderdetailtotal: orderdetailtotal
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
                            <th>Order Detail ID</th>
                            <td>
                                <input type="text" name="orderdetailid" id="orderdetailid" value={this.state.orderdetailid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Order ID</th>
                            <td><SelectList1 data = {this.state.data1} /></td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td><SelectList2 data = {this.state.data2} /></td>
                        </tr>
                        <tr>
                            <th>Order Detail Quantity</th>
                            <td>
                                <input type="text" name="orderdetailquantity" id="orderdetailquantity" value={this.state.orderdetailquantity} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Detail Total</th>
                            <td>
                                <input type="text" name="orderdetailtotal" id="orderdetailtotal" value={this.state.orderdetailtotal} onChange={this.handleChange} />
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Order Detail" />

            </form>
            </div>
        );
    }
});

var OrderDetailsList = React.createClass({
    render: function () {
        var orderdetailsNodes = this.props.data.map(function (orderdetail) {
            
            return (
                <OrderDetails
                    key={orderdetail.orderdetailKey}
                    orderdetailkey={orderdetail.orderDetailKey}
                    orderdetailid={orderdetail.orderDetailID}
                    orderdetailorderid={orderdetail.pOrdersID} //product ID 
                    orderdetailproductid={orderdetail.productsID}
                    orderdetailquantity={orderdetail.orderDetailQuantity}
                    orderdetailtotal={orderdetail.orderDetailTotal}

                >
                </OrderDetails>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {orderdetailsNodes}
            </tbody>
        );
    }
});



var OrderDetails = React.createClass({

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.orderdetailkey} 
                            </td>
                            <td>
                                {this.props.orderdetailid} 
                            </td>
                            <td>
                                {this.props.orderdetailorderid}
                            </td>
                            <td>
                                {this.props.orderdetailproductid}
                            </td>
                            <td>
                                {this.props.orderdetailquantity}
                            </td>
                            <td>
                                {this.props.orderdetailtotal}
                            </td>
                </tr>
        );
    }
});

var SelectList1 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (patorderids) {
            return (
                <option
                    key = {patorderids.pOrderID}
                    value= {patorderids.pOrderID}
                >
                    {patorderids.pOrderID}        
                </option>
            );
        });
        return (
            <select name = "patorderid" id = "patorderid">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (productnames) {
            return (
                <option
                    key = {productnames.productID}
                    value= {productnames.productID}
                >
                    {productnames.productID}        
                </option>
            );
        });
        return (
            <select name = "productname" id = "productname">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <OrderDetailsBox />,
    document.getElementById('content')
);