//adapted from updateorderdetail
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
    loadOrderDetailsFromServer: function () {

        $.ajax({
            url: '/getorderdetailsupdate',
            data: {
                'orderdetailid': orderdetailid.value, 
                'orderdetailorderid': patorderid.value, //linked/selectlist//patientOrder table      
                'orderdetailproductid': productID.value, //linked/selectlist//productTable table   
                'orderdetailquantity': orderdetailquantity.value,   
                'orderdetailtotal': orderdetailtotal.value,
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
    updateSingleOrderDetailFromServer: function (orderdetail) {
        
        $.ajax({
            url: '/updatesingleorderdetail',
            dataType: 'json',
            data: orderdetail,
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
            this.loadOrderDetailsFromServer();
            this.updateSingleOrderDetailFromServer();
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
                <h1>Update Order Details</h1>
                <OrderDetailform2 onOrderDetailSubmit={this.loadOrderDetailsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Order Detail Key ||</th>
                                <th>Order Detail ID ||</th>
                                <th>Patient Orders ID ||</th>
                                <th>Product ID ||</th>
                                <th>Order Detail Quantity ||</th>
                                <th>Order Detail Total ||</th>
                                <th></th>
                            </tr>
                         </thead>
                        <OrderDetailList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <OrderDetailUpdateform onUpdateSubmit={this.updateSingleOrderDetailFromServer} />
                    </div>                
                </div>
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
    handleOptionChange: function (e) {
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
        e.preventDefault();

        var orderdetailid = this.state.orderdetailid.trim();
        var orderdetailorderid = patorderid.value;
        var orderdetailproductid = productID.value;
        var orderdetailtotal = this.state.orderdetailtotal.trim();
        var orderdetailquantity = this.state.orderdetailquantity.trim();
        

        this.props.onOrderDetailSubmit({ 
            orderdetailid: orderdetailid, 
            orderdetailorderid: orderdetailorderid,
            orderdetailproductid: orderdetailproductid,
            orderdetailquantity: orderdetailquantity,
            orderdetailtotal: orderdetailtotal,
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
                            <th>Product ID</th>
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
                <input type="submit" value="Search OrderDetail" />
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
var OrderDetailUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uporderdetailkey: "",
            uporderdetailid: "",
            updata1: [], //this is pOrderID
            updata2: [], //productID
            uporderdetailquantity: "",
            uporderdetailtotal: "",
            

        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadProductID: function() {
        $.ajax({
            url: '/getproductIDs',
            dataType: 'json',
            cache: false,
            success: function(data2) {
                this.setState({ updata2:data2 });
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
                this.setState({ updata1:data1 });
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

    handleUpSubmit: function (e) {
        e.preventDefault();
        var uporderdetailkey = upappkey.value;
        var uporderdetailid = upodetailid.value;
        var upporderid = uppatorderid.value; //porder id patientORder table
        var upprodid = upproductID.value; //productid productTable
        var uporderdetailtotal = upodetailtotal.value;
        var uporderdetailquantity = upodetailqty.value;

        this.props.onUpdateSubmit({
            uporderdetailkey: uporderdetailkey,
            uporderdetailid: uporderdetailid,
            upporderid: upporderid,
            upprodid: upprodid,
            uporderdetailtotal: uporderdetailtotal,
            uporderdetailquantity: uporderdetailquantity
            
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
        <th>Order Detail ID</th>
        <td>
<input type="text" name="upodetailid" id="upodetailid" value={this.state.upodetailid} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Order ID
        </th>
        <td>
            <SelectUpdateList1 data={this.state.updata1} /> 
        </td>
    </tr>
    <tr>
        <th>
            Product ID
        </th>
        <td>
            <SelectUpdateList2 data={this.state.updata2} /> 
        </td>
    </tr>
    <tr>
        <th>Order Detail Quantity</th>
        <td>
<input type="text" name="upodetailqty" id="upodetailqty" value={this.state.upodetailqty} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Order Detail Total</th>
        <td>
<input type="text" name="upodetailtotal" id="upodetailtotal" value={this.state.upodetailtotal} onChange={this.handleUpChange} />
        </td>
    </tr>
   
</tbody>
                        </table><br />
                        <input type="hidden" name="upappkey" id="upappkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Order Detail" />
                    </form>
                </div>
            </div>
        );
    }
});

var OrderDetailList = React.createClass({
    render: function () {
        var orderdetailNodes = this.props.data.map(function (orderdetail) {
            return (
                <OrderDetail
                    key={orderdetail.orderDetailKey}
                    appkey={orderdetail.orderDetailKey}
                    odetailid={orderdetail.orderDetailID}
                    porderid={orderdetail.pOrdersID}
                    oproductid={orderdetail.productsID}
                    odetailqty={orderdetail.orderDetailQuantity}
                    odetailtotal={orderdetail.orderDetailTotal}
                >
                </OrderDetail>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {orderdetailNodes}
            </tbody>
        );
    }
});

var OrderDetail = React.createClass({
    getInitialState: function () {
        return {
            upappkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupappkey = this.props.appkey;
        
        this.loadSingleApp(theupappkey);
    },
    loadSingleApp: function (theupappkey) {
        $.ajax({
            url: '/getsingleodetails',
            data: {
                'upappkey': theupappkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (orderdetail) {
                    upappkey.value = theupappkey;
                    upodetailid.value = orderdetail.orderDetailID;
                    uppatorderid.value = orderdetail.pOrdersID;
                    upproductID.value = orderdetail.productsID;
                    upodetailqty.value = orderdetail.orderDetailQuantity;
                    upodetailtotal.value = orderdetail.orderDetailTotal;
                    

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
                                {this.props.appkey} 
                            </td>
                            <td>
                                {this.props.odetailid}
                            </td>
                            <td>
                                {this.props.porderid}
                            </td>
                            <td>
                                {this.props.oproductid}
                            </td>
                            <td>
                                {this.props.odetailqty}
                            </td>
                            <td>
                                {this.props.odetailtotal}
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
//linking table for patient order
var SelectList1 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (patorderids) {
            return (
                <option
                    key = {patorderids.pOrderKey}
                    value= {patorderids.pOrderKey}
                >
                    {patorderids.pOrderKey}        
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
//update select list linked to above ^^^^
var SelectUpdateList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (patorderids) {
            return (
                <option
                    key={patorderids.pOrderKey}
                    value={patorderids.pOrderKey}
                >
                    {patorderids.pOrderKey}
                </option>
            );
        });
        return (
            <select name="uppatorderid" id="uppatorderid">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//linking table for products id 
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (productIDs) {
            return (
                <option
                    key = {productIDs.productID}
                    value= {productIDs.productID}
                >
                    {productIDs.productName}        
                </option>
            );
        });
        return (
            <select name = "productID" id = "productID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList2 = React.createClass({
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
    <OrderDetailBox />,
    document.getElementById('content')
);