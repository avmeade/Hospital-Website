var ShowNav = React.createClass({
    render: function () {
        return (
            <div class="boxfordisplay">
                <ul class="navigationBarList">
                    
                    <li><a href="employee.html">Employee</a></li>
                    <li><a href="patient.html">Patient</a></li>
                    <li><a href="patientorder.html">Order</a></li>
                    <li><a href="orderdetail.html">Order Details</a></li>
                    <li><a href="appointment.html">Appointment</a></li>
                    <li><a href="appointmentdetail.html">Appointment Detail</a></li>
                    <li><a href="product.html">Product</a></li>
                    <li><a href="productinventory.html">Product Inventory</a></li>
                </ul>







            </div>
        );
    }
});

ReactDOM.render(
        <ShowNav />,
        document.getElementById('thenav')

        );    
