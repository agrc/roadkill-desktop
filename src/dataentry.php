<!DOCTYPE html>
<html>
    <head>
        <?php include "common_html/common.php"; ?>

        <!-- PAGE SPECIFIC STUFF -->
        <link rel="stylesheet" type="text/css" href="css/dataentry.css" />
        <link rel="stylesheet" type="text/css" href="esri/css/esri.css">

        <script type='text/javascript'>
            require(['dojo/domReady!'], function () {
                require(['app/dataentry']);
            });
        </script>
    </head>
    <body class='claro'>
        <div class="topbar">
            <?php include ("common_html/header.php");?>
        </div>
        <div class="container">
            <form>
                <fieldset class='row'>
                    <legend>
                        Submit Report
                    </legend>

                    <div class='col-md-4'>
                        <h4>Report Date</h4>
                        <div class='input'>
                            <input id='report-date' type='text' dojoType='dijit/form/DateTextBox'>
                        </div>

                        <h4>Species</h4>
                        <div class="input">
                            <select class='form-control' id='species-select'>
                                <option>select a species</option>
                            </select>
                            or
                            <input id='species-txt' class='form-control' type='text' placeholder='type in a new species'/>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <h4>Gender</h4>
                        <div class='radio'>
                            <label>
                                <input type="radio" name="gender-group" value="Male">
                                Male
                            </label>
                        </div>
                        <div class='radio'>
                            <label>
                                <input type="radio" name="gender-group" value="Female">
                                Female
                            </label>
                        </div>
                        <div class='radio'>
                            <label>
                                <input type='radio' name='gender-group' value="Unknown">
                                Unknown
                            </label>
                        </div>

                        <h4>Age Class</h4>
                        <div class='radio'>
                            <label>
                                <input type="radio" name="age-group" value="Juvenile">
                                Juvenile
                            </label>
                        </div>
                        <div class='radio'>
                            <label>
                                <input type="radio" name="age-group" value="Adult">
                                Adult
                            </label>
                        </div>
                        <div class='radio'>
                            <label>
                                <input type='radio' name='age-group' value="Unknown">
                                Unknown
                            </label>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <h4>Xyphoid (mm)</h4>
                        <div class="input">
                            <input id='xyphoid' type='number' class='form-control' disabled/>
                            <input type='checkbox' id='xyphoid_chbx' name='xyphoid_chbx' checked/>
                            <label id='checkbox_label' for='xyphoid_chbx'>Unavailable</label>
                        </div>

                        <h4>Collar/Tag #</h4>
                        <div class='input'>
                            <input id='collar_tag' class='form-control' type='text' placeholder='optional' />
                        </div>

                        <h4>Comments</h4>
                        <div class="input">
                            <textarea class="form-control" id="comments" maxlength='255' placeholder='optional'></textarea>
                            <span class="help-block">Limited to 255 characters.</span>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Define location by coordinates, route/milepost or street address</legend>

                    <ul class='nav nav-pills'>
                        <li class='active'><a href='#lat-lng-tab' data-toggle='tab'>Latitude/Longitude</a></li>
                        <li><a href='#utm-tab' data-toggle='tab'>UTM</a></li>
                        <li><a href='#route-milepost-tab' data-toggle='tab'>Route/Milepost</a></li>
                        <li><a href='#address-tab' data-toggle='tab'>Street Address</a></li>
                    </ul>

                    <div class='tab-content'>
                        <div id='lat-lng-tab' class='tab-pane active'>
                            <div class='form-group'>
                                <label>Latitude</label>
                                <input id='lat' type='number' min='36' max='43' placeholder="e.g. 40.2345" class='form-control'/>
                            </div>
                            <div class='form-group'>
                                <label>Longitude</label>
                                <input id='lng' type='number' min='-114' max='-109' placeholder="e.g. -111.2345" class='form-control'/>
                                <span class="help-block">WGS84</span>
                            </div>
                        </div>
                        <div id='utm-tab' class='tab-pane'>
                            <div class='form-group'>
                                <label>Easting</label>
                                <input id='easting' type='number' min='141232' max='766672' placeholder='e.g. 456740' class='form-control'/>
                            </div>
                            <div class='form-group'>
                                <label>Northing</label>
                                <input id='northing' type='number' min='4036869' max='4711483' placeholder='e.g. 4424863' class='form-control'/>
                                <span class="help-block">Zone 12 NAD83</span>
                            </div>
                        </div>
                        <div id='route-milepost-tab' class='tab-pane'>
                            <div class='form-group'>
                                <label>Route</label>
                                <input id='route' type='text' class='form-control' placeholder="e.g. 106 or 15"/>
                            </div>
                            <div class='form-group'>
                                <label>Milepost</label>
                                <input id='milepost' type='number' min='0' class='form-control' placeholder="e.g. 5.5"/>
                            </div>
                        </div>
                        <div id='address-tab' class='tab-pane'>
                            <div class='form-group'>
                                <label>Street Address</label>
                                <input class='form-control' id='address' type='text' placeholder="e.g. 150 S Main Street"/>
                            </div>
                            <div class='form-group'>
                                <label>Zip Code or City</label>
                                <input class='form-control' id='zipcity' type='text' placeholder="e.g. 84121 or Sandy"/>
                            </div>
                        </div>
                    </div>
                    <div class='input'>
                        <button type='button' id='verify-location' class='btn btn-default'>Verify Location</button>
                        <span id='verify-status-text' class='help-inline status-text'>testing </span>
                        <img id='verify-status-img' class='status-img' alt='loader' src='images/ajax-loader.gif'/>
                    </div>
                    <br>

                    <h4>Or by clicking directly on the map</h4>
                    <div class='claro'>
                        <div id='verify-map'>
                            <div id='sherlock-div'></div>
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="actions">
                    <button type='button' id='submit' class="btn btn-primary btn-lg">
                        Submit
                    </button>
                    &nbsp;
                    <button type='button' id='clear' class="btn btn-default btn-lg pull-right">
                        Clear
                    </button>
                    <span id='submit-status-text' class='help-inline status-text'>testing </span>
                    <img id='submit-status-img' class='status-img' alt='loader' src='images/ajax-loader.gif'/>
                </div>
            </form>

            <footer>
                <?php include 'common_html/footer.php'; ?>
            </footer>
        </div>
    </body>
</html>
