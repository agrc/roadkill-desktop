<!DOCTYPE html>
<html>
    <head>
        <?php include "common_html/common.php"; ?>
        <link rel='stylesheet' type='text/css' href='css/index.css' />
    </head>
    <body>
        <?php include "common_html/header.php"; ?>

        <div class="container">
            <div class="panel panel-info">
                <div class="panel-heading"><h3 style="margin: 0;">Public Reporting</h3></div>
                <div class="panel-body">
                    <p style="font-size: large;">If you would like to report an animal carcass location for pick up, please use <a href="https://www.udot.utah.gov/connect/public/contact-udot/">UDOT Click'n Fix</a>.
                </div>
            </div>

            <div class="jumbotron">
                <h2>Utah Wildlife-Vehicle Collision Data Collector <small style="color: #333;">(For State Employees and Contractors)</small></h2>
                <div class="row">
                    <div class="col-md-4">
                        <img src='images/Buck.jpg' alt='buck' class='img-thumbnail pull-left'>
                    </div>
                    <div>
                        <p>The Utah Wildlife-Vehicle Collision (WVC) Data Collector is a smartphone-based system for reporting animals that have been involved in vehicle collisions. Using this website, animal carcass locations can be viewed on maps that display geographic, highway, and other background information.</p>
                        <p><a class="btn btn-primary btn-lg" href="map.php">View the map &raquo;</a></p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <h3>Who is collecting the data?</h3>
                    <p>Animal carcass locations are reported by Utah Department of Transportation contactors that that remove carcasses from ~1,200 miles of roads throughout the state. Utah Division of Wildlife Resources employees also report animal carcasses on many highways not covered by Utah Department of Transportation contractors.</p>
                </div>
                <div class="col-md-4">
                    <h3>What data is collected?</h3>
                    <p>Animal carcasses are reported by technicians in the field using smartphones and the &quot;Wildlife-Vehicle Collision Reporter Mobile App&quot;.</p>
                    <p><a class="btn btn-default" href="mobileapp.php">Learn more &raquo;</a></p>
                </div>
                <div class="col-md-4">
                    <h3>How is the data used?</h3>
                    <p>Animal carcass data is used in a variety of ways to make highways safer for drivers and wildlife.</p>
                </div>
            </div>
            <div class="row">
                <div class="message col-md-8">
                    <div class='padding'>
                        <p>Some pages on this website require a user name and password.</p>
                        <div class="alert-actions">
                            <button class="btn btn-default"
                                onclick="
                                    var login = require('app/config').login;
                                    login.show();
                                    login.goToPane(login.requestPane);">Request access</button>
                        </div>
                    </div>
                </div>
                <div class="message col-md-4">
                    <div class='padding'>
                        <p>Website Version: <span id='version'></span></p>
                        <div class="alert-actions">
                            <a class="btn btn-default" href="release_notes.php">Release Notes &raquo;</a>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <?php include 'common_html/footer.php'; ?>
            </footer>
        </div> <!-- /container -->
    </body>
</html>
