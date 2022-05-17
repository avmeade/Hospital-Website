var PatientOrderBox = React.createClass({
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
    loadPatientOrdersFromServer: function () {

        $.ajax({
            url: '/getpatientorder',
            data: {
                'patientorderid': patientorderid.value,
                'patientorderdate': patientorderdate.value,  
                'patientordertime': patientordertime.value,           
                'patientname': patientname.value, 
                'patientid': patID.value, //linked patient table
                'orderdetailsid': oDetail.value //linked order details table
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.log(data);
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleOrderFromServer: function (patientorder) {
        
        $.ajax({
            url: '/updatesinglePatientOrder',
            dataType: 'json',
            data: patientorder,
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
            this.loadPatientOrdersFromServer();
            this.updateSingleOrderFromServer();
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
                <h1>Update Patient Order</h1>
                <PatientOrderform2 onPatientOrderSubmit={this.loadPatientOrdersFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Order Key</th>
                                <th>Order ID </th>
                                <th>Order Date </th>
                                <th>Order Time </th>
                                <th>Order Name </th>
                                <th>Patient ID </th>
                                <th>Order Detail ID </th>
                                <th></th>
                            </tr>
                         </thead>
                        <PatientOrderList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <PatientOrderUpdateform onUpdateSubmit={this.updateSingleOrderFromServer} />
                    </div>                
                </div>
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
            data1: [], //patient id
            data2: [], //patientorder details id   
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    //for select list, pulls from server js to grab the correct table the data is situated in
    loadPatID: function () {
        $.ajax({
            url: '/getpatientid',
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
    loadOrderDetail: function () {
        $.ajax({
            url: '/getorderdetailid',
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
        this.loadPatID();
        this.loadOrderDetail();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var patientorderid = this.state.patientorderid.trim();
        var patientorderdate = this.state.patientorderdate.trim();
        var patientordertime = this.state.patientordertime.trim();
        var patientname = this.state.patientname.trim();
        var patientid =  patID.value;
        var patientorderdetailid = oDetail.value;

        this.props.onPatientOrderSubmit({ 
            patientorderid: patientorderid,
            patientorderdate: patientorderdate,
            patientordertime: patientordertime,
            patientname: patientname,
            patientid: patientid, 
            patientorderdetailid: patientorderdetailid
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
                            <th>Patient Order ID</th>
                            <td>
                                <input type="text" name="patientorderid" id="patientorderid" value={this.state.patientorderid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Date</th>
                            <td>
                                <input type="date" name="patientorderdate" id="patientorderdate" value={this.state.patientorderdate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Time</th>
                            <td>
                                <input type="time" name="patientordertime" id="patientordertime" value={this.state.patientordertime} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Name</th>
                            <td>
                                <input type="text" name="patientname" id="patientname" value={this.state.patientname} onChange={this.handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <th>Patient ID</th>
                            <td><SelectList1 data = {this.state.data1} /></td>
                        </tr>
                        <tr>
                            <th>Order Detail ID</th>
                            <td><SelectList2 data = {this.state.data2} /></td>
                        </tr>
                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Order Details" />
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

var PatientOrderUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uppatientorderkey: "",
            uppatientorderid: "",
            uppatientorderdate: "",
            uppatientordertime: "",
            uppatientordername: "",
            updata1: [], //patient id
            updata2: [], //order details id

        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    //grabs table from server js function //select list
    loadPatID: function () {
        $.ajax({
            url: '/getpatientid',
            dataType: 'json',
            cache: false,
            success: function (updata1) {
                this.setState({ updata1: updata1 });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadOrderDetail: function () {
        $.ajax({
            url: '/getorderdetailid',
            dataType: 'json',
            cache: false,
            success: function (updata2) {
                this.setState({ updata2: updata2});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadPatID();
        this.loadOrderDetail();
    },
    handleUpSubmit: function (e) {
        e.preventDefault();
        var uppatientorderkey = upappdetailkey.value;
        var uppatientorderid = upappID.value;
        var uppatientorderdate =  uppatientdate.value;
        var uppatientordertime = uppatienttime.value;
        var uppatientordername = uppatientname.value;
        var uppatientid = upopatient.value; //select 1
        var uporderdetailsid = upodetailsid.value; //select 2

        this.props.onUpdateSubmit({ 
            uppatientorderkey: uppatientorderkey,
            uppatientorderid: uppatientorderid,
            uppatientorderdate: uppatientorderdate,
            uppatientordertime: uppatientordertime,
            uppatientordername: uppatientordername,
            uppatientid: uppatientid, 
            uporderdetailsid: uporderdetailsid
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
        <th>Patient Order ID</th>
        <td>
<input type="text" name="upappID" id="upappID" value={this.state.upappID} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Order Date</th>
        <td>
<input type="date" name="uppatientdate" id="uppatientdate" value={this.state.uppatientdate} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Order Time</th>
        <td>
<input type="time" name="uppatienttime" id="uppatienttime" value={this.state.uppatienttime} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>Patient Order Name</th>
        <td>
<input type="text" name="uppatientname" id="uppatientname" value={this.state.uppatientname} onChange={this.handleUpChange} />
        </td>
    </tr>
    <tr>
        <th>
            Patient ID
        </th>
        <td>
            <SelectUpdateList1 data={this.state.updata1} /> 
        </td>
    </tr>
    <tr>
        <th>
            Order Detail ID
        </th>
        <td>
            <SelectUpdateList2 data={this.state.updata2} /> 
        </td>
    </tr>
    
</tbody>
                        </table><br />
                        <input type="hidden" name="upappdetailkey" id="upappdetailkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Order Detail" />
                    </form>
                </div>
            </div>
        );
    }
});

var PatientOrderList = React.createClass({
    render: function () {
        var patientNodes = this.props.data.map(function (patientorder) {
            return (
                <PatientOrder
                    key={patientorder.pOrderKey}
                    appdetailkey={patientorder.pOrderKey}
                    patientorderid={patientorder.pOrderID}
                    patientorderdate={patientorder.pOrderDate}
                    patientordertime={patientorder.pOrderTime}
                    patientname={patientorder.patientName}
                    patientid={patientorder.patientsID}
                    orderdetailsid={patientorder.orderDetailsID}
                    

                >
                </PatientOrder>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {patientNodes}
            </tbody>
        );
    }
});

var PatientOrder = React.createClass({
    getInitialState: function () {
        return {
            upappdetailkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupappdetailkey = this.props.appdetailkey;
        
        this.loadSingleApp(theupappdetailkey);
    },
    loadSingleApp: function (theupappdetailkey) {
        $.ajax({
            url: '/getsingleorderdetail',
            data: {
                'upappdetailkey': theupappdetailkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateEmp = this.state.singledata.map(function (patientorder) {
                    upappdetailkey.value = theupappdetailkey;

                    upappID.value = patientorder.pOrderID;
                    uppatientdate.value = patientorder.pOrderDate;
                    uppatienttime.value = patientorder.pOrderTime;
                    uppatientname.value = patientorder.patientName;
                    upopatient.value = patientorder.patientID;
                    upodetailsid.value = patientorder.orderDetailsID;
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
                                {this.props.appdetailkey} 
                            </td>
                            <td>
                                {this.props.patientorderid}
                            </td>
                            <td>
                                {this.props.patientorderdate}
                            </td>
                            <td>
                                {this.props.patientordertime}
                            </td>
                            <td>
                                {this.props.patientname}
                            </td>
                            <td>
                                {this.props.patientid}
                            </td>
                            <td>
                                {this.props.orderdetailsid}
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
//linking table
var SelectList1 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (patIDs) {
            return (
                <option
                    key = {patIDs.patientID}
                    value= {patIDs.patientID}
                >
                    {patIDs.pFirstName}        
                </option>
            );
        });
        return (
            <select name = "patID" id = "patID">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//update select list linked to above ^^^^
var SelectUpdateList1 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (opatients) {
            return (
                <option
                    key={opatients.patientID}
                    value={opatients.patientID}
                >
                    {opatients.pLastName}
                </option>
            );
        });
        return (
            <select name="upopatient" id="upopatient">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});
//linking table
var SelectList2 = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (oDetails) {
            return (
                <option
                    key = {oDetails.orderDetailID}
                    value= {oDetails.orderDetailID}
                >
                    {oDetails.orderDetailID}        
                </option>
            );
        });
        return (
            <select name = "oDetail" id = "oDetail">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});


//update select list linked to above ^^^^
var SelectUpdateList2 = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (odetailsids) {
            return (
                <option
                    key={odetailsids.orderDetailID}
                    value={odetailsids.orderDetailID}
                >
                    {odetailsids.orderDetailID}
                </option>
            );
        });
        return (
            <select name="uoodetailsid" id="upodetailsid">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PatientOrderBox />,
    document.getElementById('content')
);