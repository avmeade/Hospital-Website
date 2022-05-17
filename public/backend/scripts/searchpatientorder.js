var PatientOrderBox = React.createClass({
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
    loadPatientOrderFromServer: function () {
       
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
            this.loadPatientOrderFromServer();
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
                <h1>Search Patient Order</h1>
                <PatientOrderform2 onPatientOrderSubmit={this.loadPatientOrderFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Patient Order Key </th>
                                <th>Patient Order Name </th>
                                <th>Patient Order Date </th>
                                <th>Patient Order Time </th>
                                <th>Order Pickup Name </th>
                                <th>Patient ID </th>
                                <th>Patient Order Detail ID </th>

                                
                            </tr>
                         </thead>
                        <PatientOrderList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
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
    componentDidMount: function() {
        this.loadPatientID();
        this.loadOrderDetailID();
        
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
                            <th>Patient Order Date</th>
                            <td>
                                <input type="date" name="patientorderdate" id="patientorderdate" value={this.state.patientorderdate} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Order Time</th>
                            <td>
                                <input type="time" name="patientordertime" id="patientordertime" value={this.state.patientordertime} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Pickup Name</th>
                            <td>
                                <input type="text" name="patientname" id="patientname" value={this.state.patientname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Name</th>
                            <td><SelectList1 data = {this.state.data1} /></td>
                        </tr>
                        
                        <tr>
                            <th>Patient Order Detail ID</th>
                            <td><SelectList2 data = {this.state.data2} /></td>
                        </tr>

                    </tbody>
                </table>
                <p>Click me to populate data table!</p>
                <input type="submit" value="Search Patient Order" />

            </form>
            </div>
        );
    }
});

var PatientOrderList = React.createClass({
    render: function () {
        var patientorderdetailsNodes = this.props.data.map(function (patientorder) {
            
            return (
                <PatientOrder
                    key={patientorder.pOrderKey}
                    patientorderkey={patientorder.pOrderKey}
                    patientorderid={patientorder.patientName}
                    patientorderdate={patientorder.pOrderDate}
                    patientordertime={patientorder.pOrderTime} 
                    patientname={patientorder.patientName}
                    patientid={patientorder.patientID} 
                    patientorderdetailsid={patientorder.orderDetailsID}
                >
                </PatientOrder>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {patientorderdetailsNodes}
            </tbody>
        );
    }
});



var PatientOrder = React.createClass({

    render: function () {
        return (

            <tr>
                            
                            <td>
                                {this.props.patientorderkey} 
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
                                {this.props.patientorderdetailsid}
                            </td>
                </tr>
        );
    }
});

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

ReactDOM.render(
    <PatientOrderBox />,
    document.getElementById('content')
);