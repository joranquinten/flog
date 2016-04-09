<?php

// Headers
    session_start();
    date_default_timezone_set('Europe/Amsterdam');
    header('Content-Type: application/json');

// Start timer
    $time = microtime();
    $time = explode(' ', $time);
    $time = $time[1] + $time[0];
    $start = $time;


// Get the data

    // Read data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    $camera_id = $_GET['camera_id'];

    $items = array();
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' SELECT lens_id, name, min_aperture, max_aperture, min_focal_length, max_focal_length, camera_id ';
        $sql .= ' FROM ';
        $sql .= '   lenses ';
        $sql .= ' WHERE 1 ';
        if ($camera_id){
            $sql .= ' AND camera_id = "'.$camera_id.'" ';
        }
        $sql .= ' ORDER BY name ASC ';
        $sql .= ' ; ';

        // Push to array, to print JSON from
        foreach($dbh->query($sql) as $row) {
            $item = array(
                        'lens_id' => $row[0],
                        'name' => $row[1],
                        'min_aperture' => $row[2],
                        'max_aperture' => $row[3],
                        'min_focal_length' => $row[4],
                        'max_focal_length' => $row[5],
                        'camera_id' => $row[6]
            );
            array_push($items, $item);
        }

        $dbh = null;

        $success = true;

    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }

// Stop timer
    $time = microtime();
    $time = explode(' ', $time);
    $time = $time[1] + $time[0];
    $finish = $time;
    $total_time = round(($finish - $start), 4);

// Generate readebly result
$response = array(
    'meta' => array(
        'code' => 200,
        'response_time' => array(
            'time' => $total_time,
            'measure' => 'seconds'
            )
        ),
    'result' => array(
        'success' => true
    ),
    'lenses' => $items
);

echo json_encode($response);
?>
