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

// Actual work, inserting a record

    // Read data
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    $camera_id = $data['cameraId'];
    $lens_id = $data['lensId'];
    $file_name = $data['fileName'];
    $series_name = $data['seriesName'];
    $focal_length = $data['focalLength'];
    $focal_distance = $data['focalDistance'];
    $aperture_size = $data['apertureSize'];
    $file_date = $data['fileDate'];
    $locationLat = $data['locationLat'];
    $locationLong = $data['locationLong'];
    $notes = $data['snapNotes'];

    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' INSERT INTO snaps ';
        $sql .= ' (camera_id, lens_id, file_name, series_name, focal_length, focal_distance, aperture_size, file_date, lat, lng, notes) ';
        $sql .= ' VALUES ';
        $sql .= ' ("'. $camera_id .'", "'. $lens_id .'", "'. $file_name .'", "'. $series_name .'", "'. $focal_length .'", "'. $focal_distance .'", "'. $aperture_size .'", "'.$file_date.'", "'. $locationLat .'", "'. $locationLong .'", "'. $notes .'"); ';

        $dbh->query($sql);
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
    )
);

echo json_encode($response);
?>
