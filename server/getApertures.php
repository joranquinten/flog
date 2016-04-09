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

    $lens_id = $_GET['lens_id'];

    $items = array();
    try {
        $dbh = new PDO('mysql:host=localhost;dbname=db_snaps', 'root', '');

        $sql  = ' SELECT number ';
        $sql .= ' FROM ';
        $sql .= '   apertures ';
        $sql .= ' WHERE 1 ';
        if ($lens_id) {
            $sql .= ' AND number >= IFNULL((SELECT min_aperture FROM lenses WHERE lens_id = "'. $lens_id .'"),0) ';
            $sql .= ' AND number <= IFNULL((SELECT max_aperture FROM lenses WHERE lens_id = "'. $lens_id .'"),100) ';
        }
        $sql .= ' ORDER BY number ASC ';
        $sql .= ' ; ';

        // Push to array, to print JSON from
        foreach($dbh->query($sql) as $row) {
            $item = array(
                        'value' => $row[0],
                        'text' => 'f/'. $row[0]
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
    'apertures' => $items
);

echo json_encode($response);
?>
