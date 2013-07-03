<HTML>
    <head>
        <?php
            include_once 'fqlquery.php';
        ?>
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src='fql.js'></script>
        <script type="text/javascript" src="script.js"></script>
        
        <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnQp3oEpAmvxa80eL0lyzU5WuyzjB3e7Y&sensor=false">
        </script>
    </head>
    <body onload="initialize()">
        <h1> Facebook Map of Friends</h1>
        <div id="map-canvas"></div>
    </body>

</HTML>