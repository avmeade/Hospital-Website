var ShowNav = React.createClass({
    render: function () {
        return (
            <div>
                    <ul class="navigationBarList">
                    <li><a href="home.html">Home</a></li>
                    <li><a href="aboutUs.html">About Us</a></li>
                    <li><a href="storePage.html">Store</a></li>
                    <li><a href="insertappointment.html">Create Appointment</a></li>
                    <li><a href="loginPortal.html">Login Portal</a></li>
                    <li><a href="https://www.google.com"><img src="/images/searchLogo.png" height="25px" width="25px"/></a></li>
                </ul>
                </div>
        );
    }
});

ReactDOM.render(
        <ShowNav />,
        document.getElementById('thenav')
);    
